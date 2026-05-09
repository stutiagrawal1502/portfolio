'use client'

import { useState } from 'react'
import Link from 'next/link'

type FinanceType = 'INCOME' | 'EXPENSE'
type FinanceCategory = 'FOOD' | 'TRANSPORT' | 'EMI' | 'SAVINGS' | 'HEALTH' | 'UTILITIES' | 'PERSONAL' | 'WORK' | 'SALARY' | 'FREELANCE' | 'OTHER'

const QUICK_CATS: { cat: FinanceCategory; label: string; type: FinanceType }[] = [
  { cat: 'FOOD',      label: '🍱 Food',     type: 'EXPENSE' },
  { cat: 'TRANSPORT', label: '🚆 Travel',   type: 'EXPENSE' },
  { cat: 'PERSONAL',  label: '🛍 Personal', type: 'EXPENSE' },
  { cat: 'HEALTH',    label: '💊 Health',   type: 'EXPENSE' },
  { cat: 'SAVINGS',   label: '💰 Savings',  type: 'EXPENSE' },
  { cat: 'OTHER',     label: '📌 Other',    type: 'EXPENSE' },
]

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export function QuickFinance() {
  const [amount,   setAmount]   = useState('')
  const [note,     setNote]     = useState('')
  const [selected, setSelected] = useState<(typeof QUICK_CATS)[0] | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState<number | null>(null)

  const save = async () => {
    const amt = parseFloat(amount)
    if (!amt || !selected) return
    setSaving(true)
    const res = await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString(),
        type: selected.type,
        amount: amt,
        category: selected.cat,
        note: note || null,
        isRecurring: false,
      }),
    })
    if (res.ok) {
      setSaved(amt)
      setAmount(''); setNote(''); setSelected(null)
      setTimeout(() => setSaved(null), 3000)
    }
    setSaving(false)
  }

  const inputBase: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--paper)', border: '1px solid var(--border-solid)',
    borderRadius: 6, padding: '8px 10px', color: 'var(--ink)', outline: 'none',
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Quick Expense
        </p>
        <Link href="/finance" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
          Finance →
        </Link>
      </div>

      {saved !== null ? (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#86EFAC', padding: '8px 0' }}>
          ✓ Logged {formatINR(saved)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {QUICK_CATS.map(c => (
              <button
                key={c.cat}
                onClick={() => setSelected(selected?.cat === c.cat ? null : c)}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  padding: '4px 9px', borderRadius: 20,
                  border: `1px solid ${selected?.cat === c.cat ? '#FCA5A5' : 'var(--border-solid)'}`,
                  background: selected?.cat === c.cat ? '#FCA5A515' : 'transparent',
                  color: selected?.cat === c.cat ? '#FCA5A5' : 'var(--muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Amount — full width */}
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save() }}
            placeholder="₹ Amount"
            style={{ ...inputBase, fontFamily: "'DM Mono', monospace", fontSize: 14 }}
          />

          {/* Note + Log button */}
          <div style={{ display: 'flex', gap: 8, minWidth: 0 }}>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save() }}
              placeholder="Note (optional)"
              style={{ ...inputBase, flex: 1, minWidth: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
            />
            <button
              onClick={save}
              disabled={saving || !amount || !selected}
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: !amount || !selected ? 'var(--border-solid)' : '#FCA5A5',
                border: 'none', borderRadius: 6, padding: '8px 12px',
                color: '#0F0E0C', flexShrink: 0,
                cursor: !amount || !selected ? 'not-allowed' : 'pointer',
                fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              {saving ? '…' : 'Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
