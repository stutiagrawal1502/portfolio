import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!email || !message) return NextResponse.json({ error: 'Email and message required' }, { status: 400 })

  // Log to console (Resend can be wired in later with RESEND_API_KEY)
  console.log(`[Contact] From: ${name || 'Anonymous'} <${email}>\n${message}`)

  // If Resend is configured, send email
  const RESEND_KEY = process.env.RESEND_API_KEY
  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'contact@stutiagrawal.com',
          to: 'stutiagrawal1402@gmail.com',
          subject: `New message from ${name || email}`,
          text: `From: ${name || 'Anonymous'} <${email}>\n\n${message}`,
        }),
      })
    } catch (e) { console.error('Resend error:', e) }
  }

  return NextResponse.json({ ok: true })
}
