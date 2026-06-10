import { watches } from '@/data/watches'
import {
  QuizAnswers,
  Watch,
  ScoredWatch,
  WatchArchetype,
  RecommendationResult,
  BudgetRange,
  WristSize,
} from '@/types'

const BUDGET_RANGES: Record<BudgetRange, [number, number]> = {
  'under-100': [0, 100],
  '100-250': [100, 250],
  '250-500': [250, 500],
  '500-1000': [500, 1000],
  '1000-2500': [1000, 2500],
  '2500-5000': [2500, 5000],
  '5000-plus': [5000, 100000],
}

const WRIST_PREFERRED_SIZES: Record<WristSize, [number, number]> = {
  'under-6': [28, 37],
  '6-6.5': [34, 38],
  '6.5-7': [36, 40],
  '7-7.5': [38, 42],
  '7.5-8': [40, 44],
  '8-plus': [42, 50],
}

const archetypes: WatchArchetype[] = [
  {
    id: 'modern-professional',
    title: 'Modern Professional',
    description: 'You value precision and polish. Your watch should command respect in a boardroom while not feeling out of place at a Friday evening drinks.',
    caseSizeRange: '38–41mm',
    preferredCategories: ['Dress', 'Integrated Sports', 'Everyday Sports'],
    recommendedMovement: 'Automatic',
    icon: '💼',
  },
  {
    id: 'quiet-luxury',
    title: 'Quiet Luxury Enthusiast',
    description: 'You understand that true luxury whispers. You appreciate heritage, craftsmanship, and the knowing nod from fellow enthusiasts.',
    caseSizeRange: '36–40mm',
    preferredCategories: ['Dress', 'Everyday Sports', 'GMT'],
    recommendedMovement: 'Automatic',
    icon: '✨',
  },
  {
    id: 'everyday-explorer',
    title: 'Everyday Explorer',
    description: 'You need a watch that keeps up with your life — whether that\'s the commute, the countryside, or somewhere between the two.',
    caseSizeRange: '39–42mm',
    preferredCategories: ['Field', 'Dive', 'Everyday Sports'],
    recommendedMovement: 'Either',
    icon: '🧭',
  },
  {
    id: 'vintage-collector',
    title: 'Vintage Collector',
    description: 'History and character matter to you more than spec sheets. You wear your watch for its story, not its data.',
    caseSizeRange: '36–40mm',
    preferredCategories: ['Field', 'Dress', 'Chronograph'],
    recommendedMovement: 'Automatic',
    icon: '🕰️',
  },
  {
    id: 'practical-minimalist',
    title: 'Practical Minimalist',
    description: 'No fuss, no frills. You want something that tells the time beautifully, fits any occasion, and never needs thinking about.',
    caseSizeRange: '36–40mm',
    preferredCategories: ['Dress', 'Casual', 'Everyday Sports'],
    recommendedMovement: 'Quartz',
    icon: '⚡',
  },
  {
    id: 'sports-enthusiast',
    title: 'Active Sports Enthusiast',
    description: 'Performance is everything. Your watch is a tool first, a style piece second — and it needs to handle whatever you throw at it.',
    caseSizeRange: '40–44mm',
    preferredCategories: ['Dive', 'Chronograph', 'Integrated Sports', 'Everyday Sports'],
    recommendedMovement: 'Either',
    icon: '🏃',
  },
]

function getBudgetRange(budget: BudgetRange): [number, number] {
  return BUDGET_RANGES[budget]
}

function isWithinBudget(price: number, budget: BudgetRange): boolean {
  const [min, max] = getBudgetRange(budget)
  return price >= min && price <= max
}

function scoreWatch(watch: Watch, answers: QuizAnswers): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // ── Budget filter ──────────────────────────────────────────────────────────
  if (answers.budget) {
    const [min, max] = getBudgetRange(answers.budget)
    if (watch.price > max * 1.15) return { score: -1, reasons: [] } // hard exclude over-budget
    if (isWithinBudget(watch.price, answers.budget)) {
      score += 25
    } else if (watch.price < min) {
      // Under budget — slight penalty to prefer best-fit recommendations
      score += 10
    }
  }

  // ── Wrist size scoring ─────────────────────────────────────────────────────
  if (answers.wristSize) {
    const [minMm, maxMm] = WRIST_PREFERRED_SIZES[answers.wristSize]
    if (watch.caseSizeMm >= minMm && watch.caseSizeMm <= maxMm) {
      score += 20
      reasons.push(`Ideal ${watch.caseSizeMm}mm case size for your wrist`)
    } else if (
      watch.caseSizeMm >= minMm - 2 &&
      watch.caseSizeMm <= maxMm + 2
    ) {
      score += 10
    }
  }

  // ── Movement preference ────────────────────────────────────────────────────
  if (answers.movementPreference) {
    const pref = answers.movementPreference
    if (pref === 'Automatic' && (watch.movement === 'Automatic' || watch.movement === 'Manual')) {
      score += 15
      reasons.push('Matches your preference for mechanical movement')
    } else if (pref === 'Quartz' && (watch.movement === 'Quartz' || watch.movement === 'Solar')) {
      score += 15
      reasons.push('Matches your preference for quartz reliability')
    } else if (pref === 'Either' || pref === "Don't Know") {
      score += 8
    }
  }

  // ── Clothing style → watch style ──────────────────────────────────────────
  if (answers.clothingStyle && answers.clothingStyle.length > 0) {
    const styles = answers.clothingStyle

    if (styles.includes('Formal')) {
      if (watch.category === 'Dress' || watch.styleTags.includes('Dressy')) {
        score += 12
        reasons.push('Suits your formal dress style')
      }
    }
    if (styles.includes('Old Money')) {
      if (
        watch.styleTags.includes('Old Money') ||
        watch.styleTags.includes('Classic') ||
        ['Rolex', 'Omega', 'Cartier', 'IWC', 'Longines'].includes(watch.brand)
      ) {
        score += 12
        reasons.push('Aligns with old money heritage aesthetics')
      }
    }
    if (styles.includes('Minimalist')) {
      if (watch.styleTags.includes('Minimalist') || watch.styleTags.includes('Understated')) {
        score += 10
        reasons.push('Clean design suits your minimalist style')
      }
    }
    if (styles.includes('Streetwear')) {
      if (
        watch.styleTags.includes('Streetwear') ||
        watch.styleTags.includes('Bold') ||
        watch.styleTags.includes('Sporty') ||
        watch.category === 'Integrated Sports'
      ) {
        score += 12
        reasons.push('Sporty profile complements streetwear')
      }
    }
    if (styles.includes('Vintage')) {
      if (watch.styleTags.includes('Vintage') || watch.category === 'Field') {
        score += 12
        reasons.push('Vintage character matches your style')
      }
    }
    if (styles.includes('Luxury')) {
      if (
        watch.styleTags.includes('Luxury') ||
        ['Rolex', 'Omega', 'Cartier', 'IWC', 'Grand Seiko'].includes(watch.brand)
      ) {
        score += 10
        reasons.push('Premium brand matches your luxury aesthetic')
      }
    }
    if (styles.includes('Athletic')) {
      if (watch.category === 'Dive' || watch.category === 'Everyday Sports' || watch.styleTags.includes('Sporty')) {
        score += 10
        reasons.push('Sports-oriented design suits your athletic style')
      }
    }
    if (styles.includes('Smart Casual')) {
      if (
        watch.category === 'Everyday Sports' ||
        watch.category === 'Field' ||
        watch.styleTags.includes('Professional')
      ) {
        score += 10
        reasons.push('Versatile design suits smart casual dressing')
      }
    }
  }

  // ── Work environment ───────────────────────────────────────────────────────
  if (answers.workEnvironment) {
    const env = answers.workEnvironment
    if (env === 'Formal') {
      if (watch.category === 'Dress' || watch.styleTags.includes('Dressy')) {
        score += 10
        reasons.push('Ideal for your formal work environment')
      }
    }
    if (env === 'Physical Labour') {
      if (watch.waterResistanceM >= 100 && watch.movement === 'Quartz') {
        score += 10
        reasons.push('Quartz reliability and durability for physical work')
      }
      if (watch.brand === 'Casio' || watch.category === 'Everyday Sports') {
        score += 8
        reasons.push('Rugged and practical for hands-on work')
      }
    }
    if (env === 'Business Casual' || env === 'Remote') {
      if (
        watch.category !== 'Dress' &&
        watch.category !== 'Dive' &&
        (watch.styleTags.includes('Professional') || watch.styleTags.includes('Classic'))
      ) {
        score += 8
        reasons.push('Versatile design for your work setting')
      }
    }
  }

  // ── Occupation / budget affinity ───────────────────────────────────────────
  if (answers.occupation) {
    const occ = answers.occupation
    const budgetTier = answers.budget

    if (occ === 'Student' && budgetTier && ['under-100', '100-250'].includes(budgetTier)) {
      if (['Casio', 'Seiko', 'Citizen', 'Orient'].includes(watch.brand)) {
        score += 10
        reasons.push('Excellent value from a trusted brand')
      }
    }
    if ((occ === 'Finance' || occ === 'Business Owner') && watch.styleTags.includes('Luxury')) {
      score += 8
      reasons.push('Communicates success in your professional context')
    }
    if (occ === 'Tradesperson' || occ === 'Healthcare') {
      if (watch.waterResistanceM >= 100 && ['Quartz', 'Solar'].includes(watch.movement)) {
        score += 10
        reasons.push('Practical durability for your profession')
      }
    }
    if (occ === 'Creative' && watch.styleTags.includes('Vintage')) {
      score += 8
      reasons.push('Vintage character matches creative sensibilities')
    }
  }

  // ── Usage context ──────────────────────────────────────────────────────────
  if (answers.usage && answers.usage.length > 0) {
    const usage = answers.usage

    if (usage.includes('Sports') && watch.waterResistanceM >= 100) {
      score += 8
      reasons.push('Suitable water resistance for sports')
    }
    if (usage.includes('Travel') && (watch.category === 'GMT' || watch.waterResistanceM >= 100)) {
      score += 8
      reasons.push(watch.category === 'GMT' ? 'GMT complication ideal for travel' : 'Robust enough for travel adventures')
    }
    if (usage.includes('Weddings') && (watch.category === 'Dress' || watch.styleTags.includes('Dressy'))) {
      score += 10
      reasons.push('Elegant enough for weddings and formal occasions')
    }
    if (usage.includes('First Watch') && ['Casio', 'Seiko', 'Citizen', 'Orient', 'Tissot'].includes(watch.brand)) {
      score += 10
      reasons.push('Perfect introduction to quality watchmaking')
    }
    if (usage.includes('Collecting') && watch.price > 500) {
      score += 6
      reasons.push('Has the depth and heritage worth collecting')
    }
    if (usage.includes('Daily Wear') && watch.waterResistanceM >= 50) {
      score += 5
      reasons.push('Practical water resistance for daily use')
    }
  }

  // ── Watch personality ──────────────────────────────────────────────────────
  if (answers.watchPersonality) {
    const personality = answers.watchPersonality
    if (personality === 'Understated' && (watch.styleTags.includes('Understated') || watch.styleTags.includes('Minimalist'))) {
      score += 10
      reasons.push('Quietly confident — just like you prefer')
    }
    if (personality === 'Statement Piece' && (watch.styleTags.includes('Bold') || watch.price > 3000)) {
      score += 10
      reasons.push('Commands attention as a true statement piece')
    }
    if (personality === 'Balanced') {
      score += 5 // balanced gets mild boost across the board
    }
  }

  return { score, reasons }
}

function determineArchetype(answers: QuizAnswers): WatchArchetype {
  let scores: Record<string, number> = {
    'modern-professional': 0,
    'quiet-luxury': 0,
    'everyday-explorer': 0,
    'vintage-collector': 0,
    'practical-minimalist': 0,
    'sports-enthusiast': 0,
  }

  const env = answers.workEnvironment
  const styles = answers.clothingStyle || []
  const usage = answers.usage || []
  const budget = answers.budget
  const personality = answers.watchPersonality
  const movement = answers.movementPreference

  if (env === 'Formal' || env === 'Business Casual') scores['modern-professional'] += 3
  if (styles.includes('Formal') || styles.includes('Smart Casual')) scores['modern-professional'] += 2
  if (['Finance', 'Business Owner', 'Tech'].includes(answers.occupation || '')) scores['modern-professional'] += 2

  if (styles.includes('Old Money') || styles.includes('Luxury')) scores['quiet-luxury'] += 4
  if (personality === 'Understated') scores['quiet-luxury'] += 2
  if (budget && ['2500-5000', '5000-plus'].includes(budget)) scores['quiet-luxury'] += 2

  if (usage.includes('Travel') || styles.includes('Streetwear')) scores['everyday-explorer'] += 2
  if (usage.includes('Sports')) scores['everyday-explorer'] += 2
  if (env === 'Casual' || env === 'Remote') scores['everyday-explorer'] += 2

  if (styles.includes('Vintage')) scores['vintage-collector'] += 4
  if (usage.includes('Collecting')) scores['vintage-collector'] += 4
  if (movement === 'Automatic') scores['vintage-collector'] += 2

  if (styles.includes('Minimalist')) scores['practical-minimalist'] += 4
  if (movement === 'Quartz' || movement === "Don't Know") scores['practical-minimalist'] += 2
  if (budget && ['under-100', '100-250'].includes(budget)) scores['practical-minimalist'] += 2

  if (styles.includes('Athletic')) scores['sports-enthusiast'] += 4
  if (personality === 'Statement Piece') scores['sports-enthusiast'] += 2
  if (env === 'Physical Labour') scores['sports-enthusiast'] += 3

  const topId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return archetypes.find((a) => a.id === topId) || archetypes[0]
}

export function generateRecommendations(answers: QuizAnswers): RecommendationResult {
  const archetype = determineArchetype(answers)

  const scored: ScoredWatch[] = watches
    .map((watch) => {
      const { score, reasons } = scoreWatch(watch, answers)
      // Deduplicate reasons and take top 3
      const uniqueReasons = [...new Set(reasons)].slice(0, 3)
      return { ...watch, score, matchReasons: uniqueReasons }
    })
    .filter((w) => w.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  // If we get fewer than 5 results, loosen budget filter and retry
  if (scored.length < 5 && answers.budget) {
    const relaxed: ScoredWatch[] = watches
      .map((watch) => {
        const { score, reasons } = scoreWatch(watch, { ...answers, budget: undefined })
        const uniqueReasons = [...new Set(reasons)].slice(0, 3)
        return { ...watch, score, matchReasons: uniqueReasons }
      })
      .filter((w) => w.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    return { archetype, recommendations: relaxed }
  }

  return { archetype, recommendations: scored }
}
