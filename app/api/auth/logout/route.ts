import { NextResponse } from 'next/server'
import { COOKIE_AUTH, COOKIE_EMAIL } from '@/lib/auth-simple'

export async function POST() {
  const res = NextResponse.json({ ok: true })

  const clear = { path: '/', maxAge: 0 }
  res.cookies.set(COOKIE_AUTH, '', clear)
  res.cookies.set(COOKIE_EMAIL, '', clear)

  return res
}
