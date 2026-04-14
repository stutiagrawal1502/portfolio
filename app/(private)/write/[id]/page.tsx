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
  }, [title, content, type, mood, tags, loaded])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm animate-pulse" style={{ color: 'var(--muted)' }}>
          Loading...
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Top bar */}
      <div
        className="sticky top-14 z-40 flex items-center gap-3 px-6 py-3 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <select
          value={type}
          onChange={e => setType(e.target.value as PostType)}
          className="font-mono text-xs bg-transparent border border-border rounded-sm px-2 py-1 focus:outline-none"
          style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}
        >
          {postTypes.map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={e => setStatus(e.target.value as PostStatus)}
          className="font-mono text-xs bg-transparent border border-border rounded-sm px-2 py-1 focus:outline-none"
          style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <Toggle checked={poemMode} onChange={setPoemMode} label="Poem mode" size="sm" />

        <div className="flex-1" />

        {lastSaved && (
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {saving ? 'Saving...' : `Saved ${lastSaved}`}
          </span>
        )}

        <button
          onClick={() => save()}
          className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border rounded-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          Save
        </button>

        <button
          onClick={() => save(true)}
          className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-sm"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          Publish
        </button>
      </div>

      {/* Editor */}
      <div className={`flex-1 max-w-3xl mx-auto w-full px-6 py-10 ${poemMode ? 'text-center' : ''}`}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-display font-normal text-ink placeholder-border focus:outline-none mb-6"
          style={{
            fontSize: poemMode ? '2rem' : '2.5rem',
            textAlign: poemMode ? 'center' : 'left',
          }}
        />
        <div
          className="w-8 h-px mb-8"
          style={{
            background: 'var(--border)',
            margin: poemMode ? '0 auto 2rem' : '0 0 2rem',
          }}
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={poemMode ? 'Begin...' : 'Start writing...'}
          className="w-full bg-transparent focus:outline-none resize-none"
          style={{
            fontFamily: poemMode ? "'Playfair Display', serif" : "'DM Sans', sans-serif",
            fontStyle: poemMode ? 'italic' : 'normal',
            fontSize: poemMode ? '19px' : '18px',
            lineHeight: poemMode ? 2 : 1.8,
            color: 'var(--ink)',
            textAlign: poemMode ? 'center' : 'left',
            minHeight: '400px',
          }}
          rows={20}
        />
        <div className="mt-10 pt-6 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
          <input
            type="text"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="Mood"
            className="w-full bg-transparent font-mono text-sm border-b pb-2 focus:outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          />
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full bg-transparent font-mono text-sm border-b pb-2 focus:outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          />
        </div>
      </div>

      <div className="fixed bottom-6 right-6 font-mono text-xs" style={{ color: 'var(--muted)' }}>
        {wordCount} words
      </div>
    </div>
  )
}
