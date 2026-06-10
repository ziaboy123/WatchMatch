import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Internal price formatter — not shown directly to users */
export function formatPrice(price: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Display an estimated price range with clear "est." prefix.
 * Pass the watch's priceRange string directly from the data model.
 */
export function formatEstimatedPrice(priceRange: string): string {
  return `Est. ${priceRange}`
}
