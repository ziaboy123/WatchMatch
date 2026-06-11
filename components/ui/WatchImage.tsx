'use client'

import { useState } from 'react'
import type { WatchCategory } from '@/types'
import { WatchPlaceholder } from './WatchPlaceholder'

interface WatchImageProps {
  src: string
  brand: string
  model: string
  category: string
  size?: 'card' | 'swipe'
  className?: string
}

function proxyUrl(src: string): string {
  if (!src) return ''
  return `/api/img?url=${encodeURIComponent(src)}`
}

export function WatchImage({
  src,
  brand,
  model,
  category,
  size = 'card',
  className = 'absolute inset-0 w-full h-full object-contain p-3',
}: WatchImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const watch = { brand, model, category: category as WatchCategory }
  const hasUrl = Boolean(src && src.trim())
  const showPlaceholder = !hasUrl || failed || !loaded
  const showImg = hasUrl && !failed

  return (
    <>
      {showPlaceholder && <WatchPlaceholder watch={watch} size={size} />}

      {showImg && (
        <img
          src={proxyUrl(src)}
          alt={`${brand} ${model}`}
          className={className}
          style={loaded ? undefined : { display: 'none' }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </>
  )
}
