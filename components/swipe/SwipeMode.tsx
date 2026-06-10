'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { watches as allWatches } from '@/data/watches'
import { SwipeResult, SwipeDecision, QuizAnswers } from '@/types'
import { SwipeCard, SwipeActionButtons } from './SwipeCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, SkipForward, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import Link from 'next/link'

const SWIPE_COUNT = 24

/** Pick a representative sample of watches spanning all categories and budgets */
function selectSwipePool(quizData?: QuizAnswers): typeof allWatches {
  // If we have a budget, bias toward that tier but include variety
  const pool = [...allWatches]

  // Shuffle deterministically-ish but with variety
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  // Ensure we have representation across categories
  const categories = ['Dive', 'Dress', 'Field', 'Chronograph', 'GMT', 'Everyday Sports', 'Integrated Sports', 'Pilot', 'Casual']
  const selected: typeof allWatches = []
  const used = new Set<string>()

  // Take 2-3 from each category first
  for (const cat of categories) {
    const catWatches = pool.filter((w) => w.category === cat && !used.has(w.id)).slice(0, 3)
    for (const w of catWatches) {
      if (selected.length >= SWIPE_COUNT) break
      selected.push(w)
      used.add(w.id)
    }
    if (selected.length >= SWIPE_COUNT) break
  }

  // Fill remainder from the shuffled pool
  for (const w of pool) {
    if (selected.length >= SWIPE_COUNT) break
    if (!used.has(w.id)) {
      selected.push(w)
      used.add(w.id)
    }
  }

  return selected.slice(0, SWIPE_COUNT)
}

export function SwipeMode() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const quizData = useMemo((): QuizAnswers | undefined => {
    try {
      const d = searchParams.get('data')
      return d ? JSON.parse(atob(d)) : undefined
    } catch { return undefined }
  }, [searchParams])

  const swipePool = useMemo(() => selectSwipePool(quizData), [quizData])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipes, setSwipes] = useState<SwipeResult[]>([])
  const [lastDecision, setLastDecision] = useState<SwipeDecision | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const isDone = currentIndex >= swipePool.length

  const handleSwipe = useCallback((decision: SwipeDecision) => {
    if (isAnimating || currentIndex >= swipePool.length) return
    const watch = swipePool[currentIndex]
    setLastDecision(decision)
    setIsAnimating(true)
    setSwipes((prev) => [...prev, { watchId: watch.id, decision }])
    setTimeout(() => {
      setCurrentIndex((i) => i + 1)
      setLastDecision(null)
      setIsAnimating(false)
    }, 350)
  }, [isAnimating, currentIndex, swipePool])

  function goToResults() {
    const quizEncoded = searchParams.get('data') || ''
    const swipeEncoded = btoa(JSON.stringify(swipes))
    router.push(`/results?data=${quizEncoded}&swipe=${swipeEncoded}`)
  }

  function skipToResults() {
    const quizEncoded = searchParams.get('data') || ''
    router.push(`/results?data=${quizEncoded}`)
  }

  const likedCount = swipes.filter((s) => s.decision === 'like').length
  const maybeCount = swipes.filter((s) => s.decision === 'maybe').length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b shrink-0">
        <Link href="/" className="font-serif text-xl font-bold hover:opacity-80 transition-opacity">
          WatchMatch
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {Math.min(currentIndex + 1, swipePool.length)} / {swipePool.length}
          </span>
          <Button variant="ghost" size="sm" onClick={skipToResults} className="gap-1.5 text-muted-foreground">
            <SkipForward className="w-3.5 h-3.5" />
            Skip
          </Button>
        </div>
      </header>

      {/* Intro / instruction bar */}
      <div className="px-6 py-3 bg-secondary/40 border-b shrink-0">
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Rate the watches</span> — your reactions train your personal recommendation engine
        </p>
      </div>

      {/* Main swipe area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 min-h-0">

        {!isDone ? (
          <>
            {/* Card stack */}
            <div className="relative w-full max-w-sm" style={{ height: '480px' }}>
              {/* Background cards for stack depth effect */}
              {[2, 1].map((offset) => {
                const idx = currentIndex + offset
                if (idx >= swipePool.length) return null
                return (
                  <div
                    key={swipePool[idx].id}
                    className="absolute inset-0 rounded-3xl border bg-card"
                    style={{
                      transform: `scale(${1 - offset * 0.04}) translateY(${offset * 10}px)`,
                      zIndex: 10 - offset,
                      opacity: 1 - offset * 0.15,
                    }}
                  />
                )
              })}

              {/* Active card */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={swipePool[currentIndex]?.id}
                  className="absolute inset-0 z-20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    x: lastDecision === 'like' ? 400 : lastDecision === 'dislike' ? -400 : 0,
                    y: lastDecision === 'maybe' ? -200 : 0,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.3 },
                  }}
                >
                  <SwipeCard
                    watch={swipePool[currentIndex]}
                    onSwipe={handleSwipe}
                    isTop
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <SwipeActionButtons
              onDislike={() => handleSwipe('dislike')}
              onMaybe={() => handleSwipe('maybe')}
              onLike={() => handleSwipe('like')}
              disabled={isAnimating}
            />

            {/* Hint text */}
            <p className="text-xs text-muted-foreground text-center">
              Swipe right to like · left to dislike · tap{' '}
              <Minus className="inline w-3 h-3" /> for maybe
            </p>
          </>
        ) : (
          // Done screen
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
          >
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="font-serif text-3xl font-bold mb-3">Preferences captured</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              You liked <strong>{likedCount}</strong> watch{likedCount !== 1 ? 'es' : ''} and
              saved <strong>{maybeCount}</strong> for maybe. Your recommendation engine is now
              personalised.
            </p>

            {/* Swipe summary chips */}
            <div className="flex justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />
                {likedCount} liked
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
                <Minus className="w-3.5 h-3.5" />
                {maybeCount} maybe
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-medium">
                <ThumbsDown className="w-3.5 h-3.5" />
                {swipes.length - likedCount - maybeCount} passed
              </div>
            </div>

            <Button size="lg" onClick={goToResults} className="group gap-2 w-full sm:w-auto">
              See Your Recommendations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Progress dots */}
      {!isDone && (
        <div className="px-6 pb-4 flex justify-center gap-1 shrink-0">
          {swipePool.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'bg-primary w-3'
                  : i === currentIndex
                  ? 'bg-primary/60 w-4'
                  : 'bg-border w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
