'use client'

import { motion } from 'framer-motion'

export function Logo() {
  return (
    <motion.div
      className="select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Icosium brand mark (white logo for the dark background) */}
      <img
        src="/logo.png"
        alt="Icosium"
        className="w-auto select-none"
        style={{
          height: 'clamp(2rem, 4vw, 3rem)',
          filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4))',
        }}
        draggable={false}
      />
    </motion.div>
  )
}
