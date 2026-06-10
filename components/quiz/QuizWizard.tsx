'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '@/data/questions'
import { QuizAnswers } from '@/types'
import { QuizStep } from './QuizStep'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

const TOTAL_STEPS = questions.length

export function QuizWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const currentQuestion = questions[step]
  const progress = ((step + 1) / TOTAL_STEPS) * 100
  const isLastStep = step === TOTAL_STEPS - 1

  function handleAnswer(field: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }

  function canProceed(): boolean {
    const q = currentQuestion
    const val = answers[q.field as keyof QuizAnswers]
    if (q.type === 'number') return val !== undefined && val !== null && String(val).length > 0
    if (q.type === 'multi') return Array.isArray(val) && val.length > 0
    return val !== undefined && val !== null
  }

  function goNext() {
    if (!canProceed()) return
    if (isLastStep) {
      submitAnswers()
      return
    }
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step === 0) return
    setDirection(-1)
    setStep((s) => s - 1)
  }

  function submitAnswers() {
    const encoded = btoa(JSON.stringify(answers))
    // V2: go to swipe mode before results
    router.push(`/swipe?data=${encoded}`)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b">
        <Link href="/" className="font-serif text-xl font-bold hover:opacity-80 transition-opacity">
          WatchMatch
        </Link>
        <span className="text-sm text-muted-foreground">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </header>

      {/* Progress */}
      <div className="px-6">
        <Progress value={progress} className="rounded-none h-0.5" />
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <QuizStep
                question={currentQuestion}
                value={answers[currentQuestion.field as keyof QuizAnswers]}
                onChange={(val) => handleAnswer(currentQuestion.field, val)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <footer className="px-6 py-6 border-t">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={goNext}
            disabled={!canProceed()}
            size="default"
            className="gap-2 min-w-[120px]"
          >
            {isLastStep ? (
              <>
                Next: Rate Watches <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  )
}
