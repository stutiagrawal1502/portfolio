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
    <main className="min-h-screen pt-28 pb-32 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl font-normal text-ink mb-3">
            Stuti Agrawal
          </h1>
          <p className="font-mono text-sm text-muted tracking-wide">
            Consultant · Poet · Athlete · Figuring it out.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {sections.map(section => (
            <section key={section.number} className="flex gap-8">
              {/* Chapter number */}
              <div className="font-mono text-sm text-muted w-8 flex-shrink-0 pt-1">
                [{section.number}]
              </div>

              <div className="flex-1">
                <h2 className="font-display text-2xl font-normal text-ink mb-4">
                  {section.title}
                </h2>

                {section.number === '06' ? (
                  <div className="space-y-3">
                    <p className="font-sans text-muted leading-relaxed mb-6">
                      I'm not hard to find. I'm not easy to know. Start here.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Link
                        href="https://linkedin.com/in/stutiagrawal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-dawn-blue hover:underline flex items-center gap-2"
                      >
                        <span className="text-muted">↗</span> LinkedIn
                      </Link>
                      <Link
                        href="https://instagram.com/stutiagrawal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-dawn-rose hover:underline flex items-center gap-2"
                      >
                        <span className="text-muted">↗</span> Instagram
                      </Link>
                      <Link
                        href="mailto:stutiagrawal1402@gmail.com"
                        className="font-mono text-sm text-muted hover:text-ink transition-colors flex items-center gap-2"
                      >
                        <span className="text-muted">→</span> stutiagrawal1402@gmail.com
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="prose-dawn">
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">
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
