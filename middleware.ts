import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'archive_admin'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let the login page through
  if (pathname === '/admin/login') return NextResponse.next()

  // Protect all other /admin/* routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(COOKIE)?.value
    const expected = process.env.ADMIN_PASSWORD ?? 'mehdi2026'

    if (session !== expected) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
