'use client'

import { motion } from 'framer-motion'

export function Logo() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 select-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/*
        ↓ Replace "ARCHIVE" with your brand name.
          For an SVG logo, swap the <h1> with your <svg> element.
      */}
      <h1
        className="font-display font-light italic text-black tracking-[0.45em] uppercase"
        style={{ fontSize: 'clamp(1rem, 2.2vw, 1.6rem)', letterSpacing: '0.45em' }}
      >
        Archive
      </h1>
      <div className="bg-black/20" style={{ width: '2rem', height: '0.5px' }} />
    </motion.div>
  )
}
