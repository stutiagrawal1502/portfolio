import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sports · Stuti Agrawal',
  description: "The athlete who shows up even when she doesn't want to.",
}

const sportsPlayed = [
  { name: 'Badminton', status: 'Active', color: 'var(--dawn-rose)', abbr: 'BAD' },
  { name: 'Running', status: 'In Progress', color: 'var(--garden-green)', abbr: 'RUN' },
  { name: 'Swimming', status: 'Learning', color: 'var(--dawn-blue)', abbr: 'SWM' },
  { name: 'Yoga', status: 'Consistent', color: 'var(--poem-gold)', abbr: 'YOG' },
]

const timeline = [
  {
    year: 'School',
    note: "District-level badminton. The first time sport felt like identity, not exercise.",
  },
  {
    year: '2020',
    note: "Everything stopped. Rediscovered what it means to move just to move, not to compete.",
  },
  {
    year: '2022',
    note: "Started running. Hated it. Kept going. That's the whole story.",
  },
  {
    year: '2024',
    note: "Added swimming. Humbling in the best way. Starting from zero again.",
  },
  {
    year: '2026',
    note: "180 days of showing up. Garden at 5am. This is the chapter in progress.",
    current: true,
  },
]

export default function SportsPage() {
  return (
    <main style={{ background: 'var(--paper)', padding: '80px 24px 120px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dawn-rose)', display: 'inline-block' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Athlete · Movement
          </span>
        </div>

        {/* Pull quote */}
        <blockquote style={{
          marginBottom: 72,
          paddingLeft: 28,
          borderLeft: '4px solid var(--poem-gold)',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            color: 'var(--ink)',
            lineHeight: 1.45,
            margin: 0,
          }}>
            &ldquo;Sport is the one place where I am not expected to explain myself.
            The game is the explanation.&rdquo;
          </p>
        </blockquote>

        {/* Sport orbs */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 28 }}>
            What I play
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {sportsPlayed.map(sport => (
              <div key={sport.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: sport.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}>
                  {sport.abbr}
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                  {sport.name}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: sport.color,
                }}>
                  {sport.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-solid)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>The arc</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-solid)' }} />
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {timeline.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 32, position: 'relative', paddingBottom: i < timeline.length - 1 ? 40 : 0 }}>
              {/* Vertical connector */}
              {i < timeline.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: 39,
                  top: 24,
                  bottom: 0,
                  width: 1,
                  background: 'var(--border-solid)',
                }} />
              )}

              {/* Year pill */}
              <div style={{ flexShrink: 0, width: 80, paddingTop: 2 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: item.current ? 'var(--dawn-rose)' : 'var(--muted)',
                  fontWeight: item.current ? 600 : 400,
                  letterSpacing: '0.06em',
                }}>
                  {item.year}
                </span>
              </div>

              {/* Dot */}
              <div style={{ flexShrink: 0, width: 10, height: 10, borderRadius: '50%', background: item.current ? 'var(--dawn-rose)' : 'var(--border-solid)', marginTop: 5, position: 'relative', zIndex: 1 }} />

              {/* Note */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: item.current ? 'var(--ink)' : 'var(--muted)',
                  lineHeight: 1.65,
                }}>
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid var(--border-solid)' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', lineHeight: 1.7 }}>
            I don&apos;t chase personal bests. I chase showing up. That&apos;s the sport I&apos;m really playing.
          </p>
        </div>

      </div>
    </main>
  )
}
