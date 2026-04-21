import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getFirstLine } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    <main className="poem-bg" style={{ padding: '40px 24px 96px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header — deliberately sparse */}
        <div style={{ marginBottom: 56 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              color: 'var(--ink)',
              marginBottom: 12,
            }}
          >
            Poems
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: 'var(--muted)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              written when the world gets too loud
            </p>
            {poems.length > 0 && (
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: 'var(--muted)',
                  opacity: 0.55,
                  letterSpacing: '0.06em',
                }}
              >
                {poems.length} {poems.length === 1 ? 'poem' : 'poems'}
              </span>
            )}
          </div>
          <div
            style={{
              width: 32,
              height: 1,
              background: 'var(--poem-gold)',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Poem list — table of contents style */}
        {poems.length === 0 ? (
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 18,
                color: 'var(--muted)',
              }}
            >
              The first poem is still being written.
            </p>
          </div>
        ) : (
          <ol
            style={{
              listStyle: 'none',
              borderTop: '1px solid var(--border-solid)',
            }}
          >
            {poems.map(poem => (
              <li key={poem.id}>
                <Link href={`/poems/${poem.slug}`} className="poem-row">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <h2 className="poem-row-title">{poem.title}</h2>
                    {poem.publishedAt && (
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          color: 'var(--muted)',
                          flexShrink: 0,
                        }}
                      >
                        {new Date(poem.publishedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="poem-row-first-line">{getFirstLine(poem.content)}</p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}
