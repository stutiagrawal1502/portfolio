const JOURNEY_TOTAL_DAYS = 180

export function getDayNumber(startDate: Date): number {
  const now = new Date()
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff + 1)
}

export function getStreak(days: { date: Date; worked: boolean }[]): number {
  if (!days.length) return 0

  const sorted = [...days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const day of sorted) {
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((currentDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays > 1) break
    if (!day.worked) break

    streak++
    currentDate = dayDate
  }

  return streak
}

export function getPhase(dayNumber: number): number {
  if (dayNumber <= 60)  return 1
  if (dayNumber <= 120) return 2
  return 3
}

export function getProgressPct(dayNumber: number, total = JOURNEY_TOTAL_DAYS): number {
  return Math.min(100, Math.round((dayNumber / total) * 100))
}

export function getMilestoneLabel(dayNumber: number): string | null {
  const milestones: Record<number, string> = {
    30:  'One Month',
    60:  'Two Months',
    90:  'Three Months',
    120: 'Four Months',
    180: 'The Full Journey',
  }
  return milestones[dayNumber] ?? null
}

export function getAvgEnergy(days: { energyBefore?: number | null }[]): number | null {
  const valid = days.filter(d => d.energyBefore != null).map(d => d.energyBefore as number)
  if (!valid.length) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}

export function getAvgWater(days: { waterLitres?: number | null }[]): number | null {
  const valid = days.filter(d => d.waterLitres != null).map(d => d.waterLitres as number)
  if (!valid.length) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}
