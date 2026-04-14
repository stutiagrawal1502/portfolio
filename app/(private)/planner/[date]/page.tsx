import Link from 'next/link'

export default async function DayPlannerPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const d = new Date(date)
  const label = d.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/planner"
          className="font-mono text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Planner
        </Link>
        <h1 className="font-display text-3xl font-normal" style={{ color: 'var(--ink)' }}>
          {label}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Content plans */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
            Content
          </h2>
          <div
            className="rounded-sm p-5 border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              No content planned.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                className="font-mono text-xs px-3 py-1.5 border rounded-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                + Post Idea
              </button>
            </div>
          </div>
        </section>

        {/* Fitness */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
            Fitness
          </h2>
          <div
            className="rounded-sm p-5 border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              No workout logged.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
