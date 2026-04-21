import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSR & EY Ripples · Stuti Agrawal',
  description: 'Giving before being ready. Stories from community work.',
}

const projects = [
  {
    name: 'EY Ripples — Financial Literacy Drive',
    impact: '200+',
    impactLabel: 'students reached',
    description:
      'Led a workshop series on personal finance basics for underserved students in Mumbai. Practical skills: budgeting, savings, understanding how banks work.',
    year: '2025',
    accentColor: 'var(--garden-green)',
    accentBg: 'rgba(16, 185, 129, 0.06)',
  },
  {
    name: 'EY Ripples — Mentorship Programme',
    impact: '12',
    impactLabel: 'first-generation professionals mentored',
    description:
      'One-on-one mentorship for students navigating their first corporate roles. Resume building, interview preparation, the unwritten rules no one tells you.',
    year: '2024–2025',
    accentColor: 'var(--dawn-blue)',
    accentBg: 'rgba(37, 99, 235, 0.06)',
  },
  {
    name: 'Community Audit Support',
    impact: '3',
    impactLabel: 'NGOs supported pro-bono',
    description:
      'Pro-bono internal controls review for small NGOs. Helped them document processes that kept donors confident and operations clean.',
    year: '2024',
    accentColor: 'var(--poem-gold)',
    accentBg: 'rgba(217, 119, 6, 0.06)',
  },
]

export default function CSRPage() {
  return (
    <main style={{ background: 'var(--paper)', padding: '80px 24px 120px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--garden-green)', display: 'inline-block' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Community · EY Ripples
          </span>
        </div>

        {/* Header */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.05,
          marginBottom: 32,
        }}>
          CSR &<br />
          <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Community</span>
        </h1>

        {/* Opening statement */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 20,
          color: 'var(--muted)',
          lineHeight: 1.7,
          maxWidth: 560,
          marginBottom: 64,
        }}>
          This is not separate from who I am. I give before I&apos;m ready because
          waiting to be ready is another way of never starting.
        </p>

        {/* EY Ripples context card */}
        <div style={{
          marginBottom: 64,
          padding: '28px 32px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderLeft: '4px solid var(--garden-green)',
          background: 'rgba(16, 185, 129, 0.04)',
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--garden-green)', marginBottom: 12 }}>
            EY Ripples
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--ink)', lineHeight: 1.7 }}>
            EY Ripples is EY&apos;s global CSR programme, focused on creating a better working
            world by improving the lives of one billion people by 2030. I participate through
            skills-based volunteering — bringing the audit and finance skills I use at work
            to communities that need them.
          </p>
        </div>

        {/* Section label */}
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 32 }}>
          Projects
        </div>

        {/* Project cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {projects.map((project, i) => (
            <div
              key={i}
              style={{
                padding: '32px',
                border: '1px solid var(--border-solid)',
                borderLeft: `4px solid ${project.accentColor}`,
                background: project.accentBg,
                transition: 'transform 0.2s ease',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3 }}>
                  {project.name}
                </h3>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', flexShrink: 0, paddingTop: 3 }}>
                  {project.year}
                </span>
              </div>

              {/* Impact number */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                  fontWeight: 300,
                  color: project.accentColor,
                  lineHeight: 1,
                }}>
                  {project.impact}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                  {project.impactLabel}
                </span>
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                {project.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid var(--border-solid)' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', lineHeight: 1.7 }}>
            There is more to come. I&apos;m always looking for the next way to make
            the skills I have mean something outside of a spreadsheet.
          </p>
        </div>

      </div>
    </main>
  )
}
