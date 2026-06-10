'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { motion } from 'framer-motion'
import { generateRecommendations } from '@/lib/recommendationEngine'
import { buildSwipePreferences } from '@/lib/preferenceEngine'
import { QuizAnswers, ScoredWatch, SwipeResult } from '@/types'
import { ArchetypeCard } from './ArchetypeCard'
import { WatchCard } from './WatchCard'
import { CompareDrawer } from './CompareDrawer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart2, Zap } from 'lucide-react'
import Link from 'next/link'

export function ResultsView() {
  const searchParams = useSearchParams()
  const [compareList, setCompareList] = useState<ScoredWatch[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const result = useMemo(() => {
    try {
      const data = searchParams.get('data')
      if (!data) return null
      const answers: QuizAnswers = JSON.parse(atob(data))

      // V2: decode swipe data if present
      const swipeRaw = searchParams.get('swipe')
      let swipePrefs = undefined
      if (swipeRaw) {
        const swipeResults: SwipeResult[] = JSON.parse(atob(swipeRaw))
        swipePrefs = buildSwipePreferences(swipeResults)
      }

      return generateRecommendations(answers, swipePrefs)
    } catch {
      return null
    }
  }, [searchParams])

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="text-2xl">Something went wrong</p>
        <p className="text-muted-foreground">We couldn&apos;t load your results. Please try the quiz again.</p>
        <Button asChild>
          <Link href="/quiz">Retake Quiz</Link>
        </Button>
      </div>
    )
  }

  function toggleCompare(watch: ScoredWatch) {
    setCompareList((prev) => {
      if (prev.find((w) => w.id === watch.id)) {
        return prev.filter((w) => w.id !== watch.id)
      }
      if (prev.length >= 2) {
        return [prev[1], watch]
      }
      return [...prev, watch]
    })
  }

  const canCompare = compareList.length === 2

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold hover:opacity-80 transition-opacity">
            WatchMatch
          </Link>
          <div className="flex items-center gap-3">
            {canCompare && (
              <Button
                size="sm"
                onClick={() => setShowCompare(true)}
                className="gap-2"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Compare 2
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/quiz" className="gap-2 flex items-center">
                <ArrowLeft className="w-3.5 h-3.5" />
                Retake
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-6 py-10">
        {/* Archetype */}
        <ArchetypeCard archetype={result.archetype} />

        {/* V2: Swipe data indicator */}
        {result.hasSwipeData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 mb-6 text-sm"
          >
            <Zap className="w-4 h-4 text-primary shrink-0" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Enhanced by your swipe data</span>
              {' '}— rankings combine your questionnaire answers (60%) and watch reactions (40%)
            </span>
          </motion.div>
        )}

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="font-serif text-2xl font-bold mb-1">Your Top Recommendations</h2>
            <p className="text-muted-foreground text-sm">
              {result.recommendations.length} watches matched to your profile
            </p>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Select any 2 watches to compare them side by side
          </p>
        </motion.div>

        {/* Watch grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {result.recommendations.map((watch, i) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              rank={i + 1}
              onCompare={toggleCompare}
              isSelectedForCompare={compareList.some((w) => w.id === watch.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Not quite right?</p>
          <Button variant="outline" asChild>
            <Link href="/quiz">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Refine Your Answers
            </Link>
          </Button>
        </motion.div>
      </main>

      {/* Compare modal */}
      {showCompare && canCompare && (
        <CompareDrawer
          watches={[compareList[0], compareList[1]]}
          onClose={() => setShowCompare(false)}
        />
      )}
    </>
  )
}
