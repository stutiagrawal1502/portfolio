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
    <main className="poem-bg min-h-screen pt-24 pb-32 px-6">
      <article className="max-w-[560px] mx-auto">

        {/* Title */}
        <h1 className="font-display text-2xl font-normal text-ink mb-12 text-center">
          {poem.title}
        </h1>

        {/* The poem — nothing else */}
        <PoemRenderer content={poem.content} />

        {/* Thin separator */}
        <hr className="border-border my-12 max-w-[120px] mx-auto" />

        {/* Context note (mood as context) */}
        {poem.mood && (
          <p className="font-mono text-xs text-muted text-center mb-4">
            Written — {poem.mood}
          </p>
        )}

        {/* Date */}
        <p className="font-mono text-xs text-muted text-center mb-8">
          {formatDate(date)}
        </p>

        {/* Byline */}
        <p className="font-display italic text-muted text-right">
          — Stuti Agrawal
        </p>
      </article>
    </main>
  )
}
