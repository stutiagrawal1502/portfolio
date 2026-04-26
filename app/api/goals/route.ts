import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(goals)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const goal = await prisma.goal.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      area: body.area ?? 'PERSONAL',
      status: body.status ?? 'ACTIVE',
      targetDate: body.targetDate ? new Date(body.targetDate) : null,
    },
  })
  return NextResponse.json(goal, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  if (data.targetDate) data.targetDate = new Date(data.targetDate)
  if (data.status === 'COMPLETED') data.completedAt = new Date()

  const goal = await prisma.goal.update({ where: { id }, data })
  return NextResponse.json(goal)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await prisma.goal.delete({ where: { id: body.id } })
  return NextResponse.json({ ok: true })
}
