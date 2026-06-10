export interface Watch {
  id: string
  brand: string
  model: string
  category: WatchCategory
  /** Mid-point price used for internal scoring — never shown raw to users */
  price: number
  /** Human-readable estimated price range, e.g. "£80 – £120" */
  priceRange: string
  currency: string
  movement: MovementType
  caseSizeMm: number
  waterResistanceM: number
  styleTags: StyleTag[]
  dialColour: DialColour
  description: string
  /** Unsplash image URL */
  image: string
  bracelet: string
  caseThicknessMm?: number
  lugsWidthMm?: number
  pros: string[]
  bestUseCase: string
}

export type DialColour =
  | 'black'
  | 'blue'
  | 'white'
  | 'green'
  | 'silver'
  | 'gold'
  | 'grey'
  | 'brown'
  | 'cream'
  | 'multi'

export type WatchCategory =
  | 'Dive'
  | 'Dress'
  | 'Field'
  | 'Chronograph'
  | 'GMT'
  | 'Integrated Sports'
  | 'Everyday Sports'
  | 'Pilot'
  | 'Casual'

export type MovementType = 'Automatic' | 'Quartz' | 'Solar' | 'Manual'

export type StyleTag =
  | 'Minimalist'
  | 'Classic'
  | 'Sporty'
  | 'Luxury'
  | 'Vintage'
  | 'Tool Watch'
  | 'Dressy'
  | 'Casual'
  | 'Bold'
  | 'Understated'
  | 'Old Money'
  | 'Streetwear'
  | 'Professional'
  | 'Statement Piece'
  | 'Rugged'

export interface QuizAnswers {
  age?: number
  wristSize?: WristSize
  occupation?: Occupation
  workEnvironment?: WorkEnvironment
  clothingStyle?: ClothingStyle[]
  watchPersonality?: WatchPersonality
  usage?: UsageContext[]
  movementPreference?: MovementPreference
  budget?: BudgetRange
  // V2 additions
  styleAesthetic?: StyleAesthetic
  colourPreference?: ColourPreference[]
  braceletPreference?: BraceletPreference
  emotionalIntent?: EmotionalIntent[]
}

export type WristSize =
  | 'under-6'
  | '6-6.5'
  | '6.5-7'
  | '7-7.5'
  | '7.5-8'
  | '8-plus'

export type Occupation =
  | 'Student'
  | 'Office Worker'
  | 'Finance'
  | 'Tech'
  | 'Tradesperson'
  | 'Healthcare'
  | 'Business Owner'
  | 'Creative'
  | 'Other'

export type WorkEnvironment =
  | 'Formal'
  | 'Business Casual'
  | 'Casual'
  | 'Physical Labour'
  | 'Remote'

export type ClothingStyle =
  | 'Streetwear'
  | 'Smart Casual'
  | 'Formal'
  | 'Minimalist'
  | 'Old Money'
  | 'Luxury'
  | 'Vintage'
  | 'Athletic'

export type WatchPersonality =
  | 'Understated'
  | 'Balanced'
  | 'Statement Piece'

export type UsageContext =
  | 'Daily Wear'
  | 'Office'
  | 'Travel'
  | 'Weddings'
  | 'Sports'
  | 'Collecting'
  | 'First Watch'

export type MovementPreference =
  | 'Automatic'
  | 'Quartz'
  | 'Either'
  | "Don't Know"

export type BudgetRange =
  | 'under-100'
  | '100-250'
  | '250-500'
  | '500-1000'
  | '1000-2500'
  | '2500-5000'
  | '5000-plus'

// ── V2 quiz types ──────────────────────────────────────────────────────────

export type StyleAesthetic =
  | 'quiet-luxury'
  | 'sporty-tool'
  | 'vintage-inspired'
  | 'flashy-statement'
  | 'minimal-clean'

export type ColourPreference =
  | 'black'
  | 'blue'
  | 'white'
  | 'green'
  | 'silver'
  | 'gold'

export type BraceletPreference =
  | 'leather'
  | 'steel'
  | 'rubber'
  | 'no-preference'

export type EmotionalIntent =
  | 'confident'
  | 'understated'
  | 'professional'
  | 'rugged'
  | 'stylish'

// ── Swipe / Discovery mode types ───────────────────────────────────────────────

export type SwipeDecision = 'like' | 'dislike' | 'maybe'

export interface SwipeResult {
  watchId: string
  decision: SwipeDecision
}

export interface SwipePreferences {
  likedBrands: Record<string, number>        // brand → weight
  likedCategories: Record<string, number>    // category → weight
  likedStyleTags: Record<string, number>     // tag → weight
  likedMovements: Record<string, number>     // movement → weight
  likedCaseSizes: number[]                   // raw liked case sizes
  preferredPriceRange: [number, number]      // inferred from likes
  likedWatchIds: string[]
  dislikedWatchIds: string[]
  maybeWatchIds: string[]
}

// ── Updated recommendation result ──────────────────────────────────────────

export interface WatchArchetype {
  id: string
  title: string
  description: string
  caseSizeRange: string
  preferredCategories: WatchCategory[]
  recommendedMovement: string
  icon: string
}

export interface ScoredWatch extends Watch {
  score: number
  matchReasons: string[]
}

export interface RecommendationResult {
  archetype: WatchArchetype
  recommendations: ScoredWatch[]
  hasSwipeData: boolean
}
