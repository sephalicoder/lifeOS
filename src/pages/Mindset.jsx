import { useState } from 'react'
import { MANTRAS, ANXIETY_TOOLS } from '../utils/data'

export default function Mindset({ store }) {
  const { reflection, setReflection } = store
  const [mantraIdx, setMantraIdx] = useState(0)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="page-title mb-1">Mindset</h1>
        <p className="text-txt-2 text-sm">Your anchor in difficult moments</p>
      </div>

      {/* Rotating mantra */}
      <div className="bg-accent-dim border border-amber-700/30 rounded-xl p-7 mb-6 text-center">
        <p className="font-head italic text-accent text-2xl leading-relaxed mb-4">
          {MANTRAS[mantraIdx]}
        </p>
        <button
          className="btn btn-ghost border-amber-700/40 text-accent hover:bg-accent/10 text-sm"
          onClick={() => setMantraIdx(i => (i + 1) % MANTRAS.length)}
        >
          Next mantra ↻
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* All mantras */}
        <div className="card">
          <p className="card-label">CORE MANTRAS</p>
          <ul className="space-y-0">
            {MANTRAS.map((m, i) => (
              <li key={i} className="flex items-start gap-3 py-3 border-b border-border-1 last:border-0">
                <span className="text-accent text-[10px] mt-0.5 shrink-0">◇</span>
                <span className="text-sm text-txt-2 italic leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anxiety toolkit */}
        <div className="card">
          <p className="card-label">ANXIETY TOOLKIT</p>
          <div className="flex flex-col gap-3">
            {ANXIETY_TOOLS.map((t, i) => (
              <div key={i} className="bg-bg-3 border border-border-1 rounded-lg px-3 py-3">
                <p className="text-[13px] font-medium text-txt-1 mb-1">{t.title}</p>
                <p className="text-[12px] text-txt-2 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily reflection */}
      <div className="card">
        <p className="card-label">DAILY REFLECTION</p>
        <p className="text-xs text-txt-2 mb-3">Write freely. No rules. No judgment.</p>
        <textarea
          className="!min-h-[180px]"
          placeholder="How are you really feeling today? What are you grateful for? What will you do — not intend, but DO — today?"
          value={reflection}
          onChange={e => setReflection(e.target.value)}
        />
        <div className="flex justify-end mt-3 items-center gap-3">
          {saved && <span className="text-health text-xs">Saved ✓</span>}
          <button className="btn btn-primary" onClick={handleSave}>
            Save reflection
          </button>
        </div>
      </div>
    </div>
  )
}
