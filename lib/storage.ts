/**
 * Storage layer — Supabase (PostgreSQL) for production, JSON files for local dev.
 *
 * Tables needed in Supabase (run once in SQL Editor):
 * ─────────────────────────────────────────────────────
 * create table waitlist (
 *   id         bigserial primary key,
 *   email      text unique not null,
 *   joined_at  timestamptz default now()
 * );
 *
 * create table orders (
 *   id          text primary key,
 *   name        text,
 *   email       text,
 *   product     text,
 *   size        text,
 *   status      text default 'pending',
 *   total       numeric,
 *   created_at  timestamptz default now()
 * );
 * ─────────────────────────────────────────────────────
 */

import { promises as fs } from 'fs'
import path from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface WaitlistEntry {
  name:     string
  phone:    string
  email:    string
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

// ── Mode detection ────────────────────────────────────────────────────────────
function useSupabase() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// ── Local file helpers ────────────────────────────────────────────────────────
const DATA = path.join(process.cwd(), 'data')

async function readJson<T>(file: string): Promise<T[]> {
  try { return JSON.parse(await fs.readFile(path.join(DATA, file), 'utf-8')) }
  catch { return [] }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA, { recursive: true })
  await fs.writeFile(path.join(DATA, file), JSON.stringify(data, null, 2), 'utf-8')
}

// ── Waitlist ──────────────────────────────────────────────────────────────────
export async function addToWaitlist(
  email: string,
  name  = '',
  phone = '',
): Promise<void> {
  const clean = email.toLowerCase().trim()

  if (useSupabase()) {
    const { supabase } = await import('./supabase')
    const { error } = await supabase
      .from('waitlist')
      .upsert({ email: clean, name, phone }, { onConflict: 'email' })
    if (error) throw new Error(`Supabase insert failed: ${error.message}`)
    return
  }

  const list = await readJson<WaitlistEntry>('waitlist.json')
  if (!list.find(e => e.email === clean)) {
    list.push({ name, phone, email: clean, joinedAt: new Date().toISOString() })
    await writeJson('waitlist.json', list)
  }
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  if (useSupabase()) {
    const { supabase } = await import('./supabase')
    const { data } = await supabase
      .from('waitlist')
      .select('name, phone, email, joined_at')
      .order('joined_at', { ascending: false })
    return (data ?? []).map(r => ({
      name:     r.name     ?? '',
      phone:    r.phone    ?? '',
      email:    r.email,
      joinedAt: r.joined_at,
    }))
  }

  const list = await readJson<WaitlistEntry>('waitlist.json')
  return list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function getOrders(): Promise<OrderEntry[]> {
  if (useSupabase()) {
    const { supabase } = await import('./supabase')
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    return (data ?? []).map(r => ({
      id:        r.id,
      name:      r.name,
      email:     r.email,
      product:   r.product,
      size:      r.size,
      status:    r.status,
      total:     r.total,
      createdAt: r.created_at,
    }))
  }

  return readJson<OrderEntry>('orders.json')
}

export async function addOrder(order: OrderEntry): Promise<void> {
  if (useSupabase()) {
    const { supabase } = await import('./supabase')
    await supabase.from('orders').insert({
      id:         order.id,
      name:       order.name,
      email:      order.email,
      product:    order.product,
      size:       order.size,
      status:     order.status,
      total:      order.total,
      created_at: order.createdAt,
    })
    return
  }

  const list = await readJson<OrderEntry>('orders.json')
  list.unshift(order)
  await writeJson('orders.json', list)
}
