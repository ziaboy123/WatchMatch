import { Suspense } from 'react'
import { ResultsView } from '@/components/results/ResultsView'

export const metadata = {
  title: 'Your Watch Recommendations — WatchMatch',
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Curating your recommendations…</p>
            </div>
          </div>
        }
      >
        <ResultsView />
      </Suspense>
    </div>
  )
}
