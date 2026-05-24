/**
 * Dual-mode storage layer
 *
 * LOCAL  (no UPSTASH env vars) → reads/writes JSON files under /data/
 * PROD   (UPSTASH env vars set) → uses Upstash Redis (serverless-safe)
 *
 * Setup for production:
 *   Vercel dashboard → Integrations → Marketplace → "Upstash Redis" → Add
 *   (env vars are injected automatically: UPSTASH_REDIS_REST_URL + _TOKEN)
 */

import { promises as fs } from 'fs'
import path from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface WaitlistEntry {
  email: string
  joinedAt: string
}

export interface OrderEntry {
  id: string
  name: string
  email: string
  product: string
  size: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const DATA = path.join(process.cwd(), 'data')

async function readJson<T>(file: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA, file), 'utf-8'))
  } catch {
    return []
  }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA, { recursive: true })
  await fs.writeFile(path.join(DATA, file), JSON.stringify(data, null, 2), 'utf-8')
}

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  // Lazy-import so the module is never loaded in local-file mode
  const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis')
  return new Redis({ url, token })
}

// ── Waitlist ──────────────────────────────────────────────────────────────────
export async function addToWaitlist(email: string): Promise<boolean> {
  const redis = getRedis()
  const clean = email.toLowerCase().trim()
  const joinedAt = new Date().toISOString()

  if (redis) {
    // HSETNX = set only if field doesn't exist (no duplicates)
    const added = await redis.hsetnx('waitlist', clean, joinedAt)
    return added === 1
  }

  const list = await readJson<WaitlistEntry>('waitlist.json')
  if (list.find(e => e.email === clean)) return false
  list.push({ email: clean, joinedAt })
  await writeJson('waitlist.json', list)
  return true
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const redis = getRedis()

  if (redis) {
    const data = (await redis.hgetall('waitlist')) as Record<string, string> | null
    if (!data) return []
    return Object.entries(data)
      .map(([email, joinedAt]) => ({ email, joinedAt }))
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
  }

  const list = await readJson<WaitlistEntry>('waitlist.json')
  return list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function getOrders(): Promise<OrderEntry[]> {
  const redis = getRedis()

  if (redis) {
    const raw = await redis.lrange('orders', 0, -1)
    return (raw as string[])
      .map(r => (typeof r === 'string' ? JSON.parse(r) : r) as OrderEntry)
      .reverse()
  }

  return readJson<OrderEntry>('orders.json')
}

export async function addOrder(order: OrderEntry): Promise<void> {
  const redis = getRedis()

  if (redis) {
    await redis.lpush('orders', JSON.stringify(order))
    return
  }

  const list = await readJson<OrderEntry>('orders.json')
  list.unshift(order)
  await writeJson('orders.json', list)
}
