import { useNavigate } from 'react-router-dom'
import { MANTRAS, PILLAR_COLORS, PILLARS, greet, todayStr, formatDate } from '../utils/data'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard({ store }) {
  const navigate = useNavigate()
  const { hrcm, schedule, notes, skills } = store
  const mantra = MANTRAS[Math.floor(Math.random() * MANTRAS.length)]
  const upcoming = [...schedule].filter(t => !t.done).sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5)
  const recent = [...notes].reverse().slice(0, 4)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-txt-2 text-sm mb-1">{greet()} ◇</p>
        <h1 className="page-title mb-1">Your Life, Structured.</h1>
        <p className="text-txt-3 text-xs">{todayStr()}</p>
      </div>

      {/* Mantra banner */}
      <div className="bg-accent-dim border border-amber-700/30 rounded-xl p-5 mb-7 text-center">
        <p className="font-head italic text-accent text-lg leading-relaxed">{mantra}</p>
      </div>

      {/* HRCM Grid */}
      <p className="card-label">HRCM PILLARS</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {PILLARS.map(p => {
          const d = hrcm[p]
          const c = PILLAR_COLORS[p]
          return (
            <div
              key={p}
              onClick={() => navigate(`/${p}`)}
              className={`${c.bg} border ${c.border} rounded-xl p-4 cursor-pointer hover:-translate-y-0.5 transition-transform`}
            >
              <p className={`text-[9px] tracking-widest uppercase font-medium ${c.text} mb-2`}>{p}</p>
              <p className={`font-head text-3xl font-light ${c.text} leading-none mb-1`}>
                {d.score}<span className="text-base">/10</span>
              </p>
              <p className="text-txt-2 text-xs leading-snug">{d.note}</p>
              <ProgressBar pct={d.score * 10} color={c.hex} className="mt-2" />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
        {/* Today's focus */}
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <p className="card-label mb-0">TODAY'S FOCUS</p>
            <button onClick={() => navigate('/daily')} className="text-accent text-xs hover:underline">
              See all →
            </button>
          </div>
          {upcoming.length === 0
            ? <p className="text-txt-3 text-sm italic text-center py-4">
                No tasks yet —{' '}
                <button onClick={() => navigate('/daily')} className="text-accent">plan your day</button>
              </p>
            : upcoming.map(t => (
                <div key={t.id} className="flex gap-3 py-2 border-b border-border-1 last:border-0">
                  <span className="text-txt-3 text-xs w-14 shrink-0 pt-0.5">{t.time}</span>
                  <span className="text-sm text-txt-1">
                    {t.task}
                    <span className={`tag tag-${t.category}`}>{t.category}</span>
                  </span>
                </div>
              ))
          }
        </div>

        {/* Recent notes */}
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <p className="card-label mb-0">RECENT NOTES</p>
            <button onClick={() => navigate('/notes')} className="text-accent text-xs hover:underline">
              See all →
            </button>
          </div>
          {recent.length === 0
            ? <p className="text-txt-3 text-sm italic text-center py-4">No notes yet</p>
            : recent.map(n => (
                <div key={n.id} className="py-2 border-b border-border-1 last:border-0">
                  <p className="text-sm text-txt-1">{n.title || 'Untitled'}</p>
                  <p className="text-[11px] text-txt-3 mt-0.5">{formatDate(n.updated)}</p>
                </div>
              ))
          }
        </div>
      </div>

      {/* Skills overview */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <p className="card-label mb-0">SKILLS IN PROGRESS</p>
          <button onClick={() => navigate('/skills')} className="text-accent text-xs hover:underline">
            Manage →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.slice(0, 4).map(s => (
            <div key={s.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-txt-1">{s.name}</span>
                <span className="text-accent">{s.pct}%</span>
              </div>
              <ProgressBar pct={s.pct} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
