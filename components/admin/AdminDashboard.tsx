'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { WaitlistEntry, OrderEntry } from '@/app/admin/page'

// ── Drop date (keep in sync with CountdownTimer.tsx) ─────────────────────
const RELEASE_DATE = new Date('2026-07-30T00:00:00')

function daysUntilDrop() {
  const diff = RELEASE_DATE.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function exportCSV(waitlist: WaitlistEntry[]) {
  const header = 'Email,Joined\n'
  const rows   = waitlist.map(e => `${e.email},${fmtDate(e.joinedAt)}`).join('\n')
  const blob   = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url    = URL.createObjectURL(blob)
  const a      = document.createElement('a')
  a.href = url
  a.download = `archive-waitlist-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#141414] border border-white/[0.07] p-6 flex flex-col gap-2">
      <p className="font-body text-white/35 text-[10px] tracking-[0.3em] uppercase">{label}</p>
      <p className="font-digits font-[700] text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {value}
      </p>
      {sub && <p className="font-body text-white/25 text-[11px]">{sub}</p>}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────
const STATUS_COLORS: Record<OrderEntry['status'], string> = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  shipped:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10  text-green-400  border-green-500/20',
  cancelled: 'bg-red-500/10    text-red-400    border-red-500/20',
}

function StatusBadge({ status }: { status: OrderEntry['status'] }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] tracking-[0.15em] uppercase font-body ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────
interface Props {
  waitlist: WaitlistEntry[]
  orders:   OrderEntry[]
}

type Tab = 'waitlist' | 'orders'

export function AdminDashboard({ waitlist, orders }: Props) {
  const [tab, setTab]         = useState<Tab>('waitlist')
  const [search, setSearch]   = useState('')
  const [copied, setCopied]   = useState<string | null>(null)
  const router = useRouter()

  const filteredWaitlist = useMemo(() =>
    waitlist.filter(e => e.email.toLowerCase().includes(search.toLowerCase()))
  , [waitlist, search])

  const filteredOrders = useMemo(() =>
    orders.filter(o =>
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase())
    )
  , [orders, search])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email)
    setCopied(email)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">

      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">

          {/* Brand + title */}
          <div className="flex items-center gap-4">
            <span className="font-display font-light italic text-white text-xl tracking-wider">M</span>
            <span className="w-px h-4 bg-white/10" />
            <span className="font-body text-white/40 text-[11px] tracking-[0.25em] uppercase">Admin</span>
          </div>

          {/* Tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {(['waitlist', 'orders'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch('') }}
                className={`px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 ${
                  tab === t
                    ? 'bg-white text-[#0a0a0a]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {t} {t === 'waitlist' ? `(${waitlist.length})` : `(${orders.length})`}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white text-[11px] tracking-[0.2em] uppercase
                       transition-colors duration-200 flex items-center gap-1.5"
          >
            Logout
            <span className="text-base leading-none">→</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 space-y-8">

        {/* ── Mobile tab switcher ────────────────────────── */}
        <div className="flex sm:hidden gap-1">
          {(['waitlist', 'orders'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch('') }}
              className={`flex-1 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 border ${
                tab === t
                  ? 'bg-white text-[#0a0a0a] border-white'
                  : 'text-white/40 border-white/10 hover:text-white'
              }`}
            >
              {t} ({t === 'waitlist' ? waitlist.length : orders.length})
            </button>
          ))}
        </div>

        {/* ── Stats row ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Waitlist Signups" value={waitlist.length} sub="emails collected" />
          <StatCard label="Days to Drop"     value={daysUntilDrop()} sub="July 30, 2026" />
          <StatCard
            label="Orders"
            value={orders.length === 0 ? '—' : orders.length}
            sub={orders.length === 0 ? 'Collection not dropped yet' : 'total orders'}
          />
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === 'waitlist' ? (
            <motion.section
              key="waitlist"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Table header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/40">
                  Waitlist — {filteredWaitlist.length} {filteredWaitlist.length === 1 ? 'entry' : 'entries'}
                </h2>
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search emails…"
                    className="bg-white/[0.04] border border-white/10 text-white text-[12px]
                               px-3 py-2 outline-none focus:border-white/25 placeholder:text-white/20
                               transition-colors duration-200 w-48"
                  />
                  {/* Export */}
                  <button
                    onClick={() => exportCSV(waitlist)}
                    className="bg-white/[0.06] border border-white/10 text-white/60 hover:text-white
                               hover:bg-white/10 text-[11px] tracking-[0.15em] uppercase px-4 py-2
                               transition-all duration-200 whitespace-nowrap"
                  >
                    ↓ CSV
                  </button>
                </div>
              </div>

              {filteredWaitlist.length === 0 ? (
                <div className="bg-[#141414] border border-white/[0.07] p-16 text-center">
                  <p className="text-white/20 text-sm tracking-wide">
                    {search ? 'No results found.' : 'No signups yet. Share the link!'}
                  </p>
                </div>
              ) : (
                <div className="bg-[#141414] border border-white/[0.07] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white/30 font-normal w-12">#</th>
                        <th className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white/30 font-normal">Email</th>
                        <th className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white/30 font-normal hidden md:table-cell">Joined</th>
                        <th className="px-5 py-3 w-20" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWaitlist.map((entry, i) => (
                        <motion.tr
                          key={entry.email}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 group"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          <td className="px-5 py-3.5 text-white/20 text-sm tabular-nums">{i + 1}</td>
                          <td className="px-5 py-3.5 text-white text-sm">{entry.email}</td>
                          <td className="px-5 py-3.5 text-white/35 text-[12px] hidden md:table-cell">
                            {fmtDate(entry.joinedAt)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => copyEmail(entry.email)}
                              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white
                                         text-[10px] tracking-[0.15em] uppercase transition-all duration-150"
                            >
                              {copied === entry.email ? '✓ copied' : 'copy'}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>

          ) : (
            <motion.section
              key="orders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/40">
                  Orders — {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                </h2>
                {orders.length > 0 && (
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search orders…"
                    className="bg-white/[0.04] border border-white/10 text-white text-[12px]
                               px-3 py-2 outline-none focus:border-white/25 placeholder:text-white/20
                               transition-colors duration-200 w-48"
                  />
                )}
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#141414] border border-white/[0.07] p-16 text-center space-y-3">
                  <p className="text-white/20 text-sm tracking-wide">No orders yet.</p>
                  <p className="text-white/10 text-[11px] tracking-[0.15em] uppercase">
                    Collection drops July 30, 2026 · {daysUntilDrop()} days away
                  </p>
                </div>
              ) : (
                <div className="bg-[#141414] border border-white/[0.07] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['#', 'Customer', 'Product', 'Size', 'Total', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white/30 font-normal whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          <td className="px-5 py-3.5 text-white/20 text-sm tabular-nums">{i + 1}</td>
                          <td className="px-5 py-3.5">
                            <p className="text-white text-sm">{order.name}</p>
                            <p className="text-white/35 text-[11px]">{order.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-white/70 text-sm">{order.product}</td>
                          <td className="px-5 py-3.5 text-white/70 text-sm uppercase">{order.size}</td>
                          <td className="px-5 py-3.5 text-white text-sm tabular-nums font-[600]">
                            {order.total.toLocaleString()} DZD
                          </td>
                          <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-3.5 text-white/35 text-[11px] whitespace-nowrap">
                            {fmtDate(order.createdAt)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
