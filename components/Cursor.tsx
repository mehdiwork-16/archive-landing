'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)
  const x = useSpring(rawX, { stiffness: 600, damping: 40, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 600, damping: 40, mass: 0.4 })

  useEffect(() => {
    // Only activate on fine-pointer (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    setMounted(true)

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    function onOver(e: MouseEvent) {
      const el = e.target as Element
      setHovered(!!el.closest('button, a, input, [role="button"], label'))
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [rawX, rawY])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x, y }}
    >
      {/* Outer ring — appears on hover over interactive elements */}
      <motion.div
        className="absolute rounded-full border border-black/60"
        animate={{
          width: hovered ? 36 : 0,
          height: hovered ? 36 : 0,
          x: hovered ? -18 : 0,
          y: hovered ? -18 : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
      {/* Inner dot — always visible */}
      <div
        className="w-[7px] h-[7px] rounded-full bg-black"
        style={{ transform: 'translate(-3.5px, -3.5px)' }}
      />
    </motion.div>
  )
}
