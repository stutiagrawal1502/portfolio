import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDate, readingTime } from '@/lib/utils'
import { ShareButton } from './ShareButton'

export const dynamic = 'force-dynamic'

const postTypeQuestions: Record<string, string> = {
  BLOG: 'What were you thinking?',
  JOURNAL: 'What were you feeling?',
  ESSAY: 'What do you believe now?',
  POEM: 'Where were you when you wrote this?',
  CSR: 'What did this change in you?',
  SPORTS: 'What does this make you want to do?',
  FITNESS_REFLECTION: 'What did your body tell you?',
}

const typeAccents: Record<string, string> = {
  BLOG: '#2563EB',
  POEM: '#B45309',
  JOURNAL: '#8A7F74',
  ESSAY: '#7C3AED',
  CSR: '#16A34A',
  SPORTS: '#DC4A2A',
  FITNESS_REFLECTION: '#16A34A',
}

const typeBg: Record<string, string> = {
  POEM: '#FEF3C7',
  BLOG: '#DBEAFE',
  JOURNAL: '#F3F4F6',
  ESSAY: '#EDE9FE',
  CSR: '#D1FAE5',
  SPORTS: '#FEE2E2',
  FITNESS_REFLECTION: '#D1FAE5',
}

const typeColor: Record<string, string> = {
  POEM: '#92400E',
  BLOG: '#1D4ED8',
  JOURNAL: '#4B5563',
  ESSAY: '#5B21B6',
  CSR: '#065F46',
  SPORTS: '#B91C1C',
  FITNESS_REFLECTION: '#065F46',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post) return { title: 'Not found' }
  return {
    title: `${post.title} · Stuti Agrawal`,
    description: post.excerpt ?? undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })

  if (!post || post.status === 'PRIVATE') notFound()

  const date = post.publishedAt ?? post.createdAt
  const readTime = readingTime(post.content)
  const accentColor = typeAccents[post.type] ?? '#8A7F74'
  const question = postTypeQuestions[post.type] ?? 'What were you thinking?'
  const typeLabel = post.type.replace('_', ' ').toLowerCase()
  const badgeBg = typeBg[post.type] ?? '#F3F4F6'
  const badgeCol = typeColor[post.type] ?? '#4B5563'

  return (
    <main style={{ padding: '0 24px 96px' }}>
      {/* 4px accent bar fixed below nav */}
      <div
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          height: 4,
          background: accentColor,
          zIndex: 40,
        }}
      />

      <article style={{ maxWidth: 680, margin: '0 auto', paddingTop: 56 }}>

        {/* Back link */}
        <div style={{ marginBottom: 40 }}>
          <a
            href="/expressions"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.15s ease',
            }}
          >
            ← Expressions
          </a>
        </div>

        {/* Type badge */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: badgeCol,
              background: badgeBg,
              padding: '4px 10px',
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.18,
            marginBottom: 28,
            letterSpacing: '-0.01em',
          }}
        >
          {post.title}
        </h1>

        {/* Meta strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 8,
            marginBottom: 40,
            paddingBottom: 24,
            borderBottom: '1px solid var(--border-solid)',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: 'var(--muted)',
            }}
          >
            {formatDate(date)}
          </span>

          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--border-solid)',
            }}
          >
            ·
          </span>

          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: 'var(--muted)',
            }}
          >
            {readTime}
          </span>

          {post.mood && (
            <>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: 'var(--border-solid)',
                }}
              >
                ·
              </span>
              <span className="mood-tag">{post.mood}</span>
            </>
          )}

          {post.tags.length > 0 && (
            <>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: 'var(--border-solid)',
                }}
              >
                ·
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: 'var(--muted)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="prose-dawn">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Closing question */}
        <div
          style={{
            marginTop: 72,
            paddingTop: 32,
            borderTop: '1px solid var(--border-solid)',
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 22,
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            {question}
          </p>
        </div>

        {/* Share */}
        <div style={{ marginTop: 32 }}>
          <ShareButton />
        </div>
      </article>
    </main>
  )
}
