'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface WaitlistModalProps {
  open: boolean
  onClose: () => void
}

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 380)
      return () => clearTimeout(t)
    }
  }, [open])

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )
  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }
  }, [open, handleKey])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || state === 'loading') return
    setState('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      if (!res.ok) throw new Error()

      // Also persist to localStorage as a backup
      const stored = JSON.parse(localStorage.getItem('waitlist') || '[]') as string[]
      if (!stored.includes(email.toLowerCase())) {
        stored.push(email.toLowerCase())
        localStorage.setItem('waitlist', JSON.stringify(stored))
      }

      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[340px] px-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 font-body text-black/30 hover:text-black
                         text-xs tracking-[0.25em] uppercase transition-colors duration-200"
              aria-label="Close"
            >
              Close
            </button>

            <AnimatePresence mode="wait">
              {state !== 'success' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-body text-black/35 uppercase tracking-[0.3em] text-[11px] mb-5">
                    Early Access
                  </p>

                  <h2
                    className="font-display font-light italic text-black mb-8 leading-tight"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}
                  >
                    Be first to know.
                  </h2>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-5">
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (state === 'error') setState('idle')
                        }}
                        placeholder="your@email.com"
                        required
                        className="w-full border-b border-black/20 focus:border-black bg-transparent
                                   outline-none pb-3 pt-1 font-body text-sm text-black
                                   placeholder:text-black/25 transition-colors duration-200"
                        style={{ letterSpacing: '0.02em' }}
                      />
                      {state === 'error' && (
                        <p className="font-body text-[11px] text-black/40 mt-2 tracking-[0.05em]">
                          Something went wrong — please try again.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="w-full bg-black text-white font-body text-[11px] tracking-[0.22em]
                                 uppercase py-4 hover:bg-black/80 active:scale-[0.98]
                                 transition-all duration-200 disabled:opacity-40"
                    >
                      {state === 'loading' ? 'Joining…' : 'Join the List'}
                    </button>
                  </form>

                  <p className="font-body text-black/20 text-[10px] tracking-[0.1em] mt-5 text-center">
                    No spam. Unsubscribe anytime.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  className="flex flex-col items-center text-center py-6"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Animated checkmark circle */}
                  <motion.div
                    className="w-11 h-11 rounded-full border border-black flex items-center justify-center mb-7"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <motion.path
                        d="M3.5 9l3.5 3.5 7.5-7"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                      />
                    </svg>
                  </motion.div>

                  <p
                    className="font-display font-light italic text-black mb-2"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)' }}
                  >
                    You&rsquo;re in.
                  </p>
                  <p className="font-body text-black/35 text-[11px] tracking-[0.2em] uppercase">
                    We&rsquo;ll reach out on drop day
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
