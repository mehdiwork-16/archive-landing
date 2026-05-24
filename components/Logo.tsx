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
      {/*
        Brand mark — swap "M" for your SVG logo if needed.
        Positioned top-right by the parent header.
      */}
      <span
        className="font-display font-light italic text-white tracking-[0.15em]"
        style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
      >
        M
      </span>
    </motion.div>
  )
}
