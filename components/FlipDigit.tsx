'use client'

import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

interface FlipDigitProps {
  digit: string
}

export function FlipDigit({ digit }: FlipDigitProps) {
  return (
    /*
     * The outer span is `inline-block` with `overflow-hidden` and an explicit height.
     * The invisible spacer (always "0") determines the container width so all digits
     * have identical, consistent width regardless of which numeral is showing.
     * The animated span is absolute, slides in from top and exits to bottom.
     */
    <span
      className="relative inline-block overflow-hidden tabular"
      style={{ height: '1.05em' }}
    >
      {/* Width anchor — invisible, always takes up one character's space */}
      <span className="invisible select-none leading-none" aria-hidden>
        0
      </span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          className="absolute inset-x-0 top-0 flex items-center justify-center"
          style={{ height: '1.05em' }}
          initial={{ y: '-115%' }}
          animate={{ y: '0%' }}
          exit={{ y: '115%' }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
