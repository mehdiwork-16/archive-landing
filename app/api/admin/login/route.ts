import { NextResponse } from 'next/server'

const COOKIE   = 'archive_admin'
const MAX_AGE  = 60 * 60 * 24 * 7 // 7 days
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'mehdi2026'

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }))

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  })
  return res
}
