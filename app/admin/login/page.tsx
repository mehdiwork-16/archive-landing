'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Wrong password.')
      setPassword('')
      inputRef.current?.focus()
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-[320px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Brand */}
        <div className="mb-10 text-center">
          <span className="font-display italic text-white font-light"
                style={{ fontSize: '2rem', letterSpacing: '0.1em' }}>
            M
          </span>
          <p className="font-body text-white/30 text-[10px] tracking-[0.35em] uppercase mt-1">
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              required
              className="w-full bg-white/[0.04] border border-white/10 text-white
                         font-body text-sm px-4 py-3.5 outline-none
                         focus:border-white/30 placeholder:text-white/20
                         transition-colors duration-200"
              style={{ letterSpacing: '0.05em' }}
            />
          </div>

          {error && (
            <p className="font-body text-white/40 text-[11px] tracking-[0.1em]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0a0a0a] font-body text-[11px]
                       tracking-[0.28em] uppercase py-4
                       hover:bg-white/85 active:scale-[0.98]
                       transition-all duration-200 disabled:opacity-40"
          >
            {loading ? 'Entering…' : 'Enter'}
          </button>
        </form>
      </motion.div>
    </main>
  )
}
