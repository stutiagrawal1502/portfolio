'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DawnBackground } from '@/components/home/DawnBackground'
import { TheToggle } from '@/components/home/TheToggle'
import { WorkMode } from '@/components/home/WorkMode'
import { LifeMode } from '@/components/home/LifeMode'
import Link from 'next/link'

type Mode = 'work' | 'life'

const TICKER_ITEMS = [
  'EY Risk Advisory', 'Internal Controls', 'Poet', '5AM Garden',
  'Badminton', '180-Day Journey', 'Mumbai', 'Building in Public',
  'CSR', 'Process Audit', 'Playfair Italic', 'Athlete', 'Big 4',
]

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('work')
  const [dayNumber, setDayNumber] = useState<number | undefined>()

  useEffect(() => {
    fetch('/api/journey')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.dayNumber) setDayNumber(d.dayNumber) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--hero-bg)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <DawnBackground />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 48px', paddingTop: 100 }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dawn-rose)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,248,244,0.42)' }}>
              Consultant · Poet · Athlete
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(4.5rem, 11vw, 9rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: '#F8F4EE',
              marginBottom: 36,
            }}
          >
            Stuti
            <br />
            <span style={{ color: 'rgba(248,244,238,0.45)', fontWeight: 400, fontStyle: 'italic' }}>Agrawal</span>
          </motion.h1>

          {/* Descriptor */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${mode}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'rgba(248,244,238,0.46)', fontWeight: 400, lineHeight: 1.6, maxWidth: 420, marginBottom: 48 }}
            >
              {mode === 'work'
                ? 'EY Risk Advisory & Internal Controls · 3 years · Mumbai'
                : 'Poet · Athlete · 180-day journey · Figuring it out in public'}
            </motion.p>
          </AnimatePresence>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TheToggle onChange={setMode} />
          </motion.div>
        </div>

        {/* Bottom-left scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{ position: 'absolute', bottom: 36, left: 48, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ width: 1, height: 44, background: 'rgba(248,244,238,0.14)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.22)' }}>
            Scroll
          </span>
        </motion.div>

        {/* Bottom-right — day counter if journey active */}
        {dayNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            style={{ position: 'absolute', bottom: 36, right: 48, textAlign: 'right' }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(248,244,238,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Journey</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: 'rgba(134, 239, 172, 0.7)', lineHeight: 1 }}>
              {dayNumber}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(248,244,238,0.25)', marginLeft: 2 }}>/180</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── MARQUEE TICKER ───────────────────────────────────────────── */}
      <div style={{ background: 'var(--ink)', overflow: 'hidden', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.5)', whiteSpace: 'nowrap' }}>
                {item}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--dawn-rose)', opacity: 0.6, flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── MODE CONTENT ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--paper)' }}>

        {/* Mode indicator strip */}
        <div style={{
          borderBottom: '1px solid var(--border-solid)',
          background: 'var(--paper)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', height: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: mode === 'work' ? 'var(--dawn-blue)' : 'var(--garden-green)',
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {mode === 'work' ? 'Professional mode' : 'Personal mode'}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={`mode-${mode}`}
            style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {mode === 'work' ? <WorkMode /> : <LifeMode dayNumber={dayNumber} />}
          </motion.section>
        </AnimatePresence>

        {/* ── WRITING STRIP ─────────────────────────────────────────── */}
        <LatestWriting />

        {/* ── FOOTER STRIP ──────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--border-solid)', padding: '32px 48px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: 'var(--muted)', fontStyle: 'italic' }}>
              Stuti Agrawal
            </span>
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { href: '/about', label: 'About' },
                { href: '/expressions', label: 'Writing' },
                { href: '/poems', label: 'Poems' },
                { href: '/fitness', label: 'Journey' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

/* ── Latest Writing ──────────────────────────────────────────────────────── */
function LatestWriting() {
  const [posts, setPosts] = useState<{
    id: string; title: string; slug: string
    type: string; mood?: string | null; excerpt?: string | null
  }[]>([])

  useEffect(() => {
    fetch('/api/posts?status=PUBLISHED&limit=3')
      .then(r => r.ok ? r.json() : [])
      .then(setPosts).catch(() => {})
  }, [])

  if (!posts.length) return null

  const typeColor: Record<string, string> = {
    POEM: '#92400E', BLOG: '#1D4ED8', JOURNAL: '#4B5563',
    ESSAY: '#5B21B6', CSR: '#065F46', SPORTS: '#B91C1C', FITNESS_REFLECTION: '#065F46',
  }
  const typeBg: Record<string, string> = {
    POEM: '#FEF3C7', BLOG: '#DBEAFE', JOURNAL: '#F3F4F6',
    ESSAY: '#EDE9FE', CSR: '#D1FAE5', SPORTS: '#FEE2E2', FITNESS_REFLECTION: '#D1FAE5',
  }

  return (
    <section style={{ borderTop: '1px solid var(--border-solid)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <span className="section-eyebrow">Writing</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>
              Latest expressions
            </h2>
          </div>
          <Link href="/expressions" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {posts.map((post, i) => (
            <Link key={post.id} href={`/expressions/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="card" style={{
                cursor: 'pointer',
                borderTop: `3px solid ${typeBg[post.type] ?? '#F3F4F6'}`,
              }}>
                <span style={{
                  display: 'inline-block',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 4,
                  background: typeBg[post.type] ?? '#F3F4F6',
                  color: typeColor[post.type] ?? '#4B5563',
                  marginBottom: 14,
                }}>
                  {post.type.replace('_', ' ').toLowerCase()}
                </span>

                {/* Large ordinal */}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--border-solid)', marginBottom: 8, letterSpacing: '0.06em' }}>
                  0{i + 1}
                </div>

                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 10 }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                )}
                {post.mood && (
                  <span className="mood-tag" style={{ marginTop: 14, display: 'inline-block' }}>{post.mood}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
