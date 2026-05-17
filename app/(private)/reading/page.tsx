'use client'

import { useState, useEffect, useCallback } from 'react'

type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED' | 'DROPPED'

interface Book {
  id: string
  title: string
  author: string
  status: BookStatus
  startedAt: string | null
  finishedAt: string | null
  rating: number | null
  notes: string | null
  quote: string | null
  coverUrl: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<BookStatus, { label: string; color: string; emoji: string }> = {
  WANT_TO_READ: { label: 'Want to read', color: '#C4B5FD', emoji: '📚' },
  READING:      { label: 'Reading',       color: '#FCD34D', emoji: '📖' },
  COMPLETED:    { label: 'Completed',     color: '#86EFAC', emoji: '✓'  },
  DROPPED:      { label: 'Dropped',       color: '#6B7280', emoji: '○'  },
}

const COVER_COLORS = ['#93C5FD', '#FCA5A5', '#86EFAC', '#FCD34D', '#C4B5FD', '#6EE7B7', '#F9A8D4', '#FB923C']

function coverColor(title: string) {
  let h = 0
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) % COVER_COLORS.length
  return COVER_COLORS[h]
}

function initials(title: string) {
  return title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function ReadingPage() {
  const [books, setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BookStatus | 'ALL'>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form
  const [title,  setTitle]  = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<BookStatus>('WANT_TO_READ')
  const [quote,  setQuote]  = useState('')
  const [notes,  setNotes]  = useState('')
  const [rating, setRating] = useState<number>(0)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/books')
    if (res.ok) setBooks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!title.trim() || !author.trim()) return
    setSaving(true)
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(), author: author.trim(), status,
        quote: quote || null, notes: notes || null,
        rating: rating || null,
        startedAt: status === 'READING' || status === 'COMPLETED' ? new Date().toISOString() : null,
        finishedAt: status === 'COMPLETED' ? new Date().toISOString() : null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setBooks(b => [created, ...b])
      setTitle(''); setAuthor(''); setStatus('WANT_TO_READ'); setQuote(''); setNotes(''); setRating(0)
      setShowForm(false)
    }
    setSaving(false)
  }

  const updateStatus = async (id: string, newStatus: BookStatus) => {
    const res = await fetch('/api/books', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, status: newStatus,
        startedAt: newStatus === 'READING' ? new Date().toISOString() : undefined,
        finishedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
      }),
    })
    if (res.ok) setBooks(b => b.map(x => x.id === id ? { ...x, status: newStatus } : x))
  }

  const deleteBook = async (id: string) => {
    await fetch('/api/books', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setBooks(b => b.filter(x => x.id !== id))
  }

  const filtered = filter === 'ALL' ? books : books.filter(b => b.status === filter)
  const reading   = books.filter(b => b.status === 'READING')
  const completed = books.filter(b => b.status === 'COMPLETED')

  return (
    <div className="page-content" style={{ maxWidth: 920, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Reading tracker
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            My Library
          </h1>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: showForm ? 'var(--border-solid)' : 'var(--ink)', color: showForm ? 'var(--muted)' : 'var(--paper)', padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer' }}
        >
          {showForm ? '✕ Cancel' : '+ Add book'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'Reading', value: reading.length, color: '#FCD34D' },
          { label: 'Completed', value: completed.length, color: '#86EFAC' },
          { label: 'Total', value: books.length, color: 'var(--ink)' },
        ].map(s => (
          <div key={s.label} className="cockpit-stat-block" style={{ padding: '10px 16px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="cockpit-card" style={{ marginBottom: 28 }}>
          <span className="cockpit-label">Add a book</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" autoFocus style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', outline: 'none' }} />
              <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', outline: 'none' }} />
            </div>
            {/* Status */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(Object.keys(STATUS_CONFIG) as BookStatus[]).map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 5, cursor: 'pointer', border: `1px solid ${status === s ? STATUS_CONFIG[s].color : 'var(--border-solid)'}`, background: status === s ? `${STATUS_CONFIG[s].color}20` : 'transparent', color: status === s ? STATUS_CONFIG[s].color : 'var(--muted)' }}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Rating</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(rating === n ? 0 : n)} style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= rating ? 1 : 0.25, transition: 'opacity 0.12s' }}>★</button>
              ))}
            </div>
            <input value={quote} onChange={e => setQuote(e.target.value)} placeholder="Favourite quote (optional)" style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: 'italic', color: 'var(--ink)', outline: 'none' }} />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes or thoughts (optional)" rows={2} style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', outline: 'none', resize: 'none' }} />
            <button onClick={save} disabled={saving || !title.trim() || !author.trim()} style={{ alignSelf: 'flex-start', fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', background: '#C4B5FD', color: '#0F0E0C', border: 'none', borderRadius: 7, padding: '9px 22px', cursor: saving || !title.trim() ? 'not-allowed' : 'pointer', opacity: !title.trim() ? 0.5 : 1 }}>
              {saving ? 'Adding…' : 'Add to library'}
            </button>
          </div>
        </div>
      )}

      {/* Currently reading — featured */}
      {reading.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FCD34D', marginBottom: 14 }}>
            📖 Currently reading
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {reading.map(book => <BookCard key={book.id} book={book} expanded={expanded === book.id} onExpand={() => setExpanded(expanded === book.id ? null : book.id)} onStatusChange={updateStatus} onDelete={deleteBook} />)}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['ALL', 'WANT_TO_READ', 'COMPLETED', 'DROPPED'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 5, cursor: 'pointer', border: `1px solid ${filter === f ? 'var(--ink)' : 'var(--border-solid)'}`, background: filter === f ? 'var(--ink)' : 'transparent', color: filter === f ? 'var(--paper)' : 'var(--muted)' }}>
            {f === 'ALL' ? 'All' : STATUS_CONFIG[f].label}
          </button>
        ))}
      </div>

      {/* Book grid */}
      {loading ? (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', padding: '24px 0' }}>Loading…</div>
      ) : filtered.filter(b => b.status !== 'READING').length === 0 && filter !== 'READING' ? (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)', marginBottom: 12 }}>📚</div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>No books here yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {filtered.filter(b => b.status !== 'READING').map(book => (
            <BookCard key={book.id} book={book} expanded={expanded === book.id} onExpand={() => setExpanded(expanded === book.id ? null : book.id)} onStatusChange={updateStatus} onDelete={deleteBook} />
          ))}
        </div>
      )}
    </div>
  )
}

function BookCard({ book, expanded, onExpand, onStatusChange, onDelete }: {
  book: Book
  expanded: boolean
  onExpand: () => void
  onStatusChange: (id: string, status: BookStatus) => void
  onDelete: (id: string) => void
}) {
  const cfg   = STATUS_CONFIG[book.status]
  const color = coverColor(book.title)
  const init  = initials(book.title)

  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${expanded ? cfg.color + '40' : 'var(--border-solid)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s' }}>
      {/* Cover + title */}
      <div style={{ display: 'flex', gap: 14, padding: '16px 16px 12px', cursor: 'pointer' }} onClick={onExpand}>
        {/* Colour cover */}
        <div style={{ width: 52, height: 70, borderRadius: 4, background: `linear-gradient(135deg, ${color}60, ${color}30)`, border: `2px solid ${color}40`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color, opacity: 0.8 }}>{init}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {book.title}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>{book.author}</div>
          {book.rating && (
            <div style={{ marginTop: 6, fontSize: 11, color: '#FCD34D' }}>{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</div>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, borderRadius: 4, padding: '3px 8px' }}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-solid)', paddingTop: 14 }}>
          {book.quote && (
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.7, borderLeft: `2px solid ${color}`, paddingLeft: 12, margin: '0 0 14px 0', opacity: 0.85 }}>
              "{book.quote}"
            </blockquote>
          )}
          {book.notes && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>{book.notes}</p>
          )}
          {/* Quick status change */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {(Object.keys(STATUS_CONFIG) as BookStatus[]).filter(s => s !== book.status).map(s => (
              <button key={s} onClick={() => onStatusChange(book.id, s)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', border: `1px solid ${STATUS_CONFIG[s].color}40`, background: 'transparent', color: STATUS_CONFIG[s].color }}>
                → {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <button onClick={() => onDelete(book.id)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.6 }}>Remove</button>
        </div>
      )}
    </div>
  )
}
