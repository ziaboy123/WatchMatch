'use client'

import { useState } from 'react'
import { WatchPlaceholder } from './WatchPlaceholder'

interface WatchImageProps {
  src: string
  brand: string
  model: string
  category: string
  size?: 'card' | 'swipe'
  className?: string
}

/**
 * Resilient watch image that falls back to a branded placeholder if
 * the URL is empty or the image fails to load (network error, ORB block,
 * CDN 4xx, etc.). Uses crossOrigin="anonymous" so CORS-enabled hosts like
 * Wikimedia Commons are fetched in cors mode, bypassing Chrome's ORB check.
 */
export function WatchImage({
  src,
  brand,
  model,
  category,
  size = 'card',
  className = 'absolute inset-0 w-full h-full object-contain p-3',
}: WatchImageProps) {
  const [failed, setFailed] = useState(false)

  const watch = { brand, model, category: category as import('@/types').WatchCategory }

  if (!src || failed) {
    return <WatchPlaceholder watch={watch} size={size} />
  }

  return (
    <img
      src={src}
      alt={`${brand} ${model}`}
      className={className}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
