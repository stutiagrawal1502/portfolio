import { DawnCard } from '@/components/ui/DawnCard'

interface LifeModeProps {
  dayNumber?: number
  latestPoemTitle?: string
  latestPoemSlug?: string
}

export function LifeMode({ dayNumber, latestPoemTitle, latestPoemSlug }: LifeModeProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'auto auto',
        }}
      >
        {/* Day counter — featured */}
        <div className="col-span-2">
          <DawnCard
            href="/fitness"
            title={dayNumber ? `Day ${dayNumber} of the Journey` : 'The Fitness Journey'}
            subtitle="180 days. Starting from imperfect. Showing up anyway. Garden at 5am, come rain or audit season."
            badge="Fitness"
            badgeClass="type-badge-fitness"
          >
            {dayNumber && (
              <div className="mt-4">
                <div className="progress-bar-track" style={{ maxWidth: 280 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (dayNumber / 180) * 100)}%` }}
                  />
                </div>
                <p className="font-mono text-xs text-muted mt-2">{dayNumber}/180 days</p>
              </div>
            )}
          </DawnCard>
        </div>

        {/* Latest poem */}
        <DawnCard
          href={latestPoemSlug ? `/poems/${latestPoemSlug}` : '/poems'}
          title={latestPoemTitle ?? 'Read the Poems'}
          subtitle="Written when the world gets too loud. Playfair italic, white space, nothing else."
          badge="Poem"
          badgeClass="type-badge-poem"
        />

        {/* CSR + Sports */}
        <div className="flex flex-col gap-4">
          <DawnCard
            href="/csr"
            title="EY Ripples & CSR"
            subtitle="Giving before being ready. Stories from community work."
            badge="CSR"
            badgeClass="type-badge-csr"
            className="flex-1"
          />
          <DawnCard
            href="/sports"
            title="Sport as a Non-Negotiable"
            subtitle="The athlete who shows up even when she doesn't want to."
            badge="Sports"
            badgeClass="type-badge-sports"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
