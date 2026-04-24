import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PILLAR_COLORS, formatDate } from '../utils/data'
import ProgressBar from '../components/ProgressBar'
import Modal, { ModalActions, FormGroup } from '../components/Modal'

export default function HRCMPage({ pillar, store }) {
  const { hrcm, updateHrcm, addGoal, removeGoal, notes } = store
  const navigate = useNavigate()
  const d = hrcm[pillar]
  const c = PILLAR_COLORS[pillar]
  const [goalModal, setGoalModal] = useState(false)
  const [goalText, setGoalText] = useState('')

  const relatedNotes = notes.filter(n => n.category === pillar)

  const handleSaveGoal = () => {
    if (!goalText.trim()) return
    addGoal(pillar, goalText.trim())
    setGoalText('')
    setGoalModal(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <p className={`text-[11px] tracking-widest uppercase font-medium ${c.text} mb-1`}>PILLAR</p>
        <h1 className={`page-title ${c.text}`}>
          {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Score card */}
        <div className={`${c.bg} border ${c.border} rounded-xl p-5`}>
          <p className={`text-[9px] tracking-widest uppercase ${c.text} mb-2`}>SCORE</p>
          <p className={`font-head text-4xl font-light ${c.text} leading-none mb-3`}>
            {d.score}<span className="text-xl">/10</span>
          </p>
          <ProgressBar pct={d.score * 10} color={c.hex} />
          <div className="mt-4">
            <label className="text-[11px] text-txt-2 block mb-1">Adjust score</label>
            <input
              type="range" min="1" max="10"
              value={d.score}
              style={{ accentColor: c.hex }}
              onChange={e => updateHrcm(pillar, { score: +e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Status note */}
        <div className="card">
          <p className="card-label">STATUS NOTE</p>
          <textarea
            className="!min-h-[120px]"
            value={d.note}
            onChange={e => updateHrcm(pillar, { note: e.target.value })}
          />
        </div>
      </div>

      {/* Goals */}
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-3">
          <p className="card-label mb-0">GOALS</p>
          <button className="btn btn-ghost text-xs px-2 py-1" onClick={() => setGoalModal(true)}>
            + Goal
          </button>
        </div>
        {(d.goals || []).length === 0 ? (
          <p className="text-txt-3 italic text-sm text-center py-4">No goals set yet</p>
        ) : (d.goals || []).map((g, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border-1 last:border-0">
            <span className={`text-[10px] ${c.text} shrink-0`}>◇</span>
            <span className="flex-1 text-sm text-txt-1">{g}</span>
            <button
              className="btn btn-danger px-1.5 py-0.5 text-xs"
              onClick={() => removeGoal(pillar, i)}
            >✕</button>
          </div>
        ))}
      </div>

      {/* Related notes */}
      <div className="card">
        <p className="card-label">RELATED NOTES</p>
        {relatedNotes.length === 0 ? (
          <p className="text-txt-3 text-sm italic text-center py-4">
            No notes tagged to {pillar}.{' '}
            <button onClick={() => navigate('/notes')} className="text-accent hover:underline">
              Write one
            </button>
          </p>
        ) : relatedNotes.map(n => (
          <div key={n.id} className="py-2 border-b border-border-1 last:border-0">
            <p className="text-sm text-txt-1">{n.title || 'Untitled'}</p>
            <p className="text-[11px] text-txt-3 mt-0.5">{formatDate(n.updated)}</p>
          </div>
        ))}
      </div>

      {goalModal && (
        <Modal title={`Add Goal — ${pillar}`} onClose={() => setGoalModal(false)}>
          <FormGroup label="GOAL">
            <input
              type="text"
              placeholder="e.g. Run 5km 3x/week"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSaveGoal()}
            />
          </FormGroup>
          <ModalActions>
            <button className="btn btn-ghost" onClick={() => setGoalModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveGoal}>Add</button>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
