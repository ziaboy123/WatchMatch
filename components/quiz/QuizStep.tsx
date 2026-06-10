'use client'

import { QuizQuestion } from '@/data/questions'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface QuizStepProps {
  question: QuizQuestion
  value: unknown
  onChange: (val: unknown) => void
}

export function QuizStep({ question, value, onChange }: QuizStepProps) {
  function toggleMulti(opt: string) {
    const current = (value as string[]) || []
    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt]
    onChange(next)
  }

  return (
    <div>
      {/* Question header */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-snug">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-muted-foreground leading-relaxed">{question.subtitle}</p>
        )}
      </div>

      {/* Number input */}
      {question.type === 'number' && (
        <div>
          <input
            type="number"
            min={question.min}
            max={question.max}
            placeholder={question.placeholder}
            value={(value as number) ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full h-14 px-5 rounded-xl border bg-card text-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {question.min && question.max && (
            <p className="mt-2 text-xs text-muted-foreground">
              Please enter a value between {question.min} and {question.max}
            </p>
          )}
        </div>
      )}

      {/* Single select */}
      {question.type === 'single' && question.options && (
        <div className="grid grid-cols-1 gap-2.5">
          {question.options.map((opt) => {
            const selected = value === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={cn(
                  'w-full text-left px-5 py-4 rounded-xl border transition-all duration-200',
                  'hover:border-primary/50 hover:bg-secondary/60',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    {opt.description && (
                      <p
                        className={cn(
                          'text-sm mt-0.5',
                          selected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}
                      >
                        {opt.description}
                      </p>
                    )}
                  </div>
                  {selected && (
                    <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Multi select */}
      {question.type === 'multi' && question.options && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2.5">
            {question.options.map((opt) => {
              const selected = ((value as string[]) || []).includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/60'
                  )}
                >
                  {selected && <Check className="inline w-3 h-3 mr-1.5 -mt-0.5" />}
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
