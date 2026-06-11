'use client'

import { motion } from 'framer-motion'
import { ScoredWatch } from '@/types'
import { formatEstimatedPrice } from '@/lib/utils'
import { Droplets, Zap, Maximize2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WatchImage } from '@/components/ui/WatchImage'

interface WatchCardProps {
  watch: ScoredWatch
  rank: number
  onCompare?: (watch: ScoredWatch) => void
  isSelectedForCompare?: boolean
}

export function WatchCard({ watch, rank, onCompare, isSelectedForCompare }: WatchCardProps) {
  const scorePercent = Math.min(100, Math.round((watch.score / 80) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.06 }}
      className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Watch image area */}
      <div className="relative h-52 bg-secondary/40 overflow-hidden">
        <WatchImage
          src={watch.image}
          brand={watch.brand}
          model={watch.model}
          category={watch.category}
          size="card"
        />

        {/* Rank badge */}
        <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {rank}
        </div>

        {/* Category tag */}
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
            {watch.category}
          </span>
        </div>

        {/* Match score bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
              {watch.brand}
            </p>
            <h3 className="font-semibold text-base leading-snug">{watch.model}</h3>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="font-bold text-lg">{formatEstimatedPrice(watch.priceRange)}</p>
            <p className="text-xs text-muted-foreground">{scorePercent}% match</p>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            {watch.caseSizeMm}mm
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {watch.movement}
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {watch.waterResistanceM}m
          </span>
        </div>

        {/* Why it fits */}
        {watch.matchReasons.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {watch.matchReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {watch.description}
        </p>

        {/* Compare button */}
        {onCompare && (
          <Button
            variant={isSelectedForCompare ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => onCompare(watch)}
          >
            {isSelectedForCompare ? '✓ Selected for Compare' : 'Add to Compare'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
