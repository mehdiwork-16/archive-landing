'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { CountdownTimer } from '@/components/CountdownTimer'
import { WaitlistModal } from '@/components/WaitlistModal'
import { BackgroundSlideshow } from '@/components/BackgroundSlideshow'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <main
        className="relative w-full flex flex-col bg-[#0a0a0a]"
        style={{ minHeight: '100dvh' }}
      >
        {/* ── Animated photo background ─────────────────────── */}
        <BackgroundSlideshow />

        {/* ── Content ───────────────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col"
          style={{ minHeight: '100dvh' }}
        >
          {/* Logo — top right */}
          <header className="flex justify-end px-5 sm:px-8 md:px-10 pt-5 sm:pt-7 md:pt-8">
            <Logo />
          </header>

          {/* Hero — vertically centered */}
          <section className="flex-1 flex flex-col items-center justify-center
                              gap-5 sm:gap-7 md:gap-10
                              px-4 pb-8 sm:pb-10">

            {/* COMING SOON — scales from phone to desktop */}
            <motion.h1
              className="font-poster text-white text-center leading-[0.88]
                         tracking-tight select-none"
              style={{ fontSize: 'clamp(2.8rem, 13vw, 15rem)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              COMING
              <br />
              SOON
            </motion.h1>

            {/* Countdown */}
            <CountdownTimer />

            {/* STAY TUNED button */}
            <motion.button
              onClick={() => setModalOpen(true)}
              className="font-body text-[#0a0a0a] bg-white
                         text-[10px] sm:text-[11px] tracking-[0.28em] uppercase
                         px-10 sm:px-14 py-3.5 sm:py-4
                         hover:bg-white/85 active:scale-[0.97]
                         transition-all duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Open waitlist form"
            >
              Stay Tuned
            </motion.button>

          </section>
        </div>
      </main>

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
