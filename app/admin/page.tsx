import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

const COOKIE = 'archive_admin'
const DATA   = path.join(process.cwd(), 'data')

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

export default async function AdminPage() {
  // Auth check
  const cookieStore = await cookies()
  const session  = cookieStore.get(COOKIE)?.value
  const expected = process.env.ADMIN_PASSWORD ?? 'mehdi2026'
  if (session !== expected) redirect('/admin/login')

  // Read waitlist
  let waitlist: WaitlistEntry[] = []
  try {
    const raw = await fs.readFile(path.join(DATA, 'waitlist.json'), 'utf-8')
    waitlist = JSON.parse(raw)
  } catch {
    // File doesn't exist yet — no signups
  }

  // Read orders
  let orders: OrderEntry[] = []
  try {
    const raw = await fs.readFile(path.join(DATA, 'orders.json'), 'utf-8')
    orders = JSON.parse(raw)
  } catch {
    // File doesn't exist yet — no orders
  }

  return <AdminDashboard waitlist={waitlist} orders={orders} />
}
