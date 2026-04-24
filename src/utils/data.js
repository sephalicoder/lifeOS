// ── CONSTANTS ──────────────────────────────────────────────
export const MANTRAS = [
  '"Success is about actions, not intentions"',
  '"If you believe it, you can do it"',
  '"Don\'t solve — Evolve"',
  '"Calm is a superpower"',
  '"One step at a time is still moving forward"',
  '"Discipline is freedom"',
  '"Your habits build your future"',
  '"Progress, not perfection"',
]

export const PILLARS = ['health', 'relationships', 'career', 'money']

export const PILLAR_COLORS = {
  health:        { text: 'text-health',  bg: 'bg-health-dim',  border: 'border-health/30',  hex: '#4ade80' },
  relationships: { text: 'text-rel',     bg: 'bg-rel-dim',     border: 'border-rel/30',     hex: '#f472b6' },
  career:        { text: 'text-career',  bg: 'bg-career-dim',  border: 'border-career/30',  hex: '#60a5fa' },
  money:         { text: 'text-money',   bg: 'bg-money-dim',   border: 'border-money/30',   hex: '#fbbf24' },
}

export const HRCM_DEFAULTS = {
  health:        { score: 7, note: 'Exercise 3x/week, sleep 7h', goals: ['Sleep 7–8h daily', 'Morning walk 20min', 'Cook at home 5x/week'] },
  relationships: { score: 6, note: 'Call family weekly', goals: ['Weekly family call', 'Coffee with a friend monthly', 'Journal feelings'] },
  career:        { score: 7, note: 'Focus on deep work blocks', goals: ['1 deep work session/day', 'Learn one skill/month', 'Weekly review'] },
  money:         { score: 5, note: 'Track spending, save 20%', goals: ['Track every expense', 'Save 20% of income', 'Monthly budget review'] },
}

export const SKILL_DEFAULTS = [
  { id: uid(), name: 'Public Speaking', category: 'career', pct: 40 },
  { id: uid(), name: 'Python',          category: 'career', pct: 55 },
  { id: uid(), name: 'Meditation',      category: 'health', pct: 30 },
  { id: uid(), name: 'Budgeting',       category: 'money',  pct: 60 },
]

export const ANXIETY_TOOLS = [
  { title: 'Box Breathing',   desc: '4 sec in → 4 hold → 4 out → 4 hold. Repeat 4×.' },
  { title: 'Grounding',       desc: '5 things you see, 4 you hear, 3 you touch.' },
  { title: 'Name It',         desc: 'Say aloud: "I am feeling [emotion]. This will pass."' },
  { title: 'Action Anchor',   desc: 'Do ONE small action. Motion beats emotion.' },
  { title: 'Progress Check',  desc: 'List 3 things you\'ve done right today.' },
]

// ── UTILS ───────────────────────────────────────────────────
export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function load(key, fallback) {
  try {
    const val = localStorage.getItem('lifeos_' + key)
    return val !== null ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export function save(key, val) {
  localStorage.setItem('lifeos_' + key, JSON.stringify(val))
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function todayStr() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function greet() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
