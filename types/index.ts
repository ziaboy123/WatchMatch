export interface Watch {
  id: string
  brand: string
  model: string
  category: WatchCategory
  price: number
  currency: string
  movement: MovementType
  caseSizeMm: number
  waterResistanceM: number
  styleTags: StyleTag[]
  description: string
  imageUrl: string
  bracelet: string
  caseThicknessMm?: number
  lugsWidthMm?: number
  pros: string[]
  bestUseCase: string
}

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
}
