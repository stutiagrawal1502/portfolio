import { cookies } from 'next/headers'

// ─── Allowed emails ────────────────────────────────────────────────────────
export const ALLOWED_EMAILS = [
  'stutiagrawal1402@gmail.com',
  'himanshushourabh@gmail.com',
]

export function isAllowedEmail(email: string): boolean {
  return ALLOWED_EMAILS.includes(email.trim().toLowerCase())
}

// ─── Cookie names ──────────────────────────────────────────────────────────
export const COOKIE_AUTH  = 'sa_auth'
export const COOKIE_EMAIL = 'sa_email'

// ─── Server-side session read (for server components & API routes) ─────────
export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies()
  const auth  = store.get(COOKIE_AUTH)?.value
  const email = store.get(COOKIE_EMAIL)?.value

  if (auth !== 'true' || !email || !isAllowedEmail(email)) return null
  return { email }
}
