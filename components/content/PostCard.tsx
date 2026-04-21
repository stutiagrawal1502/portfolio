'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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

const accentBorder: Record<string, string> = {
  POEM: '#B45309',
  BLOG: '#2563EB',
  CSR: '#16A34A',
  SPORTS: '#DC4A2A',
  ESSAY: '#7C3AED',
  FITNESS_REFLECTION: '#16A34A',
}

export function PostCard({ post, size = 'normal' }: PostCardProps) {
  const date = post.publishedAt ?? post.createdAt
  const readTime = readingTime(post.content)
  const excerpt =
    post.excerpt ??
    truncate(
      post.content.replace(/[#*`>-]/g, ''),
      size === 'featured' ? 180 : 120,
    )
  const typeLabel = post.type.replace('_', ' ').toLowerCase()
  const bg = typeBg[post.type] ?? '#F3F4F6'
  const col = typeColor[post.type] ?? '#4B5563'
  const border = accentBorder[post.type]

  if (size === 'compact') {
    return (
      <Link href={`/expressions/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            padding: '16px 20px',
            border: '1px solid var(--border-solid)',
            borderLeft: border ? `3px solid ${border}` : '1px solid var(--border-solid)',
            borderRadius: 10,
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            height: '100%',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 16,
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {post.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: col,
                background: bg,
                padding: '2px 7px',
                borderRadius: 4,
              }}
            >
              {typeLabel}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: 'var(--muted)',
              }}
            >
              {formatDate(date)}
            </span>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (size === 'featured') {
    return (
      <Link href={`/expressions/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            padding: 36,
            background: 'var(--surface)',
            border: '1px solid var(--border-solid)',
            borderTop: border ? `3px solid ${border}` : '1px solid var(--border-solid)',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: col,
                background: bg,
                padding: '4px 10px',
                borderRadius: 4,
              }}
            >
              {typeLabel}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: 'var(--muted)',
                flexShrink: 0,
              }}
            >
              {readTime}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            {post.title}
          </h3>

          {excerpt && (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: 'var(--muted)',
                lineHeight: 1.7,
                flex: 1,
                marginBottom: 24,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTop: '1px solid var(--border-solid)',
            }}
          >
            {post.mood && <span className="mood-tag">{post.mood}</span>}
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: 'var(--muted)',
                marginLeft: 'auto',
              }}
            >
              {formatDate(date)}
            </span>
          </div>
        </motion.div>
      </Link>
    )
  }

  // normal
  return (
    <Link
      href={`/expressions/${post.slug}`}
      style={{ display: 'block', textDecoration: 'none', height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border-solid)',
          borderLeft: border ? `3px solid ${border}` : '1px solid var(--border-solid)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: col,
            background: bg,
            padding: '3px 8px',
            borderRadius: 4,
            display: 'inline-block',
            marginBottom: 14,
          }}
        >
          {typeLabel}
        </span>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {post.title}
        </h3>

        {post.mood && (
          <span className="mood-tag" style={{ marginBottom: 10, display: 'inline-block' }}>
            {post.mood}
          </span>
        )}

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.65,
            flex: 1,
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--border-solid)',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            {readTime}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            {formatDate(date)}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
