import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About · Stuti Agrawal',
  description: 'Consultant, EY. Poet. Athlete. Figuring it out.',
}

const sections = [
  {
    number: '01',
    title: 'The Professional',
    content: `Three years at EY in Risk Advisory and Internal Controls. I work with organisations
to understand what they say they do versus what they actually do — the gap between documented
processes and lived reality. Internal audit, risk framework design, control testing.

I am not a buzzword consultant. I do the work.`,
  },
  {
    number: '02',
    title: 'The Creative',
    content: `I write poems when the world gets too loud. Not to be a poet, but because sometimes
prose is too spacious and verse is the only container that holds the right amount of pressure.

I also write essays and journals — about work, about fitness, about the ordinary difficulty
of being a woman who has decided to build something in public.`,
  },
  {
    number: '03',
    title: 'The Athlete',
    content: `Sport is non-negotiable for me. Not because I'm particularly good at it but because
I've discovered that without physical movement, I stop thinking clearly. The body is not a
vehicle for the brain. They are one system.

I play badminton. I run. I am learning to swim. I show up to all of these even when I don't
want to, which is most of the time, and that's the point.`,
  },
  {
    number: '04',
    title: 'The Journey',
    content: `In April 2026 I decided to stop waiting to be ready. I have a vitamin D deficiency
I kept meaning to fix. I had fitness habits I kept meaning to build. I had writing I kept
meaning to publish.

This site is where I do those things publicly. Not for accountability — for honesty.
The journey is 180 days of showing up. Some days are better than others. All days count.`,
  },
  {
    number: '05',
    title: 'The Why',
    content: `I'm building this in public because opacity is exhausting. I spent three years
auditing organisations that told beautiful stories about themselves while quietly struggling
with the gap between aspiration and execution. I don't want to be that.

If you are a working woman trying to build a fitness habit at 5am before anyone else is awake,
or a consultant who also writes poetry and can't decide which to be — this site is for you too.`,
  },
  {
    number: '06',
    title: 'Connect',
    content: '',
  },
]

export default function AboutPage() {
  return (
    <main style={{ padding: '40px 24px 96px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Hero header */}
        <div style={{ marginBottom: 64, paddingBottom: 40, borderBottom: '1px solid var(--border-solid)' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 14 }}>
            About
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.08, marginBottom: 20 }}>
            Stuti Agrawal
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            Consultant · Poet · Athlete · Figuring it out.
          </p>

          {/* Quick-bio tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {['EY Risk Advisory', '3 Years', 'Mumbai', 'Internal Controls', 'Building in public'].map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: 'var(--muted)',
                  border: '1px solid var(--border-solid)',
                  borderRadius: 4,
                  padding: '3px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {sections.map(section => (
            <section key={section.number} style={{ display: 'flex', gap: 32 }}>
              {/* Chapter number */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)', width: 36, flexShrink: 0, paddingTop: 4, opacity: 0.6 }}>
                [{section.number}]
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
                  {section.title}
                </h2>

                {section.number === '06' ? (
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                      I&apos;m not hard to find. I&apos;m not easy to know. Start here.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <Link
                        href="https://linkedin.com/in/stutiagrawal"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--dawn-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={{ color: 'var(--muted)' }}>↗</span> LinkedIn
                      </Link>
                      <Link
                        href="https://instagram.com/stutiagrawal"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--dawn-rose)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={{ color: 'var(--muted)' }}>↗</span> Instagram
                      </Link>
                      <Link
                        href="mailto:stutiagrawal1402@gmail.com"
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span>→</span> stutiagrawal1402@gmail.com
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--ink)', lineHeight: 1.85, marginBottom: i < section.content.split('\n\n').length - 1 ? 16 : 0 }}>
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
