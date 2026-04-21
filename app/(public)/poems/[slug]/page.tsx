import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PoemRenderer } from '@/components/content/PoemRenderer'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const poem = await prisma.post.findUnique({ where: { slug } })
  if (!poem) return { title: 'Not found' }
  return {
    title: `${poem.title} · Stuti Agrawal`,
    description: `A poem by Stuti Agrawal`,
  }
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const poem = await prisma.post.findUnique({ where: { slug } })

  if (!poem || poem.type !== 'POEM' || poem.status === 'PRIVATE') notFound()

  const date = poem.publishedAt ?? poem.createdAt

  return (
    <main className="poem-bg" style={{ padding: '80px 24px 120px' }}>
      <article style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--poem-gold)', display: 'inline-block' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Poem
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--poem-gold)', display: 'inline-block' }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 400,
          color: 'var(--ink)',
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: 56,
        }}>
          {poem.title}
        </h1>

        {/* The poem — nothing else */}
        <PoemRenderer content={poem.content} />

        {/* Thin separator */}
        <div style={{
          width: 80,
          height: 1,
          background: 'var(--border-solid)',
          margin: '56px auto',
        }} />

        {/* Context note (mood as context) */}
        {poem.mood && (
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'var(--muted)',
            textAlign: 'center',
            marginBottom: 10,
            letterSpacing: '0.06em',
          }}>
            Written — {poem.mood}
          </p>
        )}

        {/* Date */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: 'var(--muted)',
          textAlign: 'center',
          marginBottom: 32,
          opacity: 0.6,
        }}>
          {formatDate(date)}
        </p>

        {/* Byline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 15,
          color: 'var(--muted)',
          textAlign: 'right',
        }}>
          — Stuti Agrawal
        </p>
      </article>
    </main>
  )
}
