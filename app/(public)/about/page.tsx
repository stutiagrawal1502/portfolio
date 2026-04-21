import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About · Stuti Agrawal',
  description: 'Consultant at EY — Risk Advisory, Internal Controls, Audit. Poet. Athlete. Mumbai.',
}

const experience = [
  {
    role: 'Consultant',
    company: 'EY',
    period: 'Sep 2025 – Present',
    duration: '8 months',
    accent: 'var(--dawn-blue)',
    accentBg: 'rgba(37,99,235,0.05)',
    points: [
      'Delivering solutions in risk advisory, internal controls, and audit to help organisations strengthen their processes.',
      'Turning complex problems into structured, actionable solutions.',
      'Building client relationships based on trust and collaboration.',
    ],
  },
  {
    role: 'Associate Consultant',
    company: 'EY',
    period: 'Oct 2024 – Sep 2025',
    duration: '1 year',
    accent: 'var(--dawn-blue)',
    accentBg: 'rgba(37,99,235,0.03)',
    points: [
      'Internal Audit (IA), IFC VM and marketing audits for a major client.',
      'Hands-on experience with SAP to perform audit testing.',
      'Evaluating financial data, identifying inefficiencies, ensuring regulatory adherence.',
    ],
  },
  {
    role: 'Senior Analyst',
    company: 'EY',
    period: 'Jul 2023 – Oct 2024',
    duration: '1 yr 4 months',
    accent: 'var(--garden-green)',
    accentBg: 'rgba(16,185,129,0.04)',
    points: [
      'End-to-end asset management for a banking client across five locations.',
      'Automated key aspects of the asset disposal process — reduced manual effort significantly.',
      'Created SOPs and handled lost and damaged asset cases.',
      'Data analysis in Excel; customised dashboards in Alteryx; weekly client presentations.',
    ],
  },
  {
    role: 'Internship Trainee',
    company: 'EY',
    period: 'Mar 2023 – Jun 2023',
    duration: '4 months',
    accent: 'var(--poem-gold)',
    accentBg: 'rgba(217,119,6,0.04)',
    points: [
      'SOP formation for clients, aligned to SEBI regulatory frameworks.',
      'Thorough research and document review for compliance and operational efficiency.',
      'Cross-functional team collaboration on process documentation.',
    ],
  },
]

const skills = [
  { name: 'Internal Audits', color: 'var(--dawn-blue)' },
  { name: 'Business Analysis', color: 'var(--dawn-blue)' },
  { name: 'Asset Management', color: 'var(--garden-green)' },
  { name: 'Risk Advisory', color: 'var(--dawn-blue)' },
  { name: 'Internal Controls', color: 'var(--dawn-blue)' },
  { name: 'SAP', color: 'var(--muted)' },
  { name: 'Alteryx', color: 'var(--muted)' },
  { name: 'SOP Design', color: 'var(--garden-green)' },
  { name: 'SEBI Regulations', color: 'var(--muted)' },
  { name: 'Process Audit', color: 'var(--dawn-blue)' },
]

const education = [
  {
    school: 'Shri Ramdeobaba College of Engineering and Management',
    degree: 'Bachelor of Engineering — Electrical Engineering',
    period: '2019 – 2023',
  },
  {
    school: 'Maharishi Vidya Mandir Senior Secondary School',
    degree: 'SSC (XII)',
    period: '2017 – 2018',
  },
  {
    school: 'Maharishi Vidya Mandir Senior Secondary School',
    degree: 'SSC (X)',
    period: '2015 – 2016',
  },
]

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--paper)', padding: '0 0 120px' }}>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border-solid)', marginBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px 72px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>

            {/* Left — text */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dawn-blue)', display: 'inline-block' }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  EY · Mumbai
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                marginBottom: 20,
              }}>
                Stuti<br />
                <span style={{ color: 'rgba(10,10,15,0.35)', fontStyle: 'italic', fontWeight: 400 }}>Agrawal</span>
              </h1>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 17,
                color: 'var(--muted)',
                lineHeight: 1.6,
                maxWidth: 480,
                marginBottom: 32,
              }}>
                Consultant at EY — driving risk management, internal controls, and business
                transformation. 3+ years auditing the gap between what organisations say they
                do and what they actually do.
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['EY Risk Advisory', 'Internal Controls', 'Process Audit', 'Big 4', 'Mumbai'].map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: 'var(--muted)',
                    border: '1px solid var(--border-solid)',
                    padding: '4px 10px',
                    letterSpacing: '0.04em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — photo */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 220,
                height: 260,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Image
                  src="/stuti.jpg"
                  alt="Stuti Agrawal"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  priority
                />
              </div>
              {/* Decorative border offset */}
              <div style={{
                position: 'absolute',
                top: 12,
                left: 12,
                right: -12,
                bottom: -12,
                border: '1px solid var(--border-solid)',
                zIndex: -1,
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

        {/* ── EXPERIENCE ─────────────────────────────────────────────── */}
        <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: '1px solid var(--border-solid)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>

            {/* Label column */}
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Experience
              </span>
              <div style={{ marginTop: 16 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>3+</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>years at EY</p>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ display: 'flex', gap: 0, position: 'relative', paddingBottom: i < experience.length - 1 ? 48 : 0 }}>

                  {/* Connector line */}
                  {i < experience.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 20,
                      bottom: 0,
                      width: 1,
                      background: 'var(--border-solid)',
                    }} />
                  )}

                  {/* Dot */}
                  <div style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: exp.accent,
                    flexShrink: 0,
                    marginTop: 6,
                    marginRight: 28,
                    position: 'relative',
                    zIndex: 1,
                  }} />

                  {/* Content */}
                  <div style={{
                    flex: 1,
                    padding: '20px 24px',
                    background: exp.accentBg,
                    borderLeft: `3px solid ${exp.accent}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
                          {exp.role}
                        </h3>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: exp.accent, marginTop: 2, letterSpacing: '0.04em' }}>
                          {exp.company}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>{exp.period}</p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', opacity: 0.6, marginTop: 2 }}>{exp.duration}</p>
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: exp.accent, flexShrink: 0, marginTop: 2, fontSize: 10 }}>▸</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
                            {pt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS ─────────────────────────────────────────────────── */}
        <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: '1px solid var(--border-solid)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Skills
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skills.map(skill => (
                <span key={skill.name} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  padding: '6px 14px',
                  border: `1px solid ${skill.color === 'var(--muted)' ? 'var(--border-solid)' : skill.color}`,
                  color: skill.color,
                  letterSpacing: '0.04em',
                  background: skill.color === 'var(--dawn-blue)' ? 'rgba(37,99,235,0.04)' : skill.color === 'var(--garden-green)' ? 'rgba(16,185,129,0.04)' : 'transparent',
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCATION ──────────────────────────────────────────────── */}
        <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: '1px solid var(--border-solid)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Education
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: i < education.length - 1 ? 32 : 0, borderBottom: i < education.length - 1 ? '1px solid var(--border-solid)' : 'none' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 4 }}>
                      {edu.school}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)' }}>
                      {edu.degree}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', flexShrink: 0, paddingTop: 3 }}>
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BEYOND WORK ────────────────────────────────────────────── */}
        <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: '1px solid var(--border-solid)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Beyond work
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                {
                  icon: '✦',
                  label: 'Poet',
                  desc: 'Write when the world gets too loud. Playfair italic, white space, nothing else.',
                  href: '/poems',
                  color: 'var(--poem-gold)',
                },
                {
                  icon: '◈',
                  label: 'Athlete',
                  desc: 'Badminton, running, learning to swim. Shows up even when she doesn\'t want to.',
                  href: '/sports',
                  color: 'var(--dawn-rose)',
                },
                {
                  icon: '⬡',
                  label: '180-Day Journey',
                  desc: '5am garden, come rain or audit season. Building in public.',
                  href: '/fitness',
                  color: 'var(--garden-green)',
                },
                {
                  icon: '◇',
                  label: 'CSR',
                  desc: 'EY Ripples — financial literacy, mentorship, pro-bono audit. Giving before being ready.',
                  href: '/csr',
                  color: 'var(--dawn-blue)',
                },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '24px',
                    border: '1px solid var(--border-solid)',
                    background: 'var(--surface)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    cursor: 'pointer',
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: item.color, marginBottom: 10 }}>
                      {item.icon}
                    </div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>
                      {item.label}
                    </h4>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONNECT ────────────────────────────────────────────────── */}
        <section id="connect" style={{ paddingTop: 72 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64 }}>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Connect
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 20, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 40, maxWidth: 440 }}>
                I&apos;m not hard to find. I&apos;m not easy to know. Start here.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Link
                  href="https://www.linkedin.com/in/stuti-agrawal-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', width: 80 }}>LinkedIn</span>
                  <span style={{ width: 32, height: 1, background: 'var(--border-solid)', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--dawn-blue)', fontWeight: 500 }}>
                    Stuti Agrawal ↗
                  </span>
                </Link>
                <Link
                  href="mailto:stutiagrawal1402@gmail.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', width: 80 }}>Email</span>
                  <span style={{ width: 32, height: 1, background: 'var(--border-solid)', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--muted)', fontWeight: 400 }}>
                    stutiagrawal1402@gmail.com →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
