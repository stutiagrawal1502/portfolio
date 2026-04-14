import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getFirstLine } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Poems · Stuti Agrawal',
  description: 'Written when the world gets too loud.',
}

export default async function PoemsPage() {
  const poems = await prisma.post.findMany({
    where: { type: 'POEM', status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      mood: true,
      publishedAt: true,
    },
  })

  return (
    <main className="poem-bg min-h-screen pt-28 pb-32 px-6">
      <div className="max-w-xl mx-auto">

        {/* Header — minimal */}
        <div className="mb-16">
          <h1 className="font-display text-3xl font-normal text-ink mb-2">
            Poems
          </h1>
          <p className="font-mono text-xs text-muted tracking-wide">
            written when the world gets too loud
          </p>
        </div>

        {/* Poem list — table of contents style */}
        {poems.length === 0 ? (
          <p className="font-mono text-sm text-muted">No poems yet.</p>
        ) : (
          <ol className="space-y-10">
            {poems.map(poem => (
              <li key={poem.id}>
                <Link
                  href={`/poems/${poem.slug}`}
                  className="group block"
                >
                  <h2 className="font-display text-xl font-normal text-ink group-hover:text-poem-gold transition-colors duration-200">
                    {poem.title}
                  </h2>
                  <p className="font-sans text-muted text-sm mt-1 leading-relaxed">
                    {getFirstLine(poem.content)}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}
