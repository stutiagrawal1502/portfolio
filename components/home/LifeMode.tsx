import { DawnCard } from '@/components/ui/DawnCard'

interface LifeModeProps {
  dayNumber?: number
}

export function LifeMode({ dayNumber }: LifeModeProps) {
  return (
    <div>
      {/* Section header */}
      <div style={{ marginBottom: 40 }}>
        <span className="section-eyebrow">Personal</span>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
          }}
        >
          The life side
        </h2>
      </div>

      {/* 7 + 5 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 16,
        }}
      >
        {/* Journey featured — 7 cols */}
        <div style={{ gridColumn: 'span 12' }} className="md:col-span-7">
          <DawnCard
            href="/fitness"
            title={dayNumber ? `Day ${dayNumber} of the 180-day journey` : 'The 180-day journey'}
            subtitle="Starting from imperfect. Showing up anyway. Garden at 5am, come rain or audit season. This is what building in public actually looks like."
            badge="Journey"
            badgeClass="type-badge-fitness"
            featured
            className="card-accent-green"
          >
            {dayNumber && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                    }}
                  >
                    Progress
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--ink)',
                    }}
                  >
                    {Math.round((dayNumber / 180) * 100)}%
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, (dayNumber / 180) * 100)}%`,
                      background: 'var(--garden-green)',
                    }}
                  />
                </div>
              </div>
            )}
            <div
              style={{
                marginTop: 24,
                paddingTop: 24,
                borderTop: '1px solid var(--border-solid)',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {[
                { value: dayNumber ?? '—', label: 'Day' },
                { value: '180', label: 'Goal' },
                { value: '5AM', label: 'Garden' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  {i > 0 && (
                    <div
                      style={{
                        width: 1,
                        height: 32,
                        background: 'var(--border-solid)',
                        marginRight: -8,
                      }}
                    />
                  )}
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        marginTop: 4,
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DawnCard>
        </div>

        {/* Right column — 5 cols */}
        <div
          style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: 16 }}
          className="md:col-span-5"
        >
          <DawnCard
            href="/poems"
            title="The Poems"
            subtitle="Written when the world gets too loud. Playfair italic, white space, nothing else."
            badge="Poem"
            badgeClass="type-badge-poem"
          />
          <DawnCard
            href="/csr"
            title="EY Ripples & CSR"
            subtitle="Giving before being ready. Stories from community work done in and around the job."
            badge="CSR"
            badgeClass="type-badge-csr"
          />
          <DawnCard
            href="/sports"
            title="Sport"
            subtitle="The athlete who shows up even when she doesn't want to. Badminton, running, learning to swim."
            badge="Sports"
            badgeClass="type-badge-sports"
          />
        </div>
      </div>
    </div>
  )
}
