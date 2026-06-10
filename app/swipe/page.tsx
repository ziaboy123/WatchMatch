import { Suspense } from 'react'
import { SwipeMode } from '@/components/swipe/SwipeMode'

export const metadata = {
  title: 'Rate Watches — WatchMatch',
  description: 'Swipe through watches to train your personal recommendation engine.',
}

export default function SwipePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading watches…</p>
          </div>
        </div>
      }
    >
      <SwipeMode />
    </Suspense>
  )
}
