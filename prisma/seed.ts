import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { generateSlug } from '../lib/utils'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Journey config — the start of everything
  await prisma.journeyConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      startDate: new Date('2026-04-20'),
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      phase: 1,
      note: 'Starting from scratch. That\'s the point.',
    },
  })

  // Seed posts
  const posts = [
    {
      title: 'The day I decided to stop waiting to be ready',
      type: 'JOURNAL' as const,
      status: 'PUBLISHED' as const,
      mood: 'resolute',
      excerpt: "I've been waiting to be fit before I start talking about fitness. Waiting to be certain before I start writing. This is me stopping that.",
      content: `I've been waiting to be fit before I start talking about fitness. Waiting to be certain before I start writing. Waiting to have something worth saying before I say anything at all.

The waiting has to stop.

This is me, on an ordinary Tuesday, deciding that the version of myself I keep postponing is not arriving. She's not coming. She is me, now, imperfect and unready and showing up anyway.

Three years of auditing other people's processes taught me something: you don't fix what you can't see. So I'm making myself visible — to myself, mostly. To anyone else who happens to find this.

Here's what I know: I work at EY. I write poetry when the world gets too loud. I haven't been consistent with fitness, with my health, with the things I keep saying matter. I have a vitamin D deficiency and I keep forgetting to take the supplements. I've been meaning to do something about that.

I'm starting now.

Not when I'm ready. Not when it makes sense. Now.`,
      tags: ['beginning', 'working woman', 'honest'],
    },
    {
      title: '5am and the garden knows',
      type: 'POEM' as const,
      status: 'PUBLISHED' as const,
      mood: 'quiet and awake',
      excerpt: 'A poem about the hour before the city wakes.',
      content: `the garden at 5am
knows something the rest of the day won't admit —

that before the city's engine turns,
before the notifications,
before the commute and the standup
and the polite performance of being fine —

there is just this:
the damp grass,
the sky between navy and nothing,
the birds who haven't learned yet
that no one is listening.

I come here because it is the only hour
that belongs only to me.

I come here because starting is easier
when no one is watching.

I come here because the garden
doesn't ask what I've accomplished.
It just keeps growing.`,
      tags: ['morning', 'malad', 'beginning'],
    },
    {
      title: 'Three years at EY: what auditing taught me about myself',
      type: 'BLOG' as const,
      status: 'PUBLISHED' as const,
      mood: 'reflective',
      excerpt: 'Three years in risk advisory taught me that the most important thing to audit is yourself.',
      content: `Three years is long enough to learn something real.

I joined EY in risk advisory because I wanted to understand how organisations work — the internal machinery, the controls, the gaps between what people say they do and what they actually do. I got that. But I also got something I didn't expect.

Auditing teaches you to look for the delta between intention and execution. You walk into an organisation with their documented processes and their stated controls, and you ask: does this actually happen? Is the gap material?

After three years, I started asking that question about myself.

**On documentation:** I had elaborate plans. I documented my goals. I wrote down what I wanted my life to look like. But documentation is not execution. The most beautifully written audit framework is worthless if the controls don't run.

**On materiality:** In audit, materiality is the threshold above which something matters. I spent a lot of time worrying about immaterial things. The right framework helped me see what was actually worth fixing.

**On exceptions:** Every audit has findings. The question is never "is this perfect?" but "is this working, and where are the gaps?" I am learning to apply that to myself. Not self-criticism. Exception management.

This is what three years of internal controls work looks like when it turns inward.

I'm still learning to audit myself with the same rigour I apply to the work. That's what this whole project is — a documented process improvement, running in real time.`,
      tags: ['EY', 'career', 'growth'],
    },
  ]

  for (const post of posts) {
    const slug = generateSlug(post.title)
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        ...post,
        slug,
        publishedAt: new Date(),
      },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
