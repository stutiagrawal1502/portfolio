import { getSession } from '@/lib/auth-simple'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const days = await prisma.fitnessDay.findMany({ orderBy: { date: 'desc' } })

  const header = 'Date,Day #,Worked,Type,Duration (mins),Energy,Water (L),Sleep (hrs),Mood,Notes\n'
  const rows = days.map(d =>
    [
      new Date(d.date).toLocaleDateString('en-IN'),
      d.dayNumber,
      d.worked ? 'Yes' : 'No',
      d.workoutType ?? '',
      d.durationMins ?? '',
      d.energyBefore ?? '',
      d.waterLitres ?? '',
      d.sleepHours ?? '',
      d.mood ?? '',
      `"${(d.notes ?? '').replace(/"/g, '""')}"`,
    ].join(',')
  ).join('\n')

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="fitness-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
