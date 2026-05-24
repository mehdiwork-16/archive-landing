'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Slides are passed in from the server — any image in /public is included automatically
const DISPLAY_MS = 5500   // how long each photo stays
const FADE_S    = 1.8     // crossfade duration in seconds

interface Props {
  slides: string[]
}

export function BackgroundSlideshow({ slides }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), DISPLAY_MS)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: 'easeInOut' }}
        >
          {/* Subtle Ken Burns zoom on each slide */}
          <motion.img
            src={slides[index]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: DISPLAY_MS / 1000 + FADE_S, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay — darkens edges so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
      {/* Extra vignette for depth */}
      <div className="absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  )
}
