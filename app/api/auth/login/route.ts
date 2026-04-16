import { NextRequest, NextResponse } from 'next/server'
import { isAllowedEmail, COOKIE_AUTH, COOKIE_EMAIL } from '@/lib/auth-simple'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email: string = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  if (!isAllowedEmail(email)) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 })
  }

  const res = NextResponse.json({ ok: true })

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  }

  res.cookies.set(COOKIE_AUTH, 'true', cookieOpts)
  res.cookies.set(COOKIE_EMAIL, email, cookieOpts)

  return res
}
