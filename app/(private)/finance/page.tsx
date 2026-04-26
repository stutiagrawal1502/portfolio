'use client'

import { useState, useEffect, useCallback } from 'react'

type FinanceType = 'INCOME' | 'EXPENSE'
type FinanceCategory =
  | 'FOOD' | 'TRANSPORT' | 'EMI' | 'SAVINGS' | 'HEALTH'
  | 'UTILITIES' | 'PERSONAL' | 'WORK' | 'SALARY' | 'FREELANCE' | 'OTHER'

interface Entry {
  id: string
  date: string
  type: FinanceType
  amount: number
  category: FinanceCategory
  note: string | null
  isRecurring: boolean
}

const CATEGORIES: FinanceCategory[] = [
  'SALARY', 'FREELANCE', 'FOOD', 'TRANSPORT', 'EMI',
  'SAVINGS', 'HEALTH', 'UTILITIES', 'PERSONAL', 'WORK', 'OTHER',
]

const CAT_COLORS: Record<FinanceCategory, string> = {
  SALARY:     '#86EFAC',
  FREELANCE:  '#6EE7B7',
  FOOD:       '#FCA5A5',
  TRANSPORT:  '#FCD34D',
  EMI:        '#F9A8D4',
  SAVINGS:    '#93C5FD',
  HEALTH:     '#C4B5FD',
  UTILITIES:  '#FED7AA',
  PERSONAL:   '#F9A8D4',
  WORK:       '#93C5FD',
  OTHER:      'var(--muted)',
}

const CAT_LABELS: Record<FinanceCategory, string> = {
  SALARY: 'Salary', FREELANCE: 'Freelance', FOOD: 'Food',
  TRANSPORT: 'Transport', EMI: 'EMI / Loan', SAVINGS: 'Savings',
  HEALTH: 'Health', UTILITIES: 'Bills', PERSONAL: 'Personal',
  WORK: 'Work', OTHER: 'Other',
}

function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function FinancePage() {
  const now = new Date()
  const [month, setMonth] = useState(getMonthKey(now))
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formType, setFormType] = useState<FinanceType>('EXPENSE')
  const [formAmount, setFormAmount] = useState('')
  const [formCategory, setFormCategory] = useState<FinanceCategory>('FOOD')
  const [formNote, setFormNote] = useState('')
  const [formDate, setFormDate] = useState(now.toISOString().split('T')[0])
  const [formRecurring, setFormRecurring] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/finance?month=${month}`)
      .then(r => r.ok ? r.json() : [])
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [month])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!formAmount || isNaN(parseFloat(formAmount))) return
    setSaving(true)
    await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: formDate,
        type: formType,
        amount: parseFloat(formAmount),
        category: formCategory,
        note: formNote || null,
        isRecurring: formRecurring,
      }),
    })
    setSaving(false)
    setFormAmount('')
    setFormNote('')
    setShowForm(false)
    load()
  }

  const remove = async (id: string) => {
    await fetch('/api/finance', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setEntries(es => es.filter(e => e.id !== id))
  }

  // Computed stats
  const totalIncome = entries.filter(e => e.type === 'INCOME').reduce((s, e) => s + e.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'EXPENSE').reduce((s, e) => s + e.amount, 0)
  const savings = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

  // Category breakdown (expenses only)
  const byCat: Record<string, number> = {}
  entries.filter(e => e.type === 'EXPENSE').forEach(e => {
    byCat[e.category] = (byCat[e.category] ?? 0) + e.amount
  })
  const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const maxCat = sortedCats[0]?.[1] ?? 1

  // Month navigation
  const prevMonth = () => {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    setMonth(getMonthKey(d))
  }
  const nextMonth = () => {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m, 1)
    setMonth(getMonthKey(d))
  }

  const monthLabel = new Date(month + '-15').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Finance
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            Money Tracker
          </h1>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            background: showForm ? 'var(--border-solid)' : '#86EFAC',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            color: showForm ? 'var(--muted)' : '#0F0E0C',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Entry'}
        </button>
      </div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '6px 12px', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>←</button>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', letterSpacing: '0.06em' }}>{monthLabel}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '6px 12px', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>→</button>
      </div>

      {/* Add entry form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 16 }}>New entry</span>

          {/* Income / Expense toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['EXPENSE', 'INCOME'] as FinanceType[]).map(t => (
              <button
                key={t}
                onClick={() => {
                  setFormType(t)
                  setFormCategory(t === 'INCOME' ? 'SALARY' : 'FOOD')
                }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: formType === t
                    ? (t === 'INCOME' ? '#86EFAC' : '#FCA5A5')
                    : 'var(--border-solid)',
                  color: formType === t ? '#0F0E0C' : 'var(--muted)',
                  fontWeight: formType === t ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {t === 'EXPENSE' ? '↑ Expense' : '↓ Income'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {/* Amount */}
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Amount (₹)</label>
              <input
                type="number"
                value={formAmount}
                onChange={e => setFormAmount(e.target.value)}
                placeholder="0"
                style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '10px 12px', fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {/* Date */}
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Date</label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '10px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {/* Category */}
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value as FinanceCategory)}
                style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '10px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                {CATEGORIES
                  .filter(c => formType === 'INCOME' ? ['SALARY','FREELANCE','OTHER'].includes(c) : !['SALARY','FREELANCE'].includes(c))
                  .map(c => (
                    <option key={c} value={c}>{CAT_LABELS[c]}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Note + recurring */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={formNote}
              onChange={e => setFormNote(e.target.value)}
              placeholder="Note (optional)"
              style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', outline: 'none' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={formRecurring}
                onChange={e => setFormRecurring(e.target.checked)}
                style={{ accentColor: '#93C5FD' }}
              />
              Recurring
            </label>
          </div>

          <button
            onClick={save}
            disabled={saving || !formAmount}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: '#86EFAC',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              color: '#0F0E0C',
              cursor: 'pointer',
              fontWeight: 600,
              opacity: saving || !formAmount ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Income',   value: formatINR(totalIncome),  color: '#86EFAC' },
          { label: 'Spent',    value: formatINR(totalExpense),  color: '#FCA5A5' },
          { label: 'Saved',    value: formatINR(savings),       color: savings >= 0 ? '#93C5FD' : '#FCA5A5' },
          { label: 'Save rate', value: `${savingsRate}%`,       color: savingsRate >= 20 ? '#86EFAC' : savingsRate >= 10 ? '#FCD34D' : '#FCA5A5' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: s.color, letterSpacing: '-0.01em', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Category breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 16 }}>Breakdown</span>
          {sortedCats.length === 0 ? (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>No expenses this month.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sortedCats.map(([cat, amount]) => (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>{CAT_LABELS[cat as FinanceCategory]}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)' }}>{formatINR(amount)}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border-solid)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(amount / maxCat) * 100}%`, background: CAT_COLORS[cat as FinanceCategory] ?? '#93C5FD', borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction list */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 16 }}>Transactions</span>
          {loading ? (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>Loading...</p>
          ) : entries.length === 0 ? (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>No entries yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 360, overflowY: 'auto' }}>
              {entries.map(e => (
                <div
                  key={e.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-solid)' }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.type === 'INCOME' ? '#86EFAC' : '#FCA5A5', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.note ?? CAT_LABELS[e.category]}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
                      {CAT_LABELS[e.category]} · {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {e.isRecurring && ' · ↻'}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: e.type === 'INCOME' ? '#86EFAC' : '#FCA5A5', fontWeight: 500, flexShrink: 0 }}>
                    {e.type === 'INCOME' ? '+' : '-'}{formatINR(e.amount)}
                  </div>
                  <button
                    onClick={() => remove(e.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, padding: '0 4px', opacity: 0.5, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
