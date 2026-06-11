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

/**
 * Resilient watch image with placeholder-first rendering.
 *
 * Strategy:
 *  1. Placeholder renders immediately — no blank gap, no broken-icon state ever.
 *  2. <img> loads silently in the background (display:none).
 *  3. On successful load  → image fades in, placeholder unmounts.
 *  4. On any failure      → placeholder stays, img removed from DOM.
 *
 * crossOrigin="anonymous" puts the request in CORS mode so Wikimedia's
 * Access-Control-Allow-Origin:* header is honoured and Chrome ORB does not
 * apply. referrerPolicy="no-referrer" avoids CDN hotlink blocks.
 */
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

  // No URL or already confirmed failed → placeholder only
  const hasUrl = Boolean(src && src.trim())
  const showPlaceholder = !hasUrl || failed || !loaded
  const showImg = hasUrl && !failed

  return (
    <>
      {showPlaceholder && <WatchPlaceholder watch={watch} size={size} />}

      {showImg && (
        <img
          src={src}
          alt={`${brand} ${model}`}
          className={className}
          style={loaded ? undefined : { display: 'none' }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </>
  )
}
