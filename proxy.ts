import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_AUTH, COOKIE_EMAIL, ALLOWED_EMAILS } from '@/lib/auth-simple'

export function proxy(request: NextRequest) {
  const auth  = request.cookies.get(COOKIE_AUTH)?.value
  const email = request.cookies.get(COOKIE_EMAIL)?.value

  const authed =
    auth === 'true' &&
    !!email &&
    ALLOWED_EMAILS.includes(email.trim().toLowerCase())

  if (!authed) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/write/:path*',
    '/planner/:path*',
    '/fitness-log/:path*',
    '/health/:path*',
    '/settings/:path*',
  ],
}
