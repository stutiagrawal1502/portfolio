import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sports · Stuti Agrawal',
  description: 'The athlete who shows up even when she doesn\'t want to.',
}

const sportsPlayed = [
  { name: 'Badminton', status: 'Active', color: 'var(--dawn-rose)' },
  { name: 'Running', status: 'In Progress', color: 'var(--garden-green)' },
  { name: 'Swimming', status: 'Learning', color: 'var(--dawn-blue)' },
  { name: 'Yoga', status: 'Consistent', color: 'var(--poem-gold)' },
]

const timeline = [
  { year: 'School', note: 'District-level badminton. The first time sport felt like identity, not exercise.' },
  { year: '2020', note: 'Everything stopped. Rediscovered what it means to move just to move, not to compete.' },
  { year: '2022', note: 'Started running. Hated it. Kept going. That\'s the whole story.' },
  { year: '2024', note: 'Added swimming. Humbling in the best way. Starting from zero again.' },
  { year: '2026', note: '180 days of showing up. Garden at 5am. This is the chapter in progress.' },
]

export default function SportsPage() {
  return (
    <main className="min-h-screen pt-28 pb-32 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Pull quote */}
        <blockquote className="mb-16 max-w-2xl">
          <p className="font-display italic text-2xl md:text-3xl text-ink leading-relaxed"
             style={{ borderLeft: '4px solid var(--poem-gold)', paddingLeft: '24px' }}>
            "Sport is the one place where I am not expected to explain myself.
            The game is the explanation."
          </p>
        </blockquote>

        {/* Sport badges */}
        <div className="mb-16">
          <h2 className="font-mono text-xs tracking-widest uppercase text-muted mb-6">
            What I play
          </h2>
          <div className="flex flex-wrap gap-4">
            {sportsPlayed.map(sport => (
              <div
                key={sport.name}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-paper font-mono text-xs font-medium"
                  style={{ background: sport.color }}
                >
                  {sport.name.slice(0, 3).toUpperCase()}
                </div>
                <span className="font-mono text-xs text-muted">{sport.name}</span>
                <span
                  className="font-mono text-[10px] tracking-wide uppercase"
                  style={{ color: sport.color }}
                >
                  {sport.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-mono text-xs tracking-widest uppercase text-muted mb-8">
            The arc
          </h2>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="font-mono text-sm text-muted w-16 flex-shrink-0 pt-0.5">
                  {item.year}
                </div>
                <div>
                  <p className="font-sans text-ink leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-display italic text-lg text-muted">
            I don't chase personal bests. I chase showing up. That's the sport I'm really playing.
          </p>
        </div>
      </div>
    </main>
  )
}
