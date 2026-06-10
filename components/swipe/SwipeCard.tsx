'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Watch, SwipeDecision } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Droplets, Zap, Maximize2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

interface SwipeCardProps {
  watch: Watch
  onSwipe: (decision: SwipeDecision) => void
  isTop: boolean
}

const SWIPE_THRESHOLD = 100

export function SwipeCard({ watch, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, -20], [1, 0])
  const cardOpacity = useTransform(x, [-250, 0, 250], [0.5, 1, 0.5])

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('like')
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('dislike')
    }
    // snap back if not enough velocity
  }

  return (
    <motion.div
      style={{ x, rotate, opacity: cardOpacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-none"
      whileTap={{ scale: 1.02 }}
    >
      <div className="relative h-full w-full rounded-3xl border bg-card shadow-xl overflow-hidden flex flex-col">

        {/* Like / Dislike overlays */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 z-10 rounded-3xl border-4 border-green-500 pointer-events-none flex items-center justify-center"
        >
          <div className="rotate-[-15deg] border-4 border-green-500 rounded-xl px-5 py-2 mt-8 ml-8">
            <span className="text-green-500 font-black text-3xl tracking-widest">LIKE</span>
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute inset-0 z-10 rounded-3xl border-4 border-red-500 pointer-events-none flex items-center justify-center"
        >
          <div className="rotate-[15deg] border-4 border-red-500 rounded-xl px-5 py-2 mt-8 mr-8 self-start ml-auto">
            <span className="text-red-500 font-black text-3xl tracking-widest">NOPE</span>
          </div>
        </motion.div>

        {/* Watch face visual */}
        <div className="flex-1 bg-gradient-to-br from-secondary/80 to-secondary flex items-center justify-center min-h-0 p-8">
          <div className="relative w-40 h-40 rounded-full border-4 border-foreground/10 shadow-2xl flex items-center justify-center bg-card">
            <div className="w-32 h-32 rounded-full border-2 border-foreground/15 flex flex-col items-center justify-center gap-1 text-center px-3">
              <p className="text-xs font-bold uppercase tracking-wider leading-none text-foreground/70">
                {watch.brand}
              </p>
              <div className="w-6 h-px bg-foreground/30" />
              <p className="text-[10px] text-foreground/50 leading-tight">{watch.model.split(' ').slice(0, 2).join(' ')}</p>
            </div>
            {/* Watch hands */}
            <div className="absolute w-0.5 h-10 bg-foreground/60 rounded-full origin-bottom" style={{ bottom: '50%', left: 'calc(50% - 1px)', transform: 'rotate(-30deg)' }} />
            <div className="absolute w-0.5 h-7 bg-foreground/80 rounded-full origin-bottom" style={{ bottom: '50%', left: 'calc(50% - 1px)', transform: 'rotate(90deg)' }} />
          </div>
        </div>

        {/* Info section */}
        <div className="p-5 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                {watch.brand}
              </p>
              <h3 className="font-serif text-xl font-bold leading-tight">{watch.model}</h3>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-xl">{formatPrice(watch.price, watch.currency)}</p>
              <p className="text-xs text-muted-foreground">{watch.category}</p>
            </div>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              {watch.caseSizeMm}mm
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {watch.movement}
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              {watch.waterResistanceM}m
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {watch.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Standalone action buttons below the card
interface ActionButtonsProps {
  onDislike: () => void
  onMaybe: () => void
  onLike: () => void
  disabled?: boolean
}

export function SwipeActionButtons({ onDislike, onMaybe, onLike, disabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDislike}
        disabled={disabled}
        className="w-14 h-14 rounded-full border-2 border-red-400/60 bg-card flex items-center justify-center text-red-400 shadow-md hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
        aria-label="Dislike"
      >
        <ThumbsDown className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMaybe}
        disabled={disabled}
        className="w-12 h-12 rounded-full border-2 border-amber-400/60 bg-card flex items-center justify-center text-amber-400 shadow-md hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors disabled:opacity-40"
        aria-label="Maybe"
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLike}
        disabled={disabled}
        className="w-14 h-14 rounded-full border-2 border-green-400/60 bg-card flex items-center justify-center text-green-400 shadow-md hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors disabled:opacity-40"
        aria-label="Like"
      >
        <ThumbsUp className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
