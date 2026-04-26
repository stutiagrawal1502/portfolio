'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type PostType = 'BLOG' | 'POEM' | 'JOURNAL' | 'ESSAY' | 'CSR' | 'SPORTS' | 'FITNESS_REFLECTION'
type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

interface Post {
  id: string
  title: string
  slug: string
  type: PostType
  status: PostStatus
  mood: string | null
  excerpt: string | null
  tags: string[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  content: string
}

const TYPE_COLORS: Record<PostType, string> = {
  BLOG: '#93C5FD',
  POEM: '#FCD34D',
  JOURNAL: '#C4B5FD',
  ESSAY: '#86EFAC',
  CSR: '#6EE7B7',
  SPORTS: '#F9A8D4',
  FITNESS_REFLECTION: '#86EFAC',
}

const STATUS_COLORS: Record<PostStatus, string> = {
  DRAFT: '#6B7280',
  PUBLISHED: '#86EFAC',
  ARCHIVED: '#4B5563',
}

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PostType | PostStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/posts?limit=200')
    if (res.ok) setPosts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch('/api/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPosts(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  const toggleStatus = async (post: Post) => {
    const newStatus: PostStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setToggling(post.id)
    const res = await fetch('/api/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status: newStatus, publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : null }),
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts(p => p.map(x => x.id === post.id ? { ...x, ...updated } : x))
    }
    setToggling(null)
  }

  const filters: { label: string; value: PostType | PostStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Drafts', value: 'DRAFT' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Poems', value: 'POEM' },
    { label: 'Blog', value: 'BLOG' },
    { label: 'Journal', value: 'JOURNAL' },
    { label: 'Essay', value: 'ESSAY' },
  ]

  const filtered = posts.filter(p => {
    const matchesFilter = filter === 'ALL' || p.type === filter || p.status === filter
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const drafts = posts.filter(p => p.status === 'DRAFT').length
  const published = posts.filter(p => p.status === 'PUBLISHED').length

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Content library
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            All Posts
          </h1>
        </div>
        <Link
          href="/write"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--paper)', padding: '8px 16px', borderRadius: 7, textDecoration: 'none' }}
        >
          + New Post
        </Link>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Total', value: posts.length, color: 'var(--ink)' },
          { label: 'Published', value: published, color: '#86EFAC' },
          { label: 'Drafts', value: drafts, color: '#FCD34D' },
        ].map(s => (
          <div key={s.label} className="cockpit-stat-block" style={{ padding: '10px 16px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: 6,
                border: `1px solid ${filter === f.value ? 'var(--ink)' : 'var(--border-solid)'}`,
                background: filter === f.value ? 'var(--ink)' : 'transparent',
                color: filter === f.value ? 'var(--paper)' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search titles..."
          style={{
            marginLeft: 'auto',
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            background: 'var(--paper)', border: '1px solid var(--border-solid)',
            borderRadius: 6, padding: '7px 12px', color: 'var(--ink)', outline: 'none', width: 200,
          }}
        />
      </div>

      {/* Posts table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)', marginBottom: 12 }}>✦</div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            {search ? 'No posts match your search.' : 'No posts yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(post => (
            <div
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 16,
                alignItems: 'center',
                padding: '14px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--border-solid)',
                borderRadius: 8,
                transition: 'border-color 0.12s',
              }}
            >
              {/* Left: title + meta */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: TYPE_COLORS[post.type], background: `${TYPE_COLORS[post.type]}15`,
                    border: `1px solid ${TYPE_COLORS[post.type]}30`, borderRadius: 4, padding: '2px 7px',
                  }}>
                    {post.type.replace('_', ' ')}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: STATUS_COLORS[post.status],
                  }}>
                    {post.status}
                  </span>
                  {post.mood && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', fontStyle: 'italic' }}>
                      {post.mood}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 400, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Untitled</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
                    {wordCount(post.content)} words
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
                    {timeAgo(post.updatedAt)}
                  </span>
                  {post.publishedAt && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#86EFAC' }}>
                      Published {timeAgo(post.publishedAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggleStatus(post)}
                  disabled={toggling === post.id}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                    padding: '5px 11px', borderRadius: 5, cursor: 'pointer', transition: 'all 0.12s',
                    border: `1px solid ${post.status === 'PUBLISHED' ? '#86EFAC40' : '#FCD34D40'}`,
                    background: 'transparent',
                    color: post.status === 'PUBLISHED' ? '#86EFAC' : '#FCD34D',
                    opacity: toggling === post.id ? 0.5 : 1,
                  }}
                >
                  {toggling === post.id ? '...' : post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
                <Link
                  href={`/write/${post.id}`}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                    padding: '5px 11px', borderRadius: 5, textDecoration: 'none',
                    border: '1px solid var(--border-solid)', background: 'transparent', color: 'var(--muted)',
                  }}
                >
                  Edit
                </Link>
                {post.status === 'PUBLISHED' && post.slug && (
                  <Link
                    href={`/expressions/${post.slug}`}
                    target="_blank"
                    style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                      padding: '5px 11px', borderRadius: 5, textDecoration: 'none',
                      border: '1px solid var(--border-solid)', background: 'transparent', color: 'var(--muted)',
                    }}
                  >
                    View ↗
                  </Link>
                )}
                <button
                  onClick={() => deletePost(post.id, post.title)}
                  disabled={deleting === post.id}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                    padding: '5px 11px', borderRadius: 5, cursor: 'pointer',
                    border: '1px solid #EF444430', background: 'transparent', color: '#EF4444',
                    opacity: deleting === post.id ? 0.5 : 1, transition: 'all 0.12s',
                  }}
                >
                  {deleting === post.id ? '...' : 'Del'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
