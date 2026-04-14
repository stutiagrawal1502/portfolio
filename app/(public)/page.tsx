'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DawnBackground } from '@/components/home/DawnBackground'
import { TheToggle } from '@/components/home/TheToggle'
import { WorkMode } from '@/components/home/WorkMode'
import { LifeMode } from '@/components/home/LifeMode'
import { TypedText } from '@/components/ui/TypedText'
import Link from 'next/link'

type Mode = 'work' | 'life'

const subtitles: Record<Mode, string> = {
  work: 'Consultant, EY · Risk Advisory · Internal Controls',
  life: 'Poet. Athlete. Figuring it out.',
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('work')
  const [phase, setPhase] = useState(0)
  const [dayNumber, setDayNumber] = useState<number | undefined>()

  // Staggered animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)   // name
    const t2 = setTimeout(() => setPhase(2), 500)   // subtitle
    const t3 = setTimeout(() => setPhase(3), 900)   // toggle
    const t4 = setTimeout(() => setPhase(4), 1200)  // cards
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // Fetch journey day number for LifeMode card
  useEffect(() => {
    fetch('/api/journey')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.dayNumber) setDayNumber(data.dayNumber)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <DawnBackground />

      {/* Hero section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-12 gap-8">

        {/* Name */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.h1
              key="name"
              className="font-display text-5xl md:text-7xl font-normal text-ink leading-none"
              style={{ textShadow: '0 2px 20px rgba(247,243,238,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Stuti Agrawal
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Typed subtitle */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              key="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-6 flex items-center"
            >
              <TypedText
                text={subtitles[mode]}
                speed={35}
                className="text-sm md:text-base text-ink/80"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key="toggle"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <TheToggle onChange={setMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Content grid */}
      <AnimatePresence mode="wait">
        {phase >= 4 && (
          <motion.section
            key={`mode-${mode}`}
            className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {mode === 'work' ? (
              <WorkMode />
            ) : (
              <LifeMode dayNumber={dayNumber} />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Day counter bar — always visible */}
      {phase >= 4 && dayNumber && (
        <motion.div
          className="relative z-10 w-full border-t border-border/30"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Link href="/fitness" className="block hover:bg-surface/50 transition-colors">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
              <span className="font-mono text-xs tracking-widest uppercase text-muted">
                Journey
              </span>
              <span className="font-mono text-sm text-ink">
                Day {dayNumber}
              </span>
              <div className="flex-1 progress-bar-track" style={{ maxWidth: 200 }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, (dayNumber / 180) * 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs text-muted">
                {dayNumber}/180
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Latest expressions — always visible */}
      {phase >= 4 && (
        <motion.section
          className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs tracking-widest uppercase text-muted">
              Latest Expressions
            </span>
            <Link
              href="/expressions"
              className="font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              All →
            </Link>
          </div>
          <LatestExpressions />
        </motion.section>
      )}
    </main>
  )
}

// Server-side latest posts fetched via a small client component
function LatestExpressions() {
  const [posts, setPosts] = useState<{ id: string; title: string; slug: string; type: string; mood?: string | null }[]>([])

  useEffect(() => {
    fetch('/api/posts?status=PUBLISHED&limit=2')
      .then(r => r.ok ? r.json() : [])
      .then(setPosts)
      .catch(() => {})
  }, [])

  if (!posts.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link
            href={`/expressions/${post.slug}`}
            className="block dawn-card hover:no-underline group"
          >
            <span className={`type-badge type-badge-${post.type.toLowerCase().replace('_reflection', '')} mb-2 block w-fit`}>
              {post.type.replace('_', ' ')}
            </span>
            <h4 className="font-display text-lg font-normal text-ink group-hover:underline underline-offset-2 leading-snug">
              {post.title}
            </h4>
            {post.mood && <span className="mood-tag mt-2 inline-block">{post.mood}</span>}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
