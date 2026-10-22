/** Parse URL fragment parameters (#key=value&key2=value2). */
export function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {}
  const h = hash.startsWith('#') ? hash.slice(1) : hash
  if (!h) return params
  for (const part of h.split('&')) {
    const eqIdx = part.indexOf('=')
    if (eqIdx === -1) continue
    try {
      const k = decodeURIComponent(part.slice(0, eqIdx))
      const v = decodeURIComponent(part.slice(eqIdx + 1))
      if (k) params[k] = v
    } catch {
      // skip malformed segment
    }
  }
  return params
}
