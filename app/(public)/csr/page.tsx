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
  },
  {
    name: 'EY Ripples — Mentorship Programme',
    impact: '12',
    impactLabel: 'first-generation professionals mentored',
    description:
      'One-on-one mentorship for students navigating their first corporate roles. Resume building, interview preparation, the unwritten rules no one tells you.',
    year: '2024–2025',
  },
  {
    name: 'Community Audit Support',
    impact: '3',
    impactLabel: 'NGOs supported',
    description:
      'Pro-bono internal controls review for small NGOs. Helped them document processes that kept donors confident and operations clean.',
    year: '2024',
  },
]

export default function CSRPage() {
  return (
    <main style={{ padding: '40px 24px 96px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-ink mb-6">
            CSR & Community
          </h1>
          <p className="font-display italic text-xl text-muted leading-relaxed max-w-xl">
            This is not separate from who I am. I give before I'm ready because waiting
            to be ready is another way of never starting.
          </p>
        </div>

        {/* EY Ripples mention */}
        <div className="mb-12 p-6 border border-garden-green/30 bg-garden-green/5 rounded-sm">
          <p className="font-mono text-xs text-garden-green tracking-widest uppercase mb-2">
            EY Ripples
          </p>
          <p className="font-sans text-ink leading-relaxed">
            EY Ripples is EY's global CSR programme, focused on creating a better working
            world by improving the lives of one billion people by 2030. I participate through
            skills-based volunteering — bringing the audit and finance skills I use at work
            to communities that need them.
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-8">
          <h2 className="font-mono text-xs tracking-widest uppercase text-muted">
            Projects
          </h2>

          {projects.map((project, i) => (
            <div key={i} className="dawn-card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-display text-xl font-normal text-ink">
                  {project.name}
                </h3>
                <span className="font-mono text-xs text-muted flex-shrink-0">
                  {project.year}
                </span>
              </div>

              {/* Impact number — prominent */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-4xl font-light text-garden-green">
                  {project.impact}
                </span>
                <span className="font-mono text-sm text-muted">
                  {project.impactLabel}
                </span>
              </div>

              <p className="font-sans text-muted text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-display italic text-lg text-muted">
            There is more to come. I'm always looking for the next way to make
            the skills I have mean something outside of a spreadsheet.
          </p>
        </div>
      </div>
    </main>
  )
}
