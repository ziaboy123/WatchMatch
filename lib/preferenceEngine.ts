import { watches } from '@/data/watches'
import { SwipeResult, SwipePreferences } from '@/types'

/**
 * Analyses swipe results and extracts weighted preference signals.
 * Likes count full weight, maybes count half weight, dislikes reduce weights.
 */
export function buildSwipePreferences(swipes: SwipeResult[]): SwipePreferences {
  const likedBrands: Record<string, number> = {}
  const likedCategories: Record<string, number> = {}
  const likedStyleTags: Record<string, number> = {}
  const likedMovements: Record<string, number> = {}
  const likedCaseSizes: number[] = []
  const likedPrices: number[] = []

  const likedIds: string[] = []
  const dislikedIds: string[] = []
  const maybeIds: string[] = []

  for (const swipe of swipes) {
    const watch = watches.find((w) => w.id === swipe.watchId)
    if (!watch) continue

    const weight =
      swipe.decision === 'like' ? 1.0 :
      swipe.decision === 'maybe' ? 0.5 : -0.4

    // Aggregate brand
    likedBrands[watch.brand] = (likedBrands[watch.brand] ?? 0) + weight

    // Aggregate category
    likedCategories[watch.category] = (likedCategories[watch.category] ?? 0) + weight

    // Aggregate style tags
    for (const tag of watch.styleTags) {
      likedStyleTags[tag] = (likedStyleTags[tag] ?? 0) + weight
    }

    // Aggregate movement
    likedMovements[watch.movement] = (likedMovements[watch.movement] ?? 0) + weight

    // Collect case sizes and prices for liked/maybe only
    if (swipe.decision === 'like' || swipe.decision === 'maybe') {
      likedCaseSizes.push(watch.caseSizeMm)
      likedPrices.push(watch.price)
    }

    // Track IDs
    if (swipe.decision === 'like') likedIds.push(watch.id)
    else if (swipe.decision === 'dislike') dislikedIds.push(watch.id)
    else maybeIds.push(watch.id)
  }

  // Infer price range from liked watches
  let preferredPriceRange: [number, number] = [0, 100000]
  if (likedPrices.length > 0) {
    const sorted = [...likedPrices].sort((a, b) => a - b)
    const p10 = sorted[Math.floor(sorted.length * 0.1)] ?? sorted[0]
    const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? sorted[sorted.length - 1]
    // Give a ±30% buffer
    preferredPriceRange = [p10 * 0.7, p90 * 1.3]
  }

  return {
    likedBrands,
    likedCategories,
    likedStyleTags,
    likedMovements,
    likedCaseSizes,
    preferredPriceRange,
    likedWatchIds: likedIds,
    dislikedWatchIds: dislikedIds,
    maybeWatchIds: maybeIds,
  }
}

/**
 * Scores a single watch against swipe preference signals.
 * Returns a score 0–40 and descriptive reasons.
 */
export function scoreWatchBySwipePreferences(
  watch: { id: string; brand: string; category: string; styleTags: string[]; movement: string; caseSizeMm: number; price: number },
  prefs: SwipePreferences
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Hard exclude disliked watches
  if (prefs.dislikedWatchIds.includes(watch.id)) return { score: -1, reasons: [] }

  // Bonus for exact liked / maybe watches
  if (prefs.likedWatchIds.includes(watch.id)) {
    score += 10
    reasons.push('You liked this watch during swiping')
  }
  if (prefs.maybeWatchIds.includes(watch.id)) {
    score += 4
  }

  // Brand affinity (max +10)
  const brandScore = prefs.likedBrands[watch.brand] ?? 0
  if (brandScore > 0) {
    const capped = Math.min(brandScore * 4, 10)
    score += capped
    if (capped >= 4) reasons.push(`You responded well to ${watch.brand} watches`)
  }

  // Category affinity (max +8)
  const catScore = prefs.likedCategories[watch.category] ?? 0
  if (catScore > 0) {
    const capped = Math.min(catScore * 3, 8)
    score += capped
    if (capped >= 3) reasons.push(`Matches your preferred ${watch.category.toLowerCase()} style`)
  }

  // Style tag affinity (max +8)
  let tagTotal = 0
  for (const tag of watch.styleTags) {
    tagTotal += prefs.likedStyleTags[tag] ?? 0
  }
  if (tagTotal > 0) {
    const capped = Math.min(tagTotal * 2, 8)
    score += capped
    if (capped >= 3) reasons.push('Visual style matches your swipe preferences')
  }

  // Case size affinity (max +6)
  if (prefs.likedCaseSizes.length > 0) {
    const avgLiked = prefs.likedCaseSizes.reduce((a, b) => a + b, 0) / prefs.likedCaseSizes.length
    const diff = Math.abs(watch.caseSizeMm - avgLiked)
    if (diff <= 2) {
      score += 6
      reasons.push(`${watch.caseSizeMm}mm is close to the sizes you gravitated toward`)
    } else if (diff <= 4) {
      score += 3
    }
  }

  // Price range affinity (max +5)
  const [minP, maxP] = prefs.preferredPriceRange
  if (watch.price >= minP && watch.price <= maxP) {
    score += 5
    reasons.push('Fits within the price range you preferred')
  }

  // Movement affinity (max +3)
  const movScore = prefs.likedMovements[watch.movement] ?? 0
  if (movScore > 0) {
    score += Math.min(movScore * 1.5, 3)
  }

  return { score: Math.max(0, score), reasons }
}
