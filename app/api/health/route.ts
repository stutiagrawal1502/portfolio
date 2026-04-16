import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const metricName = searchParams.get('metric')
  const limit = parseInt(searchParams.get('limit') ?? '30')

  const where = metricName ? { metricName } : {}

  try {
    const metrics = await prisma.healthMetric.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
    })
    return NextResponse.json(metrics)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  try {
    const metric = await prisma.healthMetric.create({
      data: {
        date: body.date ? new Date(body.date) : new Date(),
        metricName: body.metricName,
        value: body.value,
        unit: body.unit,
        notes: body.notes ?? null,
      },
    })
    return NextResponse.json(metric)
  } catch {
    return NextResponse.json({ error: 'Failed to save metric' }, { status: 500 })
  }
}
