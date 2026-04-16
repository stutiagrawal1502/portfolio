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

const typeBadgeClass: Record<string, string> = {
  POEM:               'type-badge-poem',
  BLOG:               'type-badge-blog',
  JOURNAL:            'type-badge-journal',
  ESSAY:              'type-badge-essay',
  CSR:                'type-badge-csr',
  SPORTS:             'type-badge-sports',
  FITNESS_REFLECTION: 'type-badge-fitness',
}

const typeAccentClass: Record<string, string> = {
  POEM:               'card-accent-gold',
  BLOG:               'card-accent-blue',
  CSR:                'card-accent-green',
  SPORTS:             'card-accent-rose',
  ESSAY:              '',
  JOURNAL:            '',
  FITNESS_REFLECTION: 'card-accent-green',
}

export function PostCard({ post, size = 'normal' }: PostCardProps) {
  const date = post.publishedAt ?? post.createdAt
  const readTime = readingTime(post.content)
  const excerpt = post.excerpt ?? truncate(post.content.replace(/[#*`>-]/g, ''), 120)
  const typeLabel = post.type.replace('_', ' ').toLowerCase()
  const badgeClass = typeBadgeClass[post.type] ?? 'type-badge-journal'
  const accentClass = size === 'featured' ? (typeAccentClass[post.type] ?? '') : ''

  return (
    <Link href={`/expressions/${post.slug}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <motion.article
        className={`dawn-card h-full flex flex-col ${accentClass}`}
        style={{ padding: size === 'featured' ? 32 : 24 }}
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Type badge */}
        <span
          className={`type-badge ${badgeClass}`}
          style={{ marginBottom: 12, display: 'inline-block' }}
        >
          {typeLabel}
        </span>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 8,
            fontSize: size === 'featured' ? 26 : size === 'compact' ? 17 : 20,
          }}
        >
          {post.title}
        </h3>

        {/* Mood */}
        {post.mood && <MoodTag mood={post.mood} className="mb-3" />}

        {/* Excerpt */}
        {size !== 'compact' && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: 'var(--muted)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
              marginBottom: 16,
            }}
          >
            {excerpt}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: '1px solid var(--border-solid)',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: 'var(--muted)',
            }}
          >
            {readTime}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: 'var(--muted)',
            }}
          >
            {formatDate(date)}
          </span>
        </div>
      </motion.article>
    </Link>
  )
}
