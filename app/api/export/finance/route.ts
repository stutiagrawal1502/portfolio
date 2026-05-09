import { getSession } from '@/lib/auth-simple'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entries = await prisma.financeEntry.findMany({ orderBy: { date: 'desc' } })

  const header = 'Date,Type,Category,Amount,Note,Recurring\n'
  const rows = entries.map(e =>
    [
      new Date(e.date).toLocaleDateString('en-IN'),
      e.type,
      e.category,
      e.amount.toFixed(2),
      `"${(e.note ?? '').replace(/"/g, '""')}"`,
      e.isRecurring ? 'Yes' : 'No',
    ].join(',')
  ).join('\n')

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="finance-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
