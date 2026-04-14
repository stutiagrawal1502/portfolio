'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MoodTag } from '@/components/ui/MoodTag'
import { formatDate, readingTime, truncate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  type: string
  status: string
  excerpt?: string | null
  mood?: string | null
  content: string
  publishedAt?: Date | string | null
  createdAt: Date | string
}

interface PostCardProps {
  post: Post
  size?: 'featured' | 'normal' | 'compact'
}

const typeColors: Record<string, string> = {
  POEM: 'type-badge-poem',
  BLOG: 'type-badge-blog',
  JOURNAL: 'type-badge-journal',
  ESSAY: 'type-badge-essay',
  CSR: 'type-badge-csr',
  SPORTS: 'type-badge-sports',
  FITNESS_REFLECTION: 'type-badge-fitness',
}

function getTypeBadgeClass(type: string): string {
  return typeColors[type] ?? 'type-badge-journal'
}

export function PostCard({ post, size = 'normal' }: PostCardProps) {
  const date = post.publishedAt ?? post.createdAt
  const readTime = readingTime(post.content)
  const excerpt = post.excerpt ?? truncate(post.content.replace(/[#*`>-]/g, ''), 120)
  const typeLabel = post.type.replace('_', ' ').toLowerCase()

  return (
    <Link href={`/expressions/${post.slug}`} className="block group">
      <motion.article
        className={`dawn-card h-full flex flex-col ${size === 'featured' ? 'p-8' : 'p-6'}`}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Type badge */}
        <span className={`type-badge ${getTypeBadgeClass(post.type)} mb-3 w-fit`}>
          {typeLabel}
        </span>

        {/* Title */}
        <h3
          className={`font-display font-normal text-ink leading-snug group-hover:underline underline-offset-2 mb-2 ${
            size === 'featured' ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h3>

        {/* Mood */}
        {post.mood && <MoodTag mood={post.mood} className="mb-3" />}

        {/* Excerpt */}
        {size !== 'compact' && (
          <p className="font-sans text-muted text-sm line-clamp-2 flex-1 mb-4">
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
          <span className="font-mono text-xs text-muted">{readTime}</span>
          <span className="font-mono text-xs text-muted">
            {formatDate(date)}
          </span>
        </div>
      </motion.article>
    </Link>
  )
}
