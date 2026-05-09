import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-simple'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name } = body
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  try {
    await prisma.newsletterSignup.upsert({
      where: { email },
      update: { name: name ?? null },
      create: { id: `nl-${Date.now()}`, email, name: name ?? null },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const signups = await prisma.newsletterSignup.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(signups)
}
