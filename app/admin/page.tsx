import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getWaitlist, getOrders } from '@/lib/storage'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

// Never cache this page — always fetch fresh data from Supabase
export const dynamic = 'force-dynamic'

export { type WaitlistEntry, type OrderEntry } from '@/lib/storage'

const COOKIE = 'archive_admin'

export default async function AdminPage() {
  // Auth check
  const cookieStore = await cookies()
  const session  = cookieStore.get(COOKIE)?.value
  const expected = process.env.ADMIN_PASSWORD ?? 'mehdi2026'
  if (session !== expected) redirect('/admin/login')

  const [waitlist, orders] = await Promise.all([getWaitlist(), getOrders()])

  return <AdminDashboard waitlist={waitlist} orders={orders} />
}
