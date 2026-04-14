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
  BLOG: '#2B4C7E',
  POEM: '#B8860B',
  JOURNAL: '#8A7F74',
  ESSAY: '#1A1714',
  CSR: '#3D6B4F',
  SPORTS: '#C4735A',
  FITNESS_REFLECTION: '#3D6B4F',
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

  return (
    <main className="min-h-screen pt-24 pb-32 px-6">
      {/* Type accent line */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ background: accentColor }}
      />

      <article className="max-w-2xl mx-auto">
        {/* Type badge */}
        <div className="mb-6">
          <span
            className={`type-badge type-badge-${post.type.toLowerCase().replace('_reflection', '')}`}
          >
            {typeLabel}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-normal text-ink leading-tight mb-6">
          {post.title}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-border">
          <span className="font-mono text-sm text-muted">{formatDate(date)}</span>
          <span className="font-mono text-xs text-border">·</span>
          <span className="font-mono text-sm text-muted">{readTime}</span>
          {post.mood && (
            <>
              <span className="font-mono text-xs text-border">·</span>
              <span className="mood-tag">{post.mood}</span>
            </>
          )}
          {post.tags.length > 0 && (
            <>
              <span className="font-mono text-xs text-border">·</span>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="font-mono text-xs text-muted">
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
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-display italic text-xl text-muted">
            {question}
          </p>
        </div>

        {/* Share */}
        <div className="mt-8">
          <ShareButton />
        </div>
      </article>
    </main>
  )
}
