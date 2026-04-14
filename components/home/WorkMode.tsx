import Link from 'next/link'
import { DawnCard } from '@/components/ui/DawnCard'

export function WorkMode() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'auto auto',
        }}
      >
        {/* Featured — spans full width */}
        <div className="col-span-2">
          <DawnCard
            href="/about"
            title="EY Risk Advisory & Internal Controls"
            subtitle="3 years advising organisations on governance, risk frameworks, and audit processes. Currently in Mumbai."
            badge="EY Consultant"
            badgeClass="type-badge-blog"
          >
            <div className="mt-4 flex gap-4">
              <span className="font-mono text-xs text-muted">Risk Advisory</span>
              <span className="font-mono text-xs text-muted">Internal Controls</span>
              <span className="font-mono text-xs text-muted">Process Audit</span>
            </div>
          </DawnCard>
        </div>

        {/* Row 2 left */}
        <DawnCard
          href="/expressions?type=BLOG"
          title="Professional Writing"
          subtitle="Essays on work, growth, and what three years in consulting teaches you about yourself."
          badge="Blog"
          badgeClass="type-badge-blog"
        />

        {/* Row 2 right — no href so it renders as div, avoiding nested <a> */}
        <DawnCard
          title="Let's Connect"
          subtitle="Open to conversations about risk, consulting careers, and building in public."
          badge="Connect"
          badgeClass="type-badge-journal"
        >
          <div className="mt-4 flex gap-3">
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dawn-blue hover:underline"
            >
              LinkedIn →
            </Link>
            <Link
              href="/about#connect"
              className="font-mono text-xs hover:underline"
              style={{ color: 'var(--muted)' }}
            >
              About →
            </Link>
          </div>
        </DawnCard>
      </div>
    </div>
  )
}
