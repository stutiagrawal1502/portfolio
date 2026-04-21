'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/content/PostCard'

type PostType = 'ALL' | 'BLOG' | 'POEM' | 'JOURNAL' | 'ESSAY' | 'CSR' | 'SPORTS' | 'FITNESS_REFLECTION'

const filters: { label: string; value: PostType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Journal', value: 'JOURNAL' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'Poem', value: 'POEM' },
  { label: 'Essay', value: 'ESSAY' },
  { label: 'CSR', value: 'CSR' },
  { label: 'Sports', value: 'SPORTS' },
]

interface Post {
  id: string
  title: string
  slug: string
  type: string
  status: string
  excerpt?: string | null
  mood?: string | null
  content: string
  publishedAt?: string | null
  createdAt: string
}

export default function ExpressionsPage() {
  const [activeFilter, setActiveFilter] = useState<PostType>('ALL')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ status: 'PUBLISHED' })
    if (activeFilter !== 'ALL') params.set('type', activeFilter)
    setLoading(true)
    fetch(`/api/posts?${params}`)
      .then(r => (r.ok ? r.json() : []))
      .then((data: Post[]) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [activeFilter])

  return (
    <main style={{ padding: '40px 24px 96px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div
          style={{
            marginBottom: 48,
            borderBottom: '1px solid var(--border-solid)',
            paddingBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              display: 'block',
              marginBottom: 10,
            }}
          >
            All writing
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Expressions
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: 'var(--muted)',
              maxWidth: 480,
            }}
          >
            Journal entries, essays, poems, and everything in between. Unfiltered, honest, mine.
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {filters.map(f => (
            <button
              key={f.value}
              className={`stamp-pill ${activeFilter === f.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts grid — editorial layout */}
        {loading ? (
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: 'var(--muted)',
              opacity: 0.6,
              padding: '48px 0',
            }}
          >
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--muted)',
              padding: '48px 0',
            }}
          >
            Nothing here yet.{activeFilter !== 'ALL' && ' Try a different filter.'}
          </div>
        ) : (
          <EditorialLayout posts={posts} />
        )}
      </div>
    </main>
  )
}

function EditorialLayout({ posts }: { posts: Post[] }) {
  // Pattern: featured (full width), 2-col, wide single, 3-col, repeat
  const groups: Post[][] = []
  let i = 0

  while (i < posts.length) {
    const pattern = groups.length % 4

    if (pattern === 0) {
      groups.push(posts.slice(i, i + 1))
      i += 1
    } else if (pattern === 1) {
      groups.push(posts.slice(i, i + 2))
      i += 2
    } else if (pattern === 2) {
      groups.push(posts.slice(i, i + 1))
      i += 1
    } else {
      groups.push(posts.slice(i, i + 3))
      i += 3
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {groups.map((group, gi) => {
        const pattern = gi % 4

        if (pattern === 0) {
          return (
            <div key={gi}>
              <PostCard post={group[0]} size="featured" />
            </div>
          )
        }

        if (pattern === 1) {
          return (
            <div
              key={gi}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
            >
              {group.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )
        }

        if (pattern === 2) {
          return (
            <div key={gi} style={{ maxWidth: 640 }}>
              <PostCard post={group[0]} />
            </div>
          )
        }

        return (
          <div
            key={gi}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {group.map(p => (
              <PostCard key={p.id} post={p} size="compact" />
            ))}
          </div>
        )
      })}
    </div>
  )
}
