'use client'

import { motion } from 'framer-motion'
import { WatchArchetype } from '@/types'

interface ArchetypeCardProps {
  archetype: WatchArchetype
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border bg-card p-8 mb-10"
    >
      {/* Decorative ring */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-border/30 opacity-50" />
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-border/20 opacity-40" />

      <div className="relative">
        <div className="text-5xl mb-4">{archetype.icon}</div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Your Watch Archetype
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{archetype.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl">
          {archetype.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-secondary/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Case Size</p>
            <p className="font-semibold">{archetype.caseSizeRange}</p>
          </div>
          <div className="bg-secondary/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Movement</p>
            <p className="font-semibold">{archetype.recommendedMovement}</p>
          </div>
          <div className="bg-secondary/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
            <p className="font-semibold text-sm">{archetype.preferredCategories.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
