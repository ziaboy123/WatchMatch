'use client'

/**
 * Premium brand-aware placeholder for watches without a verified image.
 * Each brand gets its own colour palette, accent geometry, and layout.
 * Displayed whenever watch.image === ''.
 */

import { Watch } from '@/types'

interface WatchPlaceholderProps {
  watch: Pick<Watch, 'brand' | 'model' | 'category'>
  size?: 'card' | 'swipe'
}

/* ─── Brand themes ─────────────────────────────────────────────────────────── */

type BrandTheme = {
  bg: string          // outer background
  accent: string      // primary accent colour (tailwind arbitrary or inline)
  accentBg: string    // accent tint for inner ring / panel
  textPrimary: string
  textSecondary: string
  motif: 'crown' | 'omega' | 'crown-shield' | 'snowflake' | 'cartier-c' | 'wing' | 'porthole' | 'compass' | 'dial' | 'anchor'
}

const BRAND_THEMES: Record<string, BrandTheme> = {
  'Rolex': {
    bg: 'bg-[#0a1a0f]',
    accent: '#00a550',
    accentBg: 'bg-[#00a550]/10',
    textPrimary: 'text-[#00a550]',
    textSecondary: 'text-[#a0c8b0]',
    motif: 'crown',
  },
  'Omega': {
    bg: 'bg-[#1a0a0a]',
    accent: '#c8102e',
    accentBg: 'bg-[#c8102e]/10',
    textPrimary: 'text-[#c8102e]',
    textSecondary: 'text-[#c8a0a0]',
    motif: 'omega',
  },
  'Tudor': {
    bg: 'bg-[#140a0a]',
    accent: '#9b2335',
    accentBg: 'bg-[#9b2335]/10',
    textPrimary: 'text-[#c8394a]',
    textSecondary: 'text-[#b09090]',
    motif: 'crown-shield',
  },
  'Grand Seiko': {
    bg: 'bg-[#0e0e12]',
    accent: '#c0c8d8',
    accentBg: 'bg-[#c0c8d8]/8',
    textPrimary: 'text-[#d0d8e8]',
    textSecondary: 'text-[#8090a8]',
    motif: 'snowflake',
  },
  'Cartier': {
    bg: 'bg-[#130c08]',
    accent: '#b5985a',
    accentBg: 'bg-[#b5985a]/10',
    textPrimary: 'text-[#c8aa66]',
    textSecondary: 'text-[#a08870]',
    motif: 'cartier-c',
  },
  'IWC': {
    bg: 'bg-[#080c14]',
    accent: '#4a6fa5',
    accentBg: 'bg-[#4a6fa5]/10',
    textPrimary: 'text-[#6090c8]',
    textSecondary: 'text-[#7090b0]',
    motif: 'wing',
  },
  'Panerai': {
    bg: 'bg-[#0a0e08]',
    accent: '#c86820',
    accentBg: 'bg-[#c86820]/10',
    textPrimary: 'text-[#d88030]',
    textSecondary: 'text-[#a08060]',
    motif: 'porthole',
  },
  'Longines': {
    bg: 'bg-[#0a0c10]',
    accent: '#8090a8',
    accentBg: 'bg-[#8090a8]/10',
    textPrimary: 'text-[#a0b0c0]',
    textSecondary: 'text-[#708090]',
    motif: 'wing',
  },
  'Hamilton': {
    bg: 'bg-[#0c0c0a]',
    accent: '#c8a020',
    accentBg: 'bg-[#c8a020]/10',
    textPrimary: 'text-[#d8b030]',
    textSecondary: 'text-[#a09060]',
    motif: 'compass',
  },
  'Citizen': {
    bg: 'bg-[#080c10]',
    accent: '#3a78b4',
    accentBg: 'bg-[#3a78b4]/10',
    textPrimary: 'text-[#5090c8]',
    textSecondary: 'text-[#6080a0]',
    motif: 'dial',
  },
  'Casio': {
    bg: 'bg-[#080808]',
    accent: '#505050',
    accentBg: 'bg-[#505050]/10',
    textPrimary: 'text-[#a0a0a0]',
    textSecondary: 'text-[#606060]',
    motif: 'dial',
  },
  'Orient': {
    bg: 'bg-[#080c0a]',
    accent: '#4a8850',
    accentBg: 'bg-[#4a8850]/10',
    textPrimary: 'text-[#60a870]',
    textSecondary: 'text-[#608068]',
    motif: 'anchor',
  },
  'Tissot': {
    bg: 'bg-[#0c0c08]',
    accent: '#9a8040',
    accentBg: 'bg-[#9a8040]/10',
    textPrimary: 'text-[#b89850]',
    textSecondary: 'text-[#887060]',
    motif: 'dial',
  },
}

const DEFAULT_THEME: BrandTheme = {
  bg: 'bg-[#0a0a0e]',
  accent: '#6070a0',
  accentBg: 'bg-[#6070a0]/10',
  textPrimary: 'text-[#8090c0]',
  textSecondary: 'text-[#505870]',
  motif: 'dial',
}

/* ─── SVG motifs ────────────────────────────────────────────────────────────── */

function CrownMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Crown silhouette — abstract geometry only */}
      <path
        d="M12 46 L12 30 L20 38 L32 18 L44 38 L52 30 L52 46 Z"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
      <line x1="10" y1="50" x2="54" y2="50" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="18" r="2.5" fill={color} />
      <circle cx="12" cy="30" r="2" fill={color} />
      <circle cx="52" cy="30" r="2" fill={color} />
    </svg>
  )
}

function OmegaMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Stylised Ω geometry */}
      <path
        d="M32 14 C20 14 12 22 12 31 C12 40 18 47 26 48 L22 52 L42 52 L38 48 C46 47 52 40 52 31 C52 22 44 14 32 14 Z"
        stroke={color} strokeWidth="1.5" fill="none"
      />
      <line x1="10" y1="56" x2="26" y2="56" stroke={color} strokeWidth="1.5" />
      <line x1="38" y1="56" x2="54" y2="56" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function CrownShieldMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Shield with crown points */}
      <path
        d="M32 10 L14 18 L14 36 C14 46 22 53 32 56 C42 53 50 46 50 36 L50 18 Z"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
      <path
        d="M22 24 L22 18 L27 22 L32 14 L37 22 L42 18 L42 24"
        stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"
      />
    </svg>
  )
}

function SnowflakeMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* 6-arm snowflake */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 32 32)`}>
          <line x1="32" y1="10" x2="32" y2="54" stroke={color} strokeWidth="1.2" />
          <line x1="24" y1="20" x2="32" y2="28" stroke={color} strokeWidth="1" />
          <line x1="40" y1="20" x2="32" y2="28" stroke={color} strokeWidth="1" />
        </g>
      ))}
      <circle cx="32" cy="32" r="3" fill={color} />
    </svg>
  )
}

function CartierCMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Double-C cartouche — pure geometry */}
      <path d="M40 16 C28 16 20 23 20 32 C20 41 28 48 40 48" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 22 C36 22 30 26 30 32 C30 38 36 42 44 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="56" x2="48" y2="56" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function WingMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Stylised wing — aviation / Longines heritage */}
      <path
        d="M8 36 C14 30 22 28 32 32 C42 28 50 30 56 36"
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d="M8 36 C12 24 20 18 32 20 C44 18 52 24 56 36"
        stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"
      />
      <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="2" fill={color} />
    </svg>
  )
}

function PortholeMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      {/* Panerai cushion case / porthole */}
      <rect x="14" y="14" width="36" height="36" rx="10" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="20" width="24" height="24" rx="6" stroke={color} strokeWidth="1" />
      <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1.5" />
      {/* Lugs */}
      <rect x="10" y="20" width="4" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="50" y="20" width="4" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="10" y="36" width="4" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="50" y="36" width="4" height="8" rx="2" fill={color} opacity="0.5" />
    </svg>
  )
}

function CompassMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="14" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* N/S/E/W ticks */}
      <line x1="32" y1="12" x2="32" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="47" x2="32" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="32" x2="17" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="47" y1="32" x2="52" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Compass needle */}
      <polygon points="32,20 34,32 32,35 30,32" fill={color} />
      <polygon points="32,44 34,32 32,35 30,32" fill={color} opacity="0.3" />
    </svg>
  )
}

function AnchorMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <circle cx="32" cy="18" r="5" stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="23" x2="32" y2="52" stroke={color} strokeWidth="1.5" />
      <line x1="18" y1="30" x2="46" y2="30" stroke={color} strokeWidth="1.5" />
      <path d="M22 52 C22 44 32 44 32 52 C32 44 42 44 42 52" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function DialMotif({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1.5" />
      {/* Hour markers */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg - 90) * Math.PI / 180
        const r1 = 17, r2 = deg % 90 === 0 ? 13 : 15
        return (
          <line
            key={deg}
            x1={32 + r1 * Math.cos(rad)} y1={32 + r1 * Math.sin(rad)}
            x2={32 + r2 * Math.cos(rad)} y2={32 + r2 * Math.sin(rad)}
            stroke={color} strokeWidth={deg % 90 === 0 ? 2 : 1} strokeLinecap="round"
          />
        )
      })}
      {/* Hands at 10:10 */}
      <line x1="32" y1="32" x2="24" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="32" x2="40" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="32" r="2.5" fill={color} />
    </svg>
  )
}

function Motif({ type, color }: { type: BrandTheme['motif']; color: string }) {
  switch (type) {
    case 'crown':        return <CrownMotif color={color} />
    case 'omega':        return <OmegaMotif color={color} />
    case 'crown-shield': return <CrownShieldMotif color={color} />
    case 'snowflake':    return <SnowflakeMotif color={color} />
    case 'cartier-c':   return <CartierCMotif color={color} />
    case 'wing':         return <WingMotif color={color} />
    case 'porthole':     return <PortholeMotif color={color} />
    case 'compass':      return <CompassMotif color={color} />
    case 'anchor':       return <AnchorMotif color={color} />
    case 'dial':
    default:             return <DialMotif color={color} />
  }
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export function WatchPlaceholder({ watch, size = 'card' }: WatchPlaceholderProps) {
  const theme = BRAND_THEMES[watch.brand] ?? DEFAULT_THEME

  const motifSize    = size === 'swipe' ? 'w-20 h-20' : 'w-16 h-16'
  const brandSize    = size === 'swipe' ? 'text-[10px]' : 'text-[9px]'
  const modelSize    = size === 'swipe' ? 'text-sm' : 'text-xs'
  const categorySize = size === 'swipe' ? 'text-[9px]' : 'text-[8px]'

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${theme.bg} select-none`}>
      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${theme.accent} 0px, transparent 1px, transparent 24px),
                            repeating-linear-gradient(90deg, ${theme.accent} 0px, transparent 1px, transparent 24px)`,
        }}
      />

      {/* Motif */}
      <div className={`${motifSize} relative z-10 opacity-70`}>
        <Motif type={theme.motif} color={theme.accent} />
      </div>

      {/* Text block */}
      <div className="relative z-10 flex flex-col items-center gap-1 px-4 text-center">
        <span className={`${brandSize} font-semibold uppercase tracking-[0.2em] ${theme.textPrimary}`}>
          {watch.brand}
        </span>
        <span className={`${modelSize} font-medium leading-tight ${theme.textSecondary} max-w-[160px]`}>
          {watch.model}
        </span>
        <div
          className="mt-1 h-px w-10 opacity-30"
          style={{ background: theme.accent }}
        />
        <span className={`${categorySize} uppercase tracking-[0.15em] ${theme.textSecondary} opacity-60 mt-0.5`}>
          {watch.category}
        </span>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
        <span
          className="text-[8px] uppercase tracking-[0.2em] opacity-30 font-medium"
          style={{ color: theme.accent }}
        >
          Image unavailable
        </span>
      </div>
    </div>
  )
}
