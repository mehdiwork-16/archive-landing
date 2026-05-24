'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from '@/lib/useCountdown'
import { FlipDigit } from './FlipDigit'

// ─────────────────────────────────────────────
//  ↓ CHANGE THIS to your actual collection drop date
// ─────────────────────────────────────────────
const RELEASE_DATE = new Date('2026-07-30T00:00:00')

const UNITS = [
  { key: 'days'    as const, label: 'Days'  },
  { key: 'hours'   as const, label: 'Hrs'   },
  { key: 'minutes' as const, label: 'Min'   },
  { key: 'seconds' as const, label: 'Sec'   },
]

/* Single digit box */
function DigitBox({ digit, delay }: { digit: string; delay: number }) {
  return (
    <motion.div
      className="flex items-center justify-center
                 border border-white/25 bg-white/[0.06] backdrop-blur-sm"
      style={{
        width:  'clamp(2.1rem, 5.5vw, 5.5rem)',
        height: 'clamp(2.8rem, 7.5vw, 7rem)',
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className="font-digits font-[800] text-white tabular leading-none"
        style={{ fontSize: 'clamp(1.3rem, 3.8vw, 4rem)' }}
      >
        <FlipDigit digit={digit} />
      </span>
    </motion.div>
  )
}

/* One unit: two boxes + label */
function TimerUnit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const digits = String(value).padStart(2, '0').split('')
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3">
      <div className="flex gap-[3px] sm:gap-1 md:gap-1.5">
        {digits.map((d, i) => (
          <DigitBox key={i} digit={d} delay={delay + i * 0.05} />
        ))}
      </div>
      <motion.span
        className="font-body text-white/40 uppercase tracking-[0.25em]"
        style={{ fontSize: 'clamp(0.45rem, 0.9vw, 0.62rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {label}
      </motion.span>
    </div>
  )
}

/* Separator */
function Sep() {
  return (
    <motion.span
      className="text-white/20 font-digits self-center select-none"
      style={{
        fontSize: 'clamp(1rem, 2.5vw, 2.8rem)',
        paddingBottom: 'clamp(0.8rem, 2vw, 1.6rem)',
      }}
      animate={{ opacity: [0.1, 0.35, 0.1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      |
    </motion.span>
  )
}

export function CountdownTimer() {
  const timeLeft = useCountdown(RELEASE_DATE)

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2.5 md:gap-4 lg:gap-5"
      role="timer"
      aria-label="Countdown to collection release"
    >
      {UNITS.map((unit, i) => (
        <Fragment key={unit.key}>
          <TimerUnit value={timeLeft[unit.key]} label={unit.label} delay={0.4 + i * 0.1} />
          {i < UNITS.length - 1 && <Sep />}
        </Fragment>
      ))}
    </div>
  )
}
