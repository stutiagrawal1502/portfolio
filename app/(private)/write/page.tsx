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

const typeLabels: Record<PostType, string> = {
  BLOG:               'Blog',
  POEM:               'Poem',
  JOURNAL:            'Journal',
  ESSAY:              'Essay',
  CSR:                'CSR',
  SPORTS:             'Sports',
  FITNESS_REFLECTION: 'Fitness',
}

const JOURNAL_PROMPTS = [
  "What's weighing on you today that you haven't said out loud yet?",
  "What did today teach you that yesterday couldn't?",
  "What are you avoiding, and why?",
  "If you could redo one thing from this week, what would it be?",
  "What does success look like for you right now — honestly?",
  "Who do you want to become by the end of this 180-day journey?",
  "What is your body telling you that your mind keeps ignoring?",
  "What would you do if you knew no one was watching?",
  "What's one thing you're grateful for that you rarely acknowledge?",
  "What needs to change, and what's stopping you from changing it?",
]

const POEM_FORMS = ['Free Verse', 'Haiku', 'Ghazal', 'Sonnet', 'Prose Poem']
const BLOG_PILLARS = ['Risk & Audit', 'Career Growth', 'Consulting Life', 'Building in Public', 'Women at Work']
const ESSAY_PILLARS = ['Observation', 'Reflection', 'Analysis', 'Personal Essay', 'Letter']

export default function WritePage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const contentRef   = useRef<HTMLTextAreaElement>(null)

  const initialType = (searchParams.get('type') as PostType | null)
  const [title,    setTitle]   = useState('')
  const [content,  setContent] = useState('')
  const [type,     setType]    = useState<PostType>(
    initialType && postTypes.includes(initialType) ? initialType : 'JOURNAL'
  )
  const [status,   setStatus]  = useState<PostStatus>('DRAFT')
  const [mood,     setMood]    = useState('')
  const [tags,     setTags]    = useState('')
  const [excerpt,  setExcerpt] = useState('')
  const [pillar,   setPillar]  = useState('')
  const [poemMode, setPoemMode] = useState(type === 'POEM')
  const [postId,   setPostId]  = useState<string | null>(null)
  const [saving,   setSaving]  = useState(false)
  const [lastSaved, setLastSaved] = useState('')
  const [prompt,   setPrompt]  = useState('')
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const accent    = typeAccents[type]

  // Random journal prompt
  useEffect(() => {
    if (type === 'JOURNAL') {
      setPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)])
    }
  }, [type])

  // Sync poem mode with type
  useEffect(() => {
    if (type === 'POEM') setPoemMode(true)
    else if (poemMode) setPoemMode(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (poemMode && type !== 'POEM') setType('POEM')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemMode])

  // Auto-expand textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto'
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px'
    }
  }, [content])

  const save = async (publish = false) => {
    setSaving(true)
    const payload = {
      title: title || 'Untitled',
      content,
      type,
      status: publish ? 'PUBLISHED' : status,
      mood: mood || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt: excerpt || null,
      pillar: pillar || null,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, type, mood, tags, excerpt, pillar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 52, zIndex: 40, background: 'var(--surface)', borderBottom: '1px solid var(--border-solid)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px', height: 48 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />

        {/* Type pill buttons */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {postTypes.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 5,
                border: 'none',
                cursor: 'pointer',
                background: type === t ? typeAccents[t] : 'transparent',
                color: type === t ? '#0F0E0C' : 'var(--muted)',
                fontWeight: type === t ? 600 : 400,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border-solid)', flexShrink: 0 }} />

        {/* Status */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value as PostStatus)}
          className="write-select"
        >
          <option value="DRAFT">draft</option>
          <option value="PUBLISHED">published</option>
        </select>

        <div style={{ flex: 1 }} />

        {(saving || lastSaved) && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
            {saving ? 'saving...' : `saved ${lastSaved}`}
          </span>
        )}

        <button onClick={() => save()} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '5px 14px', color: 'var(--muted)', cursor: 'pointer' }}>
          Save
        </button>
        <button onClick={() => save(true)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', background: accent, border: 'none', borderRadius: 6, padding: '6px 14px', color: '#0F0E0C', cursor: 'pointer' }}>
          Publish
        </button>
      </div>

      {/* ── Editor ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: poemMode ? 560 : 780, margin: '0 auto', width: '100%', padding: '48px 32px 96px', textAlign: poemMode ? 'center' : 'left' }}>

        {/* Journal: show prompt before title */}
        {type === 'JOURNAL' && prompt && (
          <div style={{
            marginBottom: 32,
            padding: '14px 20px',
            borderLeft: `3px solid ${accent}`,
            background: 'rgba(134,239,172,0.06)',
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Today&apos;s prompt</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              {prompt}
            </p>
          </div>
        )}

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={
            type === 'POEM'    ? 'Title of the poem'         :
            type === 'JOURNAL' ? 'Entry title (or leave blank)' :
            type === 'FITNESS_REFLECTION' ? 'Reflection title' :
            'Untitled'
          }
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Playfair Display', serif", fontSize: poemMode ? '2rem' : '2.75rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 24, textAlign: poemMode ? 'center' : 'left' }}
        />

        {/* Accent separator */}
        <div style={{ width: 32, height: 2, background: accent, borderRadius: 1, marginBottom: 32, opacity: 0.6, marginLeft: poemMode ? 'auto' : 0, marginRight: poemMode ? 'auto' : 0 }} />

        {/* Body */}
        <textarea
          ref={contentRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={
            type === 'POEM'               ? 'Begin...'                           :
            type === 'JOURNAL'            ? 'Write freely. No one is reading.'   :
            type === 'FITNESS_REFLECTION' ? 'How did it feel today...'            :
            type === 'CSR'                ? 'Tell the story...'                  :
            'Start writing...'
          }
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: poemMode ? "'Playfair Display', serif" : "'DM Sans', sans-serif", fontStyle: poemMode ? 'italic' : 'normal', fontSize: poemMode ? '19px' : '18px', lineHeight: poemMode ? 2.2 : 1.9, color: 'var(--ink)', caretColor: accent, textAlign: poemMode ? 'center' : 'left', minHeight: 400, overflow: 'hidden' }}
          rows={20}
        />

        {/* ── Type-specific fields ───────────────────────────────── */}
        <div style={{ marginTop: 40, paddingTop: 28, borderTop: `2px solid ${accent}22` }}>

          {/* POEM: form + inspiration */}
          {type === 'POEM' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Poem form</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {POEM_FORMS.map(f => (
                  <button
                    key={f}
                    onClick={() => setPillar(pillar === f ? '' : f)}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, padding: '6px 14px', borderRadius: 20, border: `1px solid ${pillar === f ? '#FCD34D' : 'var(--border-solid)'}`, background: pillar === f ? '#FCD34D15' : 'transparent', color: pillar === f ? '#FCD34D' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BLOG: excerpt + pillar */}
          {(type === 'BLOG' || type === 'ESSAY') && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                {type === 'BLOG' ? 'Excerpt / teaser' : 'Abstract'}
              </div>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder={type === 'BLOG' ? 'The one sentence that makes someone want to read this.' : 'The central argument or observation.'}
                rows={2}
                style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', outline: 'none', resize: 'none', lineHeight: 1.6, marginBottom: 16, boxSizing: 'border-box' }}
              />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Pillar</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(type === 'BLOG' ? BLOG_PILLARS : ESSAY_PILLARS).map(p => (
                  <button
                    key={p}
                    onClick={() => setPillar(pillar === p ? '' : p)}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, padding: '6px 14px', borderRadius: 20, border: `1px solid ${pillar === p ? accent : 'var(--border-solid)'}`, background: pillar === p ? `${accent}15` : 'transparent', color: pillar === p ? accent : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FITNESS_REFLECTION: quick stats */}
          {type === 'FITNESS_REFLECTION' && (
            <div style={{ marginBottom: 24, padding: '16px', background: 'rgba(110,231,183,0.06)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 8 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6EE7B7', marginBottom: 12 }}>Log today&apos;s workout details in the Fitness Log, then write your reflection here.</div>
              <a href="/fitness-log" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6EE7B7', textDecoration: 'none' }}>Go to Fitness Log →</a>
            </div>
          )}

          {/* CSR: event context */}
          {type === 'CSR' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Initiative / Event name</div>
              <input
                type="text"
                value={pillar}
                onChange={e => setPillar(e.target.value)}
                placeholder="EY Ripples — Financial Literacy Drive"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-solid)', outline: 'none', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', padding: '8px 0', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* SPORTS: event context */}
          {type === 'SPORTS' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Sport / Event</div>
              <input
                type="text"
                value={pillar}
                onChange={e => setPillar(e.target.value)}
                placeholder="Badminton · Running · Swimming"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-solid)', outline: 'none', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', padding: '8px 0', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* Common meta: mood + tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Mood</div>
              <input
                type="text"
                value={mood}
                onChange={e => setMood(e.target.value)}
                placeholder={type === 'POEM' ? 'quiet and awake' : type === 'JOURNAL' ? 'honest and tired' : 'what are you feeling?'}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-solid)', outline: 'none', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', padding: '8px 0' }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Tags</div>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="comma separated"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-solid)', outline: 'none', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', padding: '8px 0' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Word count */}
      <div style={{ position: 'fixed', bottom: 20, right: 24, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 20, padding: '4px 12px' }}>
        {wordCount} words
      </div>
    </div>
  )
}
