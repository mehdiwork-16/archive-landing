'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { CountdownTimer } from '@/components/CountdownTimer'
import { WaitlistModal } from '@/components/WaitlistModal'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <main className="min-h-screen w-full flex flex-col bg-white overflow-hidden">

        {/* Logo — positioned near the top */}
        <header className="flex justify-center pt-12 md:pt-16 lg:pt-20">
          <Logo />
        </header>

        {/* Centre stage — timer is the hero */}
        <section className="flex-1 flex flex-col items-center justify-center gap-10 md:gap-14 px-4 -mt-4 md:-mt-6">

          <CountdownTimer />

          {/* Waitlist CTA — understated, minimal */}
          <motion.button
            onClick={() => setModalOpen(true)}
            className="group relative font-body text-black/40 hover:text-black
                       text-[11px] tracking-[0.28em] uppercase transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Open waitlist form"
          >
            Join Waiting List
            {/* Underline slides in from left on hover */}
            <span
              className="absolute bottom-0 left-0 h-px bg-black w-0 group-hover:w-full
                         transition-all duration-300 ease-out"
            />
          </motion.button>

        </section>
      </main>

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
