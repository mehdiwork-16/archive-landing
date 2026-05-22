'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from '@/lib/useCountdown'
import { FlipDigit } from './FlipDigit'

// ─────────────────────────────────────────────
//  ↓ CHANGE THIS to your actual collection drop date
// ─────────────────────────────────────────────
const RELEASE_DATE = new Date('2026-10-10T00:00:00')

const UNITS = [
  { key: 'days' as const,    label: 'Days'  },
  { key: 'hours' as const,   label: 'Hours' },
  { key: 'minutes' as const, label: 'Min'   },
  { key: 'seconds' as const, label: 'Sec'   },
]

// Slow opacity pulse on the separator dots
function Colon() {
  return (
    <motion.span
      className="font-digits text-black/[0.08] select-none self-center"
      style={{
        fontSize: 'clamp(2rem, 5vw, 6.5rem)',
        // Push the colon up slightly so it optically aligns with the digits
        // rather than the center of the full unit (digits + label)
        marginBottom: 'clamp(0.9rem, 2.5vw, 2rem)',
      }}
      animate={{ opacity: [0.06, 0.18, 0.06] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      :
    </motion.span>
  )
}

function TimerUnit({
  value,
  label,
  delay,
}: {
  value: number
  label: string
  delay: number
}) {
  const digits = String(value).padStart(2, '0').split('')

  return (
    <motion.div
      className="flex flex-col items-center gap-3 md:gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Digits row */}
      <div
        className="font-digits font-[800] text-black tabular flex leading-none tracking-[-0.03em]"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 11rem)' }}
        aria-label={`${value} ${label}`}
      >
        {digits.map((d, i) => (
          <FlipDigit key={i} digit={d} />
        ))}
      </div>

      {/* Label */}
      <span
        className="font-body text-black/30 uppercase tracking-[0.3em]"
        style={{ fontSize: 'clamp(0.55rem, 1.1vw, 0.68rem)' }}
      >
        {label}
      </span>
    </motion.div>
  )
}

export function CountdownTimer() {
  const timeLeft = useCountdown(RELEASE_DATE)

  return (
    <div
      className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6"
      role="timer"
      aria-label="Countdown to collection release"
    >
      {UNITS.map((unit, i) => (
        <Fragment key={unit.key}>
          <TimerUnit value={timeLeft[unit.key]} label={unit.label} delay={0.3 + i * 0.08} />
          {i < UNITS.length - 1 && <Colon />}
        </Fragment>
      ))}
    </div>
  )
}
