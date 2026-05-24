import { NextResponse } from 'next/server'
import { addToWaitlist } from '@/lib/storage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { email, name, phone } = body as { email?: unknown; name?: unknown; phone?: unknown }

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    await addToWaitlist(
      email,
      typeof name  === 'string' ? name.trim()  : '',
      typeof phone === 'string' ? phone.trim() : '',
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
