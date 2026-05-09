import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get('weekStart')
  if (weekStart) {
    const review = await prisma.weeklyReview.findUnique({ where: { weekStart: new Date(weekStart) } })
    return NextResponse.json(review)
  }
  const reviews = await prisma.weeklyReview.findMany({ orderBy: { weekStart: 'desc' }, take: 12 })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const review = await prisma.weeklyReview.upsert({
    where: { weekStart: new Date(body.weekStart) },
    update: { rating: body.rating, wentWell: body.wentWell, improved: body.improved, intention: body.intention },
    create: { id: `wr-${Date.now()}`, weekStart: new Date(body.weekStart), rating: body.rating, wentWell: body.wentWell, improved: body.improved, intention: body.intention },
  })
  return NextResponse.json(review)
}
