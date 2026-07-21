import { useNavigate } from 'react-router-dom'
import { MANTRAS, greet, todayStr, formatDate } from '../utils/data'
import StreakHeatmap from '../components/StreakHeatmap'
import RecentActivity from '../components/RecentActivity'

const PILLARS = [
  {
    id: 'health',
    title: 'Health & Energy',
    icon: '❤️',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    accent: 'bg-rose-500'
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: '💖',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-900',
    accent: 'bg-pink-500'
  },
  {
    id: 'career',
    title: 'Career & Growth',
    icon: '🚀',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    accent: 'bg-amber-500'
  },
  {
    id: 'money',
    title: 'Money & Wealth',
    icon: '🪙',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    accent: 'bg-emerald-500'
  }
]

export default function Dashboard({ store }) {
  const navigate = useNavigate()
  const data = store?.data || {}
  const schedule = data.schedule || []
  const notes = data.notes || []
  const activityLog = data.activityLog || []

  const hrcm = data.hrcm || {
    health: { score: 8, note: 'Daily workouts' },
    relationships: { score: 9, note: 'Family calls' },
    career: { score: 9, note: 'Building lifeOS' },
    money: { score: 7, note: 'Budgeting' }
  }

  const mantra = MANTRAS[Math.floor(Math.random() * MANTRAS.length)]
  const upcoming = Array.isArray(schedule) ? [...schedule].filter((t) => t && !t.done).slice(0, 4) : []

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-sky-600 tracking-wider uppercase">{greet()}</p>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">{todayStr()}</p>
      </div>

      {/* Daily Mantra */}
      <div className="cloud-card bg-sky-50/60 border-sky-200 py-3.5 px-5">
        <p className="text-sm font-medium text-sky-900">✨ "{mantra}"</p>
      </div>

      {/* Life Pillars Grid */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-3">Pillars Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p) => {
            const d = hrcm[p.id] || { score: 0, note: 'No status recorded' }
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/${p.id}`)}
                className={`cloud-card ${p.bg} ${p.border} cursor-pointer hover:border-slate-300 transition-all`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">{p.icon}</span>
                  <span className={`text-xl font-bold ${p.text}`}>
                    {d.score}<span className="text-xs font-normal text-slate-500">/10</span>
                  </span>
                </div>
                <h3 className={`font-semibold text-sm ${p.text}`}>{p.title}</h3>
                <p className="text-xs text-slate-600 truncate mt-0.5">{d.note}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/80 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full ${p.accent}`}
                    style={{ width: `${(d.score || 0) * 10}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Heatmap */}
      <StreakHeatmap logs={activityLog} />

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-slate-800 mb-3">Recent Activity</h3>
        <RecentActivity limit={5} />
      </div>

      {/* Tasks & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="cloud-card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-800 text-sm">Focus Quests</h3>
            <button
              onClick={() => navigate('/daily')}
              className="text-xs text-sky-600 font-medium hover:underline"
            >
              View Schedule →
            </button>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No pending items for today.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((t) => (
                <div
                  key={t.id || t._id}
                  className="flex items-center justify-between bg-sky-50/50 border border-sky-100 p-2.5 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200 font-medium">
                      {t.time}
                    </span>
                    <span className="text-slate-700 font-medium">{t.task}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {t.estimatedHours}h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cloud-card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-800 text-sm">Recent Notes</h3>
            <button
              onClick={() => navigate('/notes')}
              className="text-xs text-sky-600 font-medium hover:underline"
            >
              View All →
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No recent notes.</p>
          ) : (
            <div className="space-y-2">
              {notes.slice(0, 3).map((n) => (
                <div key={n.id || n._id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                  <p className="font-medium text-slate-800 truncate">{n.title || 'Untitled Note'}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatDate(n.updated)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}