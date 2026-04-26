import { prisma } from '../lib/prisma'

async function main() {
  const r = await prisma.journeyConfig.update({
    where: { id: 'singleton' },
    data: { startDate: new Date('2026-05-04T00:00:00.000Z') }
  })
  console.log('Updated startDate to:', r.startDate)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
