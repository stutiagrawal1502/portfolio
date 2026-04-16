'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type PostType = 'BLOG' | 'POEM' | 'JOURNAL' | 'ESSAY' | 'CSR' | 'SPORTS' | 'FITNESS_REFLECTION'
type PostStatus = 'DRAFT' | 'PUBLISHED'

const postTypes: PostType[] = ['BLOG', 'POEM', 'JOURNAL', 'ESSAY', 'CSR', 'SPORTS', 'FITNESS_REFLECTION']

const typeAccents: Record<PostType, string> = {
  BLOG:               '#93C5FD',
  POEM:               '#FCD34D',
  JOURNAL:            '#86EFAC',
  ESSAY:              '#C4B5FD',
  CSR:                '#6EE7B7',
  SPORTS:             '#FCA5A5',
  FITNESS_REFLECTION: '#6EE7B7',
}

export default function WritePage() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const contentRef  = useRef<HTMLTextAreaElement>(null)

  const initialType = (searchParams.get('type') as PostType | null)
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [type,     setType]     = useState<PostType>(
    initialType && postTypes.includes(initialType) ? initialType : 'JOURNAL'
  )
  const [status,   setStatus]   = useState<PostStatus>('DRAFT')
  const [mood,     setMood]     = useState('')
  const [tags,     setTags]     = useState('')
  const [poemMode, setPoemMode] = useState(false)
  const [postId,   setPostId]   = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [lastSaved, setLastSaved] = useState('')
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const accent = typeAccents[type]

  const save = async (publish = false) => {
    setSaving(true)
    const payload = {
      title: title || 'Untitled',
      content,
      type,
      status: publish ? 'PUBLISHED' : status,
      mood: mood || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    try {
      if (postId) {
        await fetch('/api/posts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: postId, ...payload }),
        })
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const post = await res.json()
        setPostId(post.id)
        router.replace(`/write/${post.id}`)
      }
      setLastSaved(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!title && !content) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => save(), 3000)
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current) }
  }, [title, content, type, mood, tags])

  useEffect(() => {
    if (poemMode) setType('POEM')
  }, [poemMode])

  // Auto-expand textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto'
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px'
    }
  }, [content])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top: 52,
        zIndex: 40,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-solid)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 24px',
        height: 48,
      }}>
        {/* Type accent dot */}
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />

        {/* Type select */}
        <select
          value={type}
          onChange={e => setType(e.target.value as PostType)}
          className="write-select"
        >
          {postTypes.map(t => (
            <option key={t} value={t}>{t.replace('_', ' ').toLowerCase()}</option>
          ))}
        </select>

        {/* Status select */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value as PostStatus)}
          className="write-select"
        >
          <option value="DRAFT">draft</option>
          <option value="PUBLISHED">published</option>
        </select>

        {/* Poem mode toggle */}
        <button
          onClick={() => setPoemMode(p => !p)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            background: poemMode ? '#FCD34D18' : 'transparent',
            border: `1px solid ${poemMode ? '#FCD34D50' : 'var(--border-solid)'}`,
            borderRadius: 6,
            padding: '5px 10px',
            color: poemMode ? '#FCD34D' : 'var(--muted)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          ✦ Poem
        </button>

        <div style={{ flex: 1 }} />

        {/* Save status */}
        {(saving || lastSaved) && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
            {saving ? 'saving...' : `saved ${lastSaved}`}
          </span>
        )}

        {/* Save button */}
        <button
          onClick={() => save()}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            background: 'transparent',
            border: '1px solid var(--border-solid)',
            borderRadius: 6,
            padding: '5px 14px',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          Save
        </button>

        {/* Publish button */}
        <button
          onClick={() => save(true)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            background: accent,
            border: 'none',
            borderRadius: 6,
            padding: '6px 14px',
            color: '#0F0E0C',
            cursor: 'pointer',
          }}
        >
          Publish
        </button>
      </div>

      {/* ── Editor ────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        maxWidth: poemMode ? 560 : 760,
        margin: '0 auto',
        width: '100%',
        padding: '48px 32px 96px',
        textAlign: poemMode ? 'center' : 'left',
      }}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'Playfair Display', serif",
            fontSize: poemMode ? '2rem' : '2.75rem',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.2,
            marginBottom: 24,
            textAlign: poemMode ? 'center' : 'left',
          }}
        />

        {/* Separator */}
        <div style={{
          width: 32,
          height: 2,
          background: accent,
          borderRadius: 1,
          marginBottom: 32,
          opacity: 0.6,
          marginLeft: poemMode ? 'auto' : 0,
          marginRight: poemMode ? 'auto' : 0,
        }} />

        {/* Body */}
        <textarea
          ref={contentRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={poemMode ? 'Begin...' : 'Start writing...'}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: poemMode ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
            fontStyle: poemMode ? 'italic' : 'normal',
            fontSize: poemMode ? '19px' : '18px',
            lineHeight: poemMode ? 2.2 : 1.9,
            color: 'var(--ink)',
            caretColor: accent,
            textAlign: poemMode ? 'center' : 'left',
            minHeight: 400,
            overflow: 'hidden',
          }}
          rows={20}
        />

        {/* Meta fields */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border-solid)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="Mood when writing (e.g. quiet and awake)"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-solid)',
              outline: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: 'var(--muted)',
              padding: '8px 0',
              width: '100%',
            }}
          />
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags — comma separated"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-solid)',
              outline: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: 'var(--muted)',
              padding: '8px 0',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* ── Word count ────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 24,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: 'var(--muted)',
        background: 'var(--surface)',
        border: '1px solid var(--border-solid)',
        borderRadius: 20,
        padding: '4px 12px',
      }}>
        {wordCount} words
      </div>
    </div>
  )
}
