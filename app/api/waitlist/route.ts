import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = (body as { email?: unknown }).email
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const clean = email.toLowerCase().trim()

  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })

    let list: { email: string; joinedAt: string }[] = []
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8')
      list = JSON.parse(raw)
    } catch {
      // file doesn't exist yet — start fresh
    }

    if (!list.find((e) => e.email === clean)) {
      list.push({ email: clean, joinedAt: new Date().toISOString() })
      await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
    }

    // ── Mailchimp integration (uncomment & fill in when ready) ──────────────
    //
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!
    // const LIST_ID           = process.env.MAILCHIMP_LIST_ID!
    // const DC                = MAILCHIMP_API_KEY.split('-').pop()  // e.g. "us21"
    //
    // await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email_address: clean, status: 'subscribed' }),
    // })
    //
    // ────────────────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
