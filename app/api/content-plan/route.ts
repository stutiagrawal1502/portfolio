import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ContentStatus } from '@/app/generated/prisma/client'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const limit = parseInt(searchParams.get('limit') ?? '50')

  const plans = await prisma.contentPlan.findMany({
    where: {
      ...(startDate && endDate
        ? { date: { gte: new Date(startDate), lte: new Date(endDate) } }
        : {}),
    },
    orderBy: { date: 'asc' },
    take: limit,
  })

  return NextResponse.json(plans)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { date, title, type, platform, pillar, status, caption, notes, postId } = body

  const plan = await prisma.contentPlan.create({
    data: {
      date: new Date(date),
      title,
      type: type ?? 'POST',
      platform: platform ?? 'Instagram',
      pillar,
      status: (status as ContentStatus) ?? ContentStatus.IDEA,
      caption,
      notes,
      postId,
    },
  })

  return NextResponse.json(plan, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  if (updates.status) updates.status = updates.status as ContentStatus
  if (updates.date) updates.date = new Date(updates.date)

  const plan = await prisma.contentPlan.update({
    where: { id },
    data: updates,
  })

  return NextResponse.json(plan)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.contentPlan.delete({ where: { id: body.id } })
  return NextResponse.json({ ok: true })
}
