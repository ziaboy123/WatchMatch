import { NextRequest, NextResponse } from 'next/server'

// Every watch photo is a Wikimedia Commons thumbnail, so that's all this proxies
const ALLOWED_HOST = 'upload.wikimedia.org'
const ALLOWED_PATH_PREFIX = '/wikipedia/commons/thumb/'

// The biggest 500px thumb in the data is ~600 KB, so 5 MB is loads of headroom
const MAX_BYTES = 5 * 1024 * 1024
const TIMEOUT_MS = 8000
const MAX_REDIRECTS = 2

// Plain raster images only: no SVG or HTML that could run script on our domain
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status })
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
      if (!location) return fail(502, 'Upstream error')

      let next: URL
      try {
        next = new URL(location, target)
      } catch {
        return fail(502, 'Upstream error')
      }
      if (!isAllowed(next)) return fail(502, 'Upstream error')
      target = next
    }

    // Still redirecting after the last hop
    if (!upstream) return fail(502, 'Upstream error')

    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel().catch(() => {})
      return fail(502, 'Upstream error')
    }

    const type = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.has(type)) {
      await upstream.body.cancel().catch(() => {})
      return fail(502, 'Upstream error')
    }

    const declared = Number(upstream.headers.get('content-length'))
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      await upstream.body.cancel().catch(() => {})
      return fail(413, 'Image too large')
    }

    const bytes = await readCapped(upstream.body, MAX_BYTES)
    if (!bytes) return fail(413, 'Image too large')

    return new NextResponse(bytes, {
      headers: {
        // Our own type from the allowlist, never the upstream header as-is
        'Content-Type': type,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return fail(504, 'Upstream timeout')
    }
    return fail(502, 'Upstream error')
  }
}
