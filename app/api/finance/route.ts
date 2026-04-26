import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'
import type { FinanceType, FinanceCategory } from '@/app/generated/prisma/client'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // "2026-05"
  const limit = parseInt(searchParams.get('limit') ?? '200')

  const where: Record<string, unknown> = {}
  if (month) {
    const [y, m] = month.split('-').map(Number)
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 1)
    where.date = { gte: start, lt: end }
  }

  try {
    const entries = await prisma.financeEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
    })
    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  try {
    const entry = await prisma.financeEntry.create({
      data: {
        date: new Date(body.date ?? new Date()),
        type: body.type as FinanceType,
        amount: parseFloat(body.amount),
        category: body.category as FinanceCategory,
        note: body.note ?? null,
        isRecurring: body.isRecurring ?? false,
      },
    })
    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  try {
    const entry = await prisma.financeEntry.update({ where: { id }, data })
    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  try {
    await prisma.financeEntry.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
