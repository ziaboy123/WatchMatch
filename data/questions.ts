export interface QuizOption {
  value: string
  label: string
  description?: string
}

export interface QuizQuestion {
  id: string
  step: number
  title: string
  subtitle?: string
  type: 'single' | 'multi' | 'number'
  field: string
  options?: QuizOption[]
  min?: number
  max?: number
  placeholder?: string
}

export const questions: QuizQuestion[] = [
  {
    id: 'age',
    step: 1,
    title: 'How old are you?',
    subtitle: 'Helps us tailor recommendations to where you are in life.',
    type: 'number',
    field: 'age',
    min: 16,
    max: 99,
    placeholder: 'e.g. 28',
  },
  {
    id: 'wristSize',
    step: 2,
    title: 'What\'s your wrist circumference?',
    subtitle: 'Case size is the single most important factor in how a watch looks on your wrist.',
    type: 'single',
    field: 'wristSize',
    options: [
      { value: 'under-6', label: 'Under 6"', description: 'Very slim — suits 32–36mm cases' },
      { value: '6-6.5', label: '6 – 6.5"', description: 'Slim — suits 36–38mm cases' },
      { value: '6.5-7', label: '6.5 – 7"', description: 'Average — suits 38–40mm cases' },
      { value: '7-7.5', label: '7 – 7.5"', description: 'Medium — suits 40–42mm cases' },
      { value: '7.5-8', label: '7.5 – 8"', description: 'Large — suits 42–44mm cases' },
      { value: '8-plus', label: '8"+', description: 'Very large — suits 44mm+ cases' },
    ],
  },
  {
    id: 'occupation',
    step: 3,
    title: 'What best describes your occupation?',
    subtitle: 'Your work shapes how your watch needs to perform.',
    type: 'single',
    field: 'occupation',
    options: [
      { value: 'Student', label: 'Student' },
      { value: 'Office Worker', label: 'Office Worker' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Tech', label: 'Tech' },
      { value: 'Tradesperson', label: 'Tradesperson' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Business Owner', label: 'Business Owner' },
      { value: 'Creative', label: 'Creative' },
      { value: 'Other', label: 'Other' },
    ],
  },
  {
    id: 'workEnvironment',
    step: 4,
    title: 'How would you describe your work environment?',
    subtitle: 'Context shapes whether you need a watch to dress up or handle punishment.',
    type: 'single',
    field: 'workEnvironment',
    options: [
      { value: 'Formal', label: 'Formal', description: 'Suits, meetings, corporate' },
      { value: 'Business Casual', label: 'Business Casual', description: 'Smart but relaxed' },
      { value: 'Casual', label: 'Casual', description: 'Jeans and trainers are fine' },
      { value: 'Physical Labour', label: 'Physical Labour', description: 'Hands-on, outdoors, demanding' },
      { value: 'Remote', label: 'Remote / WFH', description: 'Flexible, home-based' },
    ],
  },
  {
    id: 'clothingStyle',
    step: 5,
    title: 'How do you typically dress?',
    subtitle: 'Select all that apply — your style determines the right watch aesthetic.',
    type: 'multi',
    field: 'clothingStyle',
    options: [
      { value: 'Streetwear', label: 'Streetwear' },
      { value: 'Smart Casual', label: 'Smart Casual' },
      { value: 'Formal', label: 'Formal' },
      { value: 'Minimalist', label: 'Minimalist' },
      { value: 'Old Money', label: 'Old Money' },
      { value: 'Luxury', label: 'Luxury' },
      { value: 'Vintage', label: 'Vintage' },
      { value: 'Athletic', label: 'Athletic' },
    ],
  },
  {
    id: 'watchPersonality',
    step: 6,
    title: 'What kind of watch wearer are you?',
    subtitle: 'This tells us whether you want your watch to blend in or stand out.',
    type: 'single',
    field: 'watchPersonality',
    options: [
      { value: 'Understated', label: 'Understated', description: 'I want it to be noticed only by those in the know' },
      { value: 'Balanced', label: 'Balanced', description: 'I want it to look great without being flashy' },
      { value: 'Statement Piece', label: 'Statement Piece', description: 'I want people to notice and ask about it' },
    ],
  },
  {
    id: 'usage',
    step: 7,
    title: 'What will you wear it for?',
    subtitle: 'Select all that apply. This shapes which complications and specs matter.',
    type: 'multi',
    field: 'usage',
    options: [
      { value: 'Daily Wear', label: 'Daily Wear' },
      { value: 'Office', label: 'Office' },
      { value: 'Travel', label: 'Travel' },
      { value: 'Weddings', label: 'Weddings & Events' },
      { value: 'Sports', label: 'Sports & Outdoors' },
      { value: 'Collecting', label: 'Collecting' },
      { value: 'First Watch', label: 'First Proper Watch' },
    ],
  },
  {
    id: 'movementPreference',
    step: 8,
    title: 'Any preference on movement type?',
    subtitle: 'Automatic watches tick mechanically — quartz runs on a battery.',
    type: 'single',
    field: 'movementPreference',
    options: [
      { value: 'Automatic', label: 'Automatic', description: 'I want the romance of mechanical movement' },
      { value: 'Quartz', label: 'Quartz / Solar', description: 'I want reliable accuracy with no fuss' },
      { value: 'Either', label: 'Either is fine', description: 'I\'m open to both' },
      { value: "Don't Know", label: 'Not sure', description: 'Help me decide' },
    ],
  },
  {
    id: 'budget',
    step: 9,
    title: 'What\'s your budget?',
    subtitle: 'We\'ll match you to the best watches in your range — every tier has gems.',
    type: 'single',
    field: 'budget',
    options: [
      { value: 'under-100', label: 'Under £100' },
      { value: '100-250', label: '£100 – £250' },
      { value: '250-500', label: '£250 – £500' },
      { value: '500-1000', label: '£500 – £1,000' },
      { value: '1000-2500', label: '£1,000 – £2,500' },
      { value: '2500-5000', label: '£2,500 – £5,000' },
      { value: '5000-plus', label: '£5,000+' },
    ],
  },
]
