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
      .then(r => r.ok ? r.json() : [])
      .then((data: Post[]) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [activeFilter])

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-ink mb-3">
            Expressions
          </h1>
          <p className="font-sans text-muted max-w-lg">
            Journal entries, essays, poems, and everything in between. Unfiltered, honest, mine.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
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
          <div className="font-mono text-sm text-muted animate-pulse">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="font-mono text-sm text-muted">
            Nothing here yet. {activeFilter !== 'ALL' && 'Try a different filter.'}
          </div>
        ) : (
          <EditorialLayout posts={posts} />
        )}
      </div>
    </main>
  )
}

function EditorialLayout({ posts }: { posts: Post[] }) {
  // Pattern: featured (full width), 2-col, wide, 3-col, repeat
  const groups: Post[][] = []
  let i = 0

  while (i < posts.length) {
    const pattern = groups.length % 4

    if (pattern === 0) {
      // 1 featured
      groups.push(posts.slice(i, i + 1))
      i += 1
    } else if (pattern === 1) {
      // 2-col
      groups.push(posts.slice(i, i + 2))
      i += 2
    } else if (pattern === 2) {
      // 1 wide
      groups.push(posts.slice(i, i + 1))
      i += 1
    } else {
      // 3-col
      groups.push(posts.slice(i, i + 3))
      i += 3
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
            <div key={gi} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          )
        }

        if (pattern === 2) {
          return (
            <div key={gi} className="max-w-2xl">
              <PostCard post={group[0]} />
            </div>
          )
        }

        return (
          <div key={gi} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {group.map(p => <PostCard key={p.id} post={p} size="compact" />)}
          </div>
        )
      })}
    </div>
  )
}
