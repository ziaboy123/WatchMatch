import { NextRequest, NextResponse } from 'next/server'
import { watches } from '@/data/watches'

// Every watch photo is a Wikimedia Commons thumbnail, so that's all this proxies
const ALLOWED_HOST = 'upload.wikimedia.org'
const ALLOWED_PATH_PREFIX = '/wikipedia/commons/thumb/'

// The biggest 500px thumb in the data is ~600 KB, so 5 MB is loads of headroom
const MAX_BYTES = 5 * 1024 * 1024
const TIMEOUT_MS = 8000
const MAX_REDIRECTS = 2

// Plain raster images only: no SVG or HTML that could run script on our domain
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

// Only the ~70 listed photos can ever get in (~5.5 MB, largest ~600 KB), so these caps are just a backstop if the data grows
const CACHE_MAX_BYTES = 64 * 1024 * 1024
const CACHE_MAX_ENTRIES = 500

// Failures only stick for a few seconds, just enough to stop a burst of visitors hammering a broken image
const FAIL_TTL_MS = 15_000
const FAILED_MAX_ENTRIES = 500

// Wikimedia's 429s are about us as a whole, so back off every uncached image for a bit (capped so we don't sulk for ages)
const RATE_LIMIT_DEFAULT_MS = 30_000
const RATE_LIMIT_MIN_MS = 5_000
const RATE_LIMIT_MAX_MS = 120_000

type CachedImage = { bytes: Uint8Array<ArrayBuffer>; type: string; size: number }
type Fetched =
  | { ok: true; bytes: Uint8Array<ArrayBuffer>; type: string }
  | { ok: false; status: number; error: string; retryAfterMs?: number }

// Photos we've already fetched, so each one only hits Wikimedia once (Map order = least recently used first)
const cache = new Map<string, CachedImage>()
let cacheBytes = 0

// Recent failures per URL, so a broken image doesn't get re-fetched by every visitor
const failed = new Map<string, { status: number; error: string; until: number }>()

// When Wikimedia last told us to slow down, nothing uncached goes upstream until this time
let rateLimitedUntil = 0

// Requests for the same photo that land together share one upstream fetch
const inflight = new Map<string, Promise<Fetched>>()

function fail(status: number, error: string, retryAfterMs?: number) {
  const res = NextResponse.json({ error }, { status })
  if (retryAfterMs !== undefined) res.headers.set('Retry-After', String(Math.max(1, Math.ceil(retryAfterMs / 1000))))
  return res
}

// https on the normal port, no logins in the URL, no query, and only the thumbnails folder
function isAllowed(url: URL): boolean {
  return (
    url.protocol === 'https:' &&
    url.hostname === ALLOWED_HOST &&
    url.port === '' &&
    url.username === '' &&
    url.password === '' &&
    url.search === '' &&
    url.pathname.startsWith(ALLOWED_PATH_PREFIX)
  )
}

// A #fragment or a bare "?" never reaches Wikimedia but would change href, so drop them before using it as a key
function photoKey(url: URL): string {
  url.hash = ''
  url.search = ''
  return url.href
}

// The photos the site actually shows. Anything else gets a 403, so nobody can use us to fetch random
// Commons files (burning our Wikimedia rate limit) or flush the real photos out of the cache
const WATCH_PHOTOS = new Set(
  watches.flatMap((watch) => {
    if (!watch.image) return []
    try {
      const url = new URL(watch.image)
      return isAllowed(url) ? [photoKey(url)] : []
    } catch {
      return []
    }
  }),
)

// Reads the body but bails out as soon as it goes over the cap, since Content-Length can lie
async function readCapped(body: ReadableStream<Uint8Array>, max: number): Promise<Uint8Array<ArrayBuffer> | null> {
  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > max) {
      await reader.cancel().catch(() => {})
      return null
    }
    chunks.push(value)
  }

  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

// Retry-After can be seconds or a date; clamp it so a silly value can't block images for ages
function parseRetryAfter(header: string | null): number {
  if (!header) return RATE_LIMIT_DEFAULT_MS
  const secs = Number(header)
  const ms = Number.isFinite(secs) ? secs * 1000 : Date.parse(header) - Date.now()
  if (!Number.isFinite(ms)) return RATE_LIMIT_DEFAULT_MS
  return Math.min(RATE_LIMIT_MAX_MS, Math.max(RATE_LIMIT_MIN_MS, ms))
}

function cacheGet(key: string): CachedImage | null {
  const hit = cache.get(key)
  if (!hit) return null
  // Re-insert so it counts as most recently used
  cache.delete(key)
  cache.set(key, hit)
  return hit
}

function cachePut(key: string, bytes: Uint8Array<ArrayBuffer>, type: string) {
  const size = bytes.byteLength + key.length
  if (size > CACHE_MAX_BYTES) return

  const old = cache.get(key)
  if (old) {
    cache.delete(key)
    cacheBytes -= old.size
  }
  cache.set(key, { bytes, type, size })
  cacheBytes += size

  // Kick out the least recently used until we're back under both caps
  for (const [oldKey, entry] of cache) {
    if (cacheBytes <= CACHE_MAX_BYTES && cache.size <= CACHE_MAX_ENTRIES) break
    cache.delete(oldKey)
    cacheBytes -= entry.size
  }
}

function recentFailure(key: string) {
  const entry = failed.get(key)
  if (!entry) return null
  if (entry.until > Date.now()) return entry
  failed.delete(key)
  return null
}

function rememberFailure(key: string, status: number, error: string) {
  const now = Date.now()
  failed.delete(key)
  failed.set(key, { status, error, until: now + FAIL_TTL_MS })

  // Everything shares one TTL so the oldest are first: drop expired ones, then trim if it's still too big
  for (const [oldKey, entry] of failed) {
    if (entry.until > now && failed.size <= FAILED_MAX_ENTRIES) break
    failed.delete(oldKey)
  }
}

// One trip to Wikimedia with every check from before; never throws, always hands back a result
async function fetchUpstream(target: URL): Promise<Fetched> {
  // One timer for the whole thing (redirects + body), so a slow upstream can't hang us
  const signal = AbortSignal.timeout(TIMEOUT_MS)

  try {
    let upstream: Response | null = null

    // Follow redirects by hand so every hop gets checked against the same rules
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const res = await fetch(target.href, {
        redirect: 'manual',
        signal,
        cache: 'no-store',
        headers: {
          'User-Agent': 'WatchMatch/1.0 (https://daniyalzia.co.uk/watchmatch; image proxy)',
          Accept: 'image/webp,image/jpeg,image/png,image/gif',
        },
      })

      if (res.status < 300 || res.status >= 400) {
        upstream = res
        break
      }

      await res.body?.cancel().catch(() => {})
      const location = res.headers.get('location')
      if (!location) return { ok: false, status: 502, error: 'Upstream error' }

      let next: URL
      try {
        next = new URL(location, target)
      } catch {
        return { ok: false, status: 502, error: 'Upstream error' }
      }
      if (!isAllowed(next)) return { ok: false, status: 502, error: 'Upstream error' }
      target = next
    }

    // Still redirecting after the last hop
    if (!upstream) return { ok: false, status: 502, error: 'Upstream error' }

    // Pass Wikimedia's "slow down" on as a 429 instead of hiding it behind a 502
    if (upstream.status === 429) {
      await upstream.body?.cancel().catch(() => {})
      return { ok: false, status: 429, error: 'Upstream busy', retryAfterMs: parseRetryAfter(upstream.headers.get('retry-after')) }
    }

    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel().catch(() => {})
      return { ok: false, status: 502, error: 'Upstream error' }
    }

    const type = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.has(type)) {
      await upstream.body.cancel().catch(() => {})
      return { ok: false, status: 502, error: 'Upstream error' }
    }

    const declared = Number(upstream.headers.get('content-length'))
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      await upstream.body.cancel().catch(() => {})
      return { ok: false, status: 413, error: 'Image too large' }
    }

    const bytes = await readCapped(upstream.body, MAX_BYTES)
    if (!bytes) return { ok: false, status: 413, error: 'Image too large' }

    return { ok: true, bytes, type }
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { ok: false, status: 504, error: 'Upstream timeout' }
    }
    return { ok: false, status: 502, error: 'Upstream error' }
  }
}

// Fetches once, then files the result away (cache, failure list or rate-limit backoff) before anyone waiting sees it
function fetchShared(key: string, target: URL): Promise<Fetched> {
  const pending = inflight.get(key)
  if (pending) return pending

  const shared = fetchUpstream(target)
    .then((result) => {
      if (result.ok) {
        cachePut(key, result.bytes, result.type)
      } else if (result.status === 429) {
        rateLimitedUntil = Math.max(rateLimitedUntil, Date.now() + (result.retryAfterMs ?? RATE_LIMIT_DEFAULT_MS))
      } else {
        rememberFailure(key, result.status, result.error)
      }
      return result
    })
    .finally(() => inflight.delete(key))

  inflight.set(key, shared)
  return shared
}

function imageResponse(bytes: Uint8Array<ArrayBuffer>, type: string, cacheState: 'HIT' | 'MISS') {
  // Response copies the bytes, so the cached copy never gets handed out or changed
  return new NextResponse(bytes, {
    headers: {
      // Our own type from the allowlist, never the upstream header as-is
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Cache': cacheState,
    },
  })
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return fail(400, 'Missing url param')
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return fail(400, 'Invalid URL')
  }

  if (!isAllowed(target)) {
    return fail(403, 'URL not allowed')
  }

  // Keyed on the checked, normalised URL (not the raw param) so the same photo always lands in the same slot
  const key = photoKey(target)

  // Exact match only: a %-escaped spelling of a listed photo doesn't count either
  if (!WATCH_PHOTOS.has(key)) {
    return fail(403, 'URL not allowed')
  }

  const hit = cacheGet(key)
  if (hit) return imageResponse(hit.bytes, hit.type, 'HIT')

  const recent = recentFailure(key)
  if (recent) return fail(recent.status, recent.error)

  // Joining a fetch that's already going costs Wikimedia nothing, so only new fetches wait out a rate limit
  if (!inflight.has(key)) {
    const wait = rateLimitedUntil - Date.now()
    if (wait > 0) return fail(429, 'Upstream busy', wait)
  }

  const result = await fetchShared(key, target)
  if (result.ok) return imageResponse(result.bytes, result.type, 'MISS')
  return fail(result.status, result.error, result.retryAfterMs)
}
