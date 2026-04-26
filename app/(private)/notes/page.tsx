'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Note {
  id: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function extractTags(content: string): string[] {
  const matches = content.match(/#(\w+)/g)
  return matches ? [...new Set(matches.map(m => m.slice(1).toLowerCase()))] : []
}

function firstLine(content: string): string {
  return content.split('\n')[0].replace(/#\w+/g, '').trim() || 'Empty note'
}

export default function NotesPage() {
  const [notes, setNotes]       = useState<Note[]>([])
  const [loading, setLoading]   = useState(true)
  const [draft, setDraft]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [editing, setEditing]   = useState(false)
  const [editContent, setEditContent] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [search, setSearch]     = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort()

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/notes')
    if (res.ok) setNotes(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus()
  }, [])

  const saveNote = async () => {
    if (!draft.trim()) return
    setSaving(true)
    const tags = extractTags(draft)
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft.trim(), tags }),
    })
    if (res.ok) {
      const created = await res.json()
      setNotes(n => [created, ...n])
      setDraft('')
    }
    setSaving(false)
  }

  const handleDraftKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      saveNote()
    }
  }

  const startEdit = (note: Note) => {
    setActiveNote(note)
    setEditContent(note.content)
    setEditing(true)
  }

  const saveEdit = async () => {
    if (!activeNote) return
    setSaving(true)
    const tags = extractTags(editContent)
    const res = await fetch('/api/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: activeNote.id, content: editContent.trim(), tags }),
    })
    if (res.ok) {
      const updated = await res.json()
      setNotes(n => n.map(x => x.id === activeNote.id ? { ...x, ...updated } : x))
      setEditing(false)
      setActiveNote(null)
    }
    setSaving(false)
  }

  const deleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return
    await fetch('/api/notes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setNotes(n => n.filter(x => x.id !== id))
    if (activeNote?.id === id) { setActiveNote(null); setEditing(false) }
  }

  const filtered = notes.filter(n => {
    const matchTag    = !tagFilter || n.tags.includes(tagFilter)
    const matchSearch = !search || n.content.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Brain dump
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
          Notes
        </h1>
      </div>

      {/* Quick capture */}
      <div className="cockpit-card" style={{ marginBottom: 24 }}>
        <span className="cockpit-label">Capture</span>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleDraftKeyDown}
          placeholder="What's on your mind? Use #tags to organize…"
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--paper)', border: '1px solid var(--border-solid)',
            borderRadius: 8, padding: '12px 14px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6,
            color: 'var(--ink)', outline: 'none', resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
            ⌘↵ to save · #tags auto-extracted
          </span>
          <button
            onClick={saveNote}
            disabled={saving || !draft.trim()}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
              background: draft.trim() ? '#C4B5FD' : 'var(--border-solid)',
              color: '#0F0E0C', border: 'none', borderRadius: 7, padding: '8px 20px',
              cursor: !draft.trim() ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tag filters + search */}
      {(allTags.length > 0 || notes.length > 3) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => setTagFilter(null)}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '5px 11px', borderRadius: 5, cursor: 'pointer',
              border: `1px solid ${!tagFilter ? 'var(--ink)' : 'var(--border-solid)'}`,
              background: !tagFilter ? 'var(--ink)' : 'transparent',
              color: !tagFilter ? 'var(--paper)' : 'var(--muted)',
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'lowercase',
                padding: '5px 11px', borderRadius: 5, cursor: 'pointer',
                border: `1px solid ${tagFilter === tag ? '#C4B5FD' : '#C4B5FD40'}`,
                background: tagFilter === tag ? '#C4B5FD20' : 'transparent',
                color: tagFilter === tag ? '#C4B5FD' : 'var(--muted)',
              }}
            >
              #{tag}
            </button>
          ))}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              marginLeft: 'auto',
              fontFamily: "'DM Mono', monospace", fontSize: 12,
              background: 'var(--paper)', border: '1px solid var(--border-solid)',
              borderRadius: 6, padding: '6px 12px', color: 'var(--ink)', outline: 'none', width: 160,
            }}
          />
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', padding: '24px 0' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)', marginBottom: 12 }}>✦</div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>No notes yet. Start typing above.</p>
        </div>
      ) : editing && activeNote ? (
        /* Edit mode — full note editor */
        <div className="cockpit-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="cockpit-label" style={{ margin: 0 }}>Editing note</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setEditing(false); setActiveNote(null) }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'none', border: '1px solid var(--border-solid)', borderRadius: 5, padding: '5px 12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: '#0F0E0C', background: '#C4B5FD', border: 'none', borderRadius: 5, padding: '5px 14px', cursor: 'pointer' }}>Save</button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            autoFocus
            rows={12}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--paper)', border: '1px solid var(--border-solid)',
              borderRadius: 8, padding: '12px 14px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7,
              color: 'var(--ink)', outline: 'none', resize: 'vertical',
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(note => (
            <div
              key={note.id}
              style={{
                padding: '14px 18px',
                background: 'var(--surface)', border: '1px solid var(--border-solid)',
                borderRadius: 8, cursor: 'pointer', transition: 'border-color 0.12s',
              }}
              onClick={() => startEdit(note)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {firstLine(note.content)}
                  </div>
                  {note.content.includes('\n') && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {note.content.split('\n').slice(1).join(' ').replace(/#\w+/g, '').trim()}
                    </div>
                  )}
                  {note.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {note.tags.map(tag => (
                        <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#C4B5FD', background: '#C4B5FD15', border: '1px solid #C4B5FD30', borderRadius: 4, padding: '2px 7px' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>{timeAgo(note.updatedAt)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', opacity: 0.5 }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
