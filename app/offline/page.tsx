export default function OfflinePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 48, marginBottom: 28, opacity: 0.3 }}>◌</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 16 }}>
          You're offline.
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 40 }}>
          No connection right now. The things you've already written are still with you — they always will be.
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.5 }}>
          Come back when you're back online.
        </p>
      </div>
    </main>
  )
}
