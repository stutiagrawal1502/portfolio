'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Toggle } from '@/components/ui/Toggle'

type PostType = 'BLOG' | 'POEM' | 'JOURNAL' | 'ESSAY' | 'CSR' | 'SPORTS' | 'FITNESS_REFLECTION'
type PostStatus = 'DRAFT' | 'PUBLISHED'

const postTypes: PostType[] = ['BLOG', 'POEM', 'JOURNAL', 'ESSAY', 'CSR', 'SPORTS', 'FITNESS_REFLECTION']

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<PostType>('JOURNAL')
  const [status, setStatus] = useState<PostStatus>('DRAFT')
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState('')
  const [poemMode, setPoemMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')
  const [loaded, setLoaded] = useState(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    fetch(`/api/posts?id=${id}`)
      .then(r => r.json())
      .then((posts: { title: string; content: string; type: PostType; status: PostStatus; mood?: string | null; tags?: string[] }[]) => {
        const post = posts[0]
        if (post) {
          setTitle(post.title)
          setContent(post.content)
          setType(post.type)
          setStatus(post.status as PostStatus)
          setMood(post.mood ?? '')
          setTags((post.tags ?? []).join(', '))
          if (post.type === 'POEM') setPoemMode(true)
          setLoaded(true)
        }
      })
      .catch(() => setLoaded(true))
  }, [id])

  const save = async (publish = false) => {
    setSaving(true)
    try {
      await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: title || 'Untitled',
          content,
          type,
          status: publish ? 'PUBLISHED' : status,
          mood: mood || null,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      setLastSaved(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!loaded) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => save(), 3000)
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, type, mood, tags, loaded])

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)' }}>
          Loading...
        </span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky',
        top: 56,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-solid)',
        background: 'var(--surface)',
      }}>
        <select
          value={type}
          onChange={e => setType(e.target.value as PostType)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            background: 'transparent',
            border: '1px solid var(--border-solid)',
            borderRadius: 4,
            padding: '4px 8px',
            color: 'var(--ink)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {postTypes.map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={e => setStatus(e.target.value as PostStatus)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            background: 'transparent',
            border: '1px solid var(--border-solid)',
            borderRadius: 4,
            padding: '4px 8px',
            color: 'var(--ink)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <Toggle checked={poemMode} onChange={setPoemMode} label="Poem mode" size="sm" />

        <div style={{ flex: 1 }} />

        {lastSaved && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            {saving ? 'Saving...' : `Saved ${lastSaved}`}
          </span>
        )}

        <button
          onClick={() => save()}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            border: '1px solid var(--border-solid)',
            borderRadius: 4,
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          Save
        </button>

        <button
          onClick={() => save(true)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: 4,
            border: 'none',
            background: 'var(--ink)',
            color: 'var(--paper)',
            cursor: 'pointer',
          }}
        >
          Publish
        </button>
      </div>

      {/* Editor */}
      <div style={{
        flex: 1,
        maxWidth: 720,
        margin: '0 auto',
        width: '100%',
        padding: '48px 24px',
        textAlign: poemMode ? 'center' : 'left',
      }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: 'var(--ink)',
            fontSize: poemMode ? '1.875rem' : '2.5rem',
            textAlign: poemMode ? 'center' : 'left',
            marginBottom: 24,
          }}
        />

        <div style={{
          width: 32,
          height: 1,
          background: 'var(--border-solid)',
          marginBottom: 32,
          marginLeft: poemMode ? 'auto' : 0,
          marginRight: poemMode ? 'auto' : 0,
        }} />

        <textarea
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
            fontSize: poemMode ? 19 : 18,
            lineHeight: poemMode ? 2 : 1.8,
            color: 'var(--ink)',
            textAlign: poemMode ? 'center' : 'left',
            minHeight: 400,
          }}
          rows={20}
        />

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-solid)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="Mood (e.g. quiet and awake)"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-solid)',
              outline: 'none',
              paddingBottom: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: 'var(--muted)',
            }}
          />
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-solid)',
              outline: 'none',
              paddingBottom: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: 'var(--muted)',
            }}
          />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 24, right: 24, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
        {wordCount} words
      </div>
    </div>
  )
}
