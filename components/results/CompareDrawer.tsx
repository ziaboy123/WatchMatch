'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ScoredWatch } from '@/types'
import { formatPrice } from '@/lib/utils'
import { X, Droplets, Zap, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompareDrawerProps {
  watches: [ScoredWatch, ScoredWatch]
  onClose: () => void
}

type SpecRow = {
  label: string
  a: string
  b: string
  icon?: React.ComponentType<{ className?: string }>
}

export function CompareDrawer({ watches, onClose }: CompareDrawerProps) {
  const [a, b] = watches

  const rows: SpecRow[] = [
    { label: 'Brand', a: a.brand, b: b.brand },
    { label: 'Price', a: formatPrice(a.price, a.currency), b: formatPrice(b.price, b.currency) },
    { label: 'Category', a: a.category, b: b.category },
    { label: 'Case Size', a: `${a.caseSizeMm}mm`, b: `${b.caseSizeMm}mm`, icon: Maximize2 },
    { label: 'Movement', a: a.movement, b: b.movement, icon: Zap },
    { label: 'Water Resistance', a: `${a.waterResistanceM}m`, b: `${b.waterResistanceM}m`, icon: Droplets },
    { label: 'Bracelet', a: a.bracelet, b: b.bracelet },
    { label: 'Best Use', a: a.bestUseCase, b: b.bestUseCase },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-card border rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-serif text-xl font-bold">Watch Comparison</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Watch names */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-4 text-sm text-muted-foreground" />
            <div className="p-4 border-l text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{a.brand}</p>
              <p className="font-semibold text-sm mt-0.5 leading-snug">{a.model}</p>
            </div>
            <div className="p-4 border-l text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{b.brand}</p>
              <p className="font-semibold text-sm mt-0.5 leading-snug">{b.model}</p>
            </div>
          </div>

          {/* Spec rows */}
          <div className="overflow-y-auto max-h-[50vh]">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-b last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <div className="p-4 text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  {row.icon && <row.icon className="w-3.5 h-3.5" />}
                  {row.label}
                </div>
                <div className="p-4 border-l text-sm text-center font-medium">{row.a}</div>
                <div className="p-4 border-l text-sm text-center font-medium">{row.b}</div>
              </div>
            ))}
          </div>

          {/* Pros */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-secondary/30 border-t">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {a.brand} {a.model} — Pros
              </p>
              <ul className="space-y-1">
                {a.pros.slice(0, 3).map((pro) => (
                  <li key={pro} className="text-sm flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {b.brand} {b.model} — Pros
              </p>
              <ul className="space-y-1">
                {b.pros.slice(0, 3).map((pro) => (
                  <li key={pro} className="text-sm flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
