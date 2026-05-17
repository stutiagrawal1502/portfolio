'use client'

import { useState, useEffect } from 'react'

// ── Meal plan data (hardcoded from health recovery PDF) ────────────────────
const WEEK_PLAN: Record<number, {
  focus: string
  phase: string
  phaseColor: string
  wakeUp: string
  breakfast: string
  breakfastTip: string
  snack: string
  snackTip: string
  lunch: string
  lunchTip: string
  afternoon: string
  afternoonTip: string
  dinner: string
  dinnerTip: string
  night: string
  nightTip: string
}> = {
  1: {
    focus: 'UTI treatment + gut support. Bland, easy meals. Probiotics daily. Carry tiffin — do not depend on canteen.',
    phase: 'Antibiotic Week 1',
    phaseColor: '#FCA5A5',
    wakeUp: 'Warm water + 2 soaked anjeer (figs)',
    breakfast: 'Poha (thin, light) with peanuts + nimbu + 1 katori curd',
    breakfastTip: '10 min prep',
    snack: '4 walnuts + 1 tsp moringa in warm water',
    snackTip: 'At desk',
    lunch: '2 chapati + moong dal + palak sabzi + salad (nimbu)',
    lunchTip: 'Office tiffin',
    afternoon: 'Chaas (plain, no sugar)',
    afternoonTip: 'Carry in bottle',
    dinner: 'Khichdi (moong + rice, jeera tadka) + 1 katori curd',
    dinnerTip: '20 min prep',
    night: 'Warm haldi milk (1 glass, no sugar)',
    nightTip: 'Take B12 tablet now',
  },
  2: {
    focus: 'Iron recovery begins. Rajma 3× this week. Nimbu on everything. Check: is nausea improving? If not, tell doctor.',
    phase: 'Antibiotic Week 2',
    phaseColor: '#FCD34D',
    wakeUp: 'Warm water + 1 tsp amla powder in water',
    breakfast: 'Upma (rava) with vegetables + 1 katori curd',
    breakfastTip: '15 min prep',
    snack: '4 walnuts + 1 small apple',
    snackTip: 'Pre-portion at home',
    lunch: '2 chapati + rajma (canned) + sabzi + nimbu salad',
    lunchTip: 'Iron power meal',
    afternoon: '1 cup green tea (no sugar) + 4 almonds',
    afternoonTip: 'Not chai — iron blocker',
    dinner: 'Dal (masoor) + 1–2 chapati + sabzi',
    dinnerTip: '15 min prep',
    night: 'Warm milk',
    nightTip: 'Take B12 tablet',
  },
  3: {
    focus: 'Antibiotic course ends around Day 20. Begin 15-min evening walk. Report any UTI symptoms immediately.',
    phase: 'Transition Week 3',
    phaseColor: '#86EFAC',
    wakeUp: 'Warm water + 1 tsp moringa powder',
    breakfast: 'Besan cheela (2 pieces) + green chutney + curd',
    breakfastTip: '15 min prep',
    snack: '4 walnuts + 5 almonds',
    snackTip: 'At desk',
    lunch: 'Brown rice / multigrain roti + chana masala + raita + nimbu',
    lunchTip: '15 min prep',
    afternoon: 'Chaas + 1 banana',
    afternoonTip: 'Carry chaas in bottle',
    dinner: 'Vegetable soup + 2 chapati + palak paneer',
    dinnerTip: '20 min',
    night: 'Warm haldi milk',
    nightTip: 'Take B12 tablet',
  },
  4: {
    focus: 'Full recovery mode. 30-min walks 5×/week. Consistent B12 + D3. Plan next blood test at 6-week mark.',
    phase: 'Recovery Week 4',
    phaseColor: '#93C5FD',
    wakeUp: 'Warm water + 2 soaked anjeer (soak overnight)',
    breakfast: 'Dalia (broken wheat) upma or porridge with vegetables',
    breakfastTip: 'Gut-healing',
    snack: 'Mixed seeds (til + pumpkin seeds) + 4 walnuts',
    snackTip: 'Pre-portion box',
    lunch: '2 chapati + toor dal + beetroot sabzi + nimbu salad',
    lunchTip: 'Gut-healing',
    afternoon: 'Coconut water (nariyal pani) if available',
    afternoonTip: 'Natural electrolytes',
    dinner: 'Khichdi + sabzi + curd',
    dinnerTip: 'Light',
    night: 'Warm milk',
    nightTip: 'Take B12 tablet',
  },
}

const CHECKLIST_GROUPS = [
  {
    label: 'Morning',
    color: '#FCD34D',
    items: [
      'Warm water on waking',
      'Soaked anjeer / amla / moringa water',
      'Breakfast within 45 min of waking',
      'Pack tiffin with lemon wedge',
      'Pack 1L water bottle',
      'Pack dry fruit box (walnuts + almonds)',
    ],
  },
  {
    label: 'At Office',
    color: '#93C5FD',
    items: [
      '10am water alarm done',
      '10:30am moringa water + walnuts',
      '1pm lunch with lemon on dal',
      '1:30pm curd from tiffin',
      '4pm chaas / green tea',
      'Drink remaining water by 7pm',
    ],
  },
  {
    label: 'Evening & Night',
    color: '#86EFAC',
    items: [
      'Dinner by 8pm',
      'Nitrofurantoin WITH dinner (mid-meal)',
      'Curd / chaas after dinner',
      'Warm haldi milk + B12 tablet by 10pm',
      'Sleep by 10:30–11pm',
      'Soak anjeer for tomorrow morning',
    ],
  },
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function diffDays(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / 86400000)
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isSunday(d: Date) { return d.getDay() === 0 }

export default function RoutinePage() {
  const [day1Str, setDay1Str] = useState<string>('')
  const [editingDay1, setEditingDay1] = useState(false)
  const [tempDay1, setTempDay1] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>({})

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('routine_day1')
    if (stored) setDay1Str(stored)
    const today = todayKey()
    const raw = localStorage.getItem(`routine_checks_${today}`)
    if (raw) setChecks(JSON.parse(raw))
  }, [])

  const saveChecks = (next: Record<string, boolean>) => {
    setChecks(next)
    localStorage.setItem(`routine_checks_${todayKey()}`, JSON.stringify(next))
  }

  const toggleCheck = (key: string) => {
    saveChecks({ ...checks, [key]: !checks[key] })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const day1 = day1Str ? new Date(day1Str) : null
  const dayNumber = day1 ? diffDays(day1, today) + 1 : null
  const weekNum = dayNumber ? Math.ceil(Math.min(dayNumber, 30) / 7) : null
  const plan = weekNum ? WEEK_PLAN[Math.min(weekNum, 4)] : null
  const isAntibioticDay = dayNumber != null && dayNumber >= 1 && dayNumber <= 20
  const isWalkDay = dayNumber != null && dayNumber >= 21
  const isVitDSunday = isSunday(today)
  const planDone = dayNumber != null && dayNumber > 30

  const startEdit = () => {
    setTempDay1(day1Str || todayKey())
    setEditingDay1(true)
  }

  const confirmEdit = () => {
    setDay1Str(tempDay1)
    localStorage.setItem('routine_day1', tempDay1)
    setEditingDay1(false)
  }

  const totalChecked = Object.values(checks).filter(Boolean).length
  const totalItems = CHECKLIST_GROUPS.reduce((s, g) => s + g.items.length, 0)

  const MEALS = plan ? [
    { time: '6:45 am', label: 'Wake-up', food: plan.wakeUp, tip: 'Soak overnight' },
    { time: '8:00 am', label: 'Breakfast', food: plan.breakfast, tip: plan.breakfastTip },
    { time: '10:30 am', label: 'Desk Snack', food: plan.snack, tip: plan.snackTip },
    { time: '1:00 pm', label: 'Lunch', food: plan.lunch, tip: plan.lunchTip },
    { time: '4:00 pm', label: 'Afternoon', food: plan.afternoon, tip: plan.afternoonTip },
    { time: '8:00 pm', label: 'Dinner', food: plan.dinner, tip: plan.dinnerTip },
    { time: '10:00 pm', label: 'Night', food: plan.night, tip: plan.nightTip },
  ] : []

  return (
    <div className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Health Recovery · 30-Day Plan
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
          Daily Routine
        </h1>
      </div>

      {/* Day 1 picker */}
      <div className="cockpit-card" style={{ marginBottom: 20 }}>
        {editingDay1 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              Day 1 start date
            </span>
            <input
              type="date"
              value={tempDay1}
              onChange={e => setTempDay1(e.target.value)}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: 'var(--border-solid)', border: 'none', borderRadius: 6, padding: '6px 10px', color: 'var(--ink)', colorScheme: 'dark', outline: 'none' }}
            />
            <button onClick={confirmEdit} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#86EFAC', color: '#0F0E0C', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>
              Confirm
            </button>
            <button onClick={() => setEditingDay1(false)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              {day1 && dayNumber != null ? (
                <>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: planDone ? '#86EFAC' : plan?.phaseColor ?? 'var(--ink)', lineHeight: 1 }}>
                    {planDone ? '✓ Done' : `Day ${dayNumber}`}
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginLeft: 8 }}>of 30</span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                    {formatDate(today)} · started {formatDate(day1)}
                  </div>
                </>
              ) : (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
                  Set your Day 1 to get started
                </div>
              )}
            </div>
            <button onClick={startEdit} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--border-solid)', color: 'var(--muted)', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {day1 ? 'Change date' : 'Set Day 1'}
            </button>
          </div>
        )}

        {/* Progress bar */}
        {dayNumber != null && (
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 4, background: 'var(--border-solid)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, ((dayNumber) / 30) * 100)}%`, background: `linear-gradient(90deg, ${plan?.phaseColor ?? '#93C5FD'}, #86EFAC)`, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Start</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: plan?.phaseColor ?? '#93C5FD' }}>{Math.min(100, Math.round((dayNumber / 30) * 100))}% complete</span>
            </div>
          </div>
        )}
      </div>

      {/* Plan complete banner */}
      {planDone && (
        <div style={{ marginBottom: 20, padding: '20px 22px', background: 'linear-gradient(135deg, #86EFAC08, #93C5FD08)', border: '1px solid #86EFAC30', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#86EFAC', marginBottom: 6 }}>
            30-Day Plan Complete
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', margin: 0 }}>
            Get blood tests done — iron + B12. Share with Dr. Ritu Jain. Schedule next phase.
          </p>
          <button onClick={startEdit} style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#86EFAC20', color: '#86EFAC', border: '1px solid #86EFAC40', borderRadius: 6, padding: '7px 16px', cursor: 'pointer' }}>
            Restart plan
          </button>
        </div>
      )}

      {!day1 && (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: 20 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Set your Day 1 above to see today&apos;s meals and checklist.
          </p>
        </div>
      )}

      {plan && !planDone && (
        <>
          {/* Phase banner */}
          <div style={{ marginBottom: 20, padding: '12px 18px', background: `${plan.phaseColor}08`, border: `1px solid ${plan.phaseColor}30`, borderRadius: 10 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: plan.phaseColor, marginBottom: 4 }}>
              {plan.phase}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              {plan.focus}
            </p>
          </div>

          {/* Supplements strip */}
          <div className="cockpit-card" style={{ marginBottom: 20 }}>
            <div className="cockpit-label">Today&apos;s supplements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14 }}>💊</span>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)' }}>B12 tablet</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Daily · with dinner or night milk</div>
                </div>
              </div>
              {isAntibioticDay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>💉</span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#FCA5A5' }}>Nitrofurantoin SR 100mg</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Day {dayNumber} of 20 · WITH dinner (mid-meal) · never skip</div>
                  </div>
                </div>
              )}
              {isVitDSunday && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>☀️</span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#FCD34D' }}>Vitamin D3 60,000 IU</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Sunday dose · with fat-containing lunch</div>
                  </div>
                </div>
              )}
              {!isVitDSunday && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.4 }}>
                  <span style={{ fontSize: 14 }}>☀️</span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>Vitamin D3 60,000 IU</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Sundays only · not today</div>
                  </div>
                </div>
              )}
              {isWalkDay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>🚶</span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#86EFAC' }}>Evening walk</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>30 min · 5×/week · raises HDL</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meal timeline */}
          <div className="cockpit-card" style={{ marginBottom: 20 }}>
            <div className="cockpit-label">Today&apos;s meals · {formatDate(today)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {MEALS.map((meal, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i < MEALS.length - 1 ? '1px solid var(--border-solid)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 68, textAlign: 'right' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.04em' }}>{meal.time}</span>
                  </div>
                  <div style={{ width: 1, background: 'var(--border-solid)', alignSelf: 'stretch', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: plan.phaseColor, marginBottom: 3 }}>{meal.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{meal.food}</div>
                    {meal.tip && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{meal.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily checklist */}
          <div className="cockpit-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="cockpit-label" style={{ margin: 0 }}>Daily checklist</div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: totalChecked === totalItems ? '#86EFAC' : 'var(--muted)' }}>
                {totalChecked}/{totalItems}
              </span>
            </div>
            {CHECKLIST_GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: group.color, marginBottom: 8 }}>
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {group.items.map(item => {
                    const key = `${group.label}:${item}`
                    const done = !!checks[key]
                    // Skip antibiotic item if not in antibiotic phase
                    if (item === 'Nitrofurantoin WITH dinner (mid-meal)' && !isAntibioticDay) return null
                    return (
                      <button
                        key={item}
                        onClick={() => toggleCheck(key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left', width: '100%', minHeight: 44,
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                          border: `1.5px solid ${done ? group.color : 'var(--border-solid)'}`,
                          background: done ? `${group.color}20` : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {done && <span style={{ fontSize: 11, color: group.color, lineHeight: 1 }}>✓</span>}
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: done ? 'var(--muted)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1, transition: 'all 0.15s', textAlign: 'left' }}>
                          {item}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Red flags */}
          <div style={{ padding: '14px 18px', background: '#FCA5A508', border: '1px solid #FCA5A530', borderRadius: 10 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FCA5A5', marginBottom: 8 }}>
              Red flags — go to doctor immediately
            </div>
            {[
              'Fever above 38.5°C / 101°F',
              'Flank or back pain — kidney involvement',
              'Vomiting unable to keep food down',
              'Blood in urine (bright red)',
              'Severe rash or breathing difficulty after Nitrofurantoin',
              'Tingling or numbness in hands or feet — B12 nerve damage',
            ].map(flag => (
              <div key={flag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#FCA5A5', padding: '2px 0', opacity: 0.8 }}>
                ■ {flag}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
