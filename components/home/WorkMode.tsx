import Link from 'next/link'
import { DawnCard } from '@/components/ui/DawnCard'

export function WorkMode() {
  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <span className="section-eyebrow">Professional</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>
            The work side
          </h2>
        </div>
        <Link href="/about" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none' }}>
          Full profile →
        </Link>
      </div>

      {/* Fixed grid — inline styles only, no Tailwind */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 16 }}>

        {/* Featured EY card */}
        <DawnCard
          href="/about"
          title="EY Risk Advisory & Internal Controls"
          subtitle="Three years advising organisations on governance, risk frameworks, and audit processes. I work with the gap between what companies say they do and what they actually do."
          badge="EY Consultant"
          badgeClass="type-badge-blog"
          featured
          className="card-accent-blue"
        >
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Risk Advisory', 'Internal Controls', 'Process Audit'].map(tag => (
              <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#EFF6FF', color: 'var(--dawn-blue)', letterSpacing: '0.04em' }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-solid)', display: 'flex', alignItems: 'center', gap: 0 }}>
            {[
              { value: '3+', label: 'Years' },
              { value: 'EY', label: 'Big 4' },
              { value: 'MUM', label: 'Mumbai' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: 1, height: 32, background: 'var(--border-solid)', margin: '0 24px' }} />}
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: 4 }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </DawnCard>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DawnCard
            href="/expressions?type=BLOG"
            title="Professional Writing"
            subtitle="Essays on work, growth, and what three years in consulting actually teaches you."
            badge="Blog"
            badgeClass="type-badge-blog"
          />

          <DawnCard
            title="Let's Connect"
            subtitle="Open to conversations about risk, consulting careers, and building in public."
            badge="Connect"
            badgeClass="type-badge-journal"
          >
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link
                href="https://linkedin.com/in/stutiagrawal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, background: '#EFF6FF', color: 'var(--dawn-blue)', textDecoration: 'none' }}
              >
                LinkedIn ↗
              </Link>
              <Link href="/about#connect" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
                About me →
              </Link>
            </div>
          </DawnCard>
        </div>
      </div>
    </div>
  )
}
