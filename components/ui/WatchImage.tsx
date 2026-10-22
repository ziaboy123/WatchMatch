'use client'

import { useState, useEffect, useRef } from 'react'
import type { WatchCategory } from '@/types'
import { imageCredits } from '@/data/imageCredits'
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
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/img?url=${encodeURIComponent(src)}`
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
  const imgRef = useRef<HTMLImageElement>(null)

  // If the browser served the image from cache before onLoad was registered
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const watch = { brand, model, category: category as WatchCategory }
  const hasUrl = Boolean(src && src.trim())
  const showPlaceholder = !hasUrl || failed || !loaded
  const showImg = hasUrl && !failed
  const credit = src ? imageCredits[src] : undefined

  return (
    <>
      {showPlaceholder && <WatchPlaceholder watch={watch} size={size} />}

      {showImg && (
        <img
          ref={imgRef}
          src={proxyUrl(src)}
          alt={`${brand} ${model}`}
          className={className}
          style={loaded ? undefined : { display: 'none' }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {loaded && credit && (
        <a
          href={credit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1 right-1 z-10 text-[10px] leading-tight text-foreground/40 hover:text-foreground/70 transition-colors bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded"
          onClick={e => e.stopPropagation()}
        >
          © {credit.author.split(' ').slice(0, 2).join(' ')}
        </a>
      )}
    </>
  )
}
