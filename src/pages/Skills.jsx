import { useState } from 'react'
import Modal, { ModalActions, FormGroup } from '../components/Modal'
import ProgressBar from '../components/ProgressBar'

const CATEGORIES = ['health', 'relationships', 'career', 'money', 'personal']

export default function Skills({ store }) {
  const { skills, addSkill, updateSkill, deleteSkill } = store
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'career', pct: 0 })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addSkill({ ...form, pct: +form.pct })
    setForm({ name: '', category: 'career', pct: 0 })
    setShowModal(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="page-title mb-1">Skills</h1>
        <p className="text-txt-2 text-sm">Track what you're learning and growing</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Skill</button>
      </div>

      <div className="card">
        {skills.length === 0 ? (
          <p className="text-txt-3 italic text-sm text-center py-8">No skills tracked yet</p>
        ) : skills.map(s => (
          <div
            key={s.id}
            className="grid gap-4 py-4 border-b border-border-1 last:border-0 items-center"
            style={{ gridTemplateColumns: '1fr auto' }}
          >
            <div>
              <p className="text-sm text-txt-1 mb-0.5">{s.name}</p>
              <p className="text-[11px] text-txt-2 mb-2">{s.category}</p>
              <ProgressBar pct={s.pct} className="max-w-xs" />
            </div>
            <div className="text-right">
              <p className="font-head text-2xl font-light text-accent mb-1">{s.pct}%</p>
              <input
                type="range" min="0" max="100"
                value={s.pct}
                onChange={e => updateSkill(s.id, +e.target.value)}
                className="w-20 block mb-2"
              />
              <button
                className="btn btn-danger px-2 py-1 text-xs"
                onClick={() => deleteSkill(s.id)}
              >Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Add Skill" onClose={() => setShowModal(false)}>
          <FormGroup label="SKILL NAME">
            <input
              type="text"
              placeholder="e.g. Spanish, Excel, Running..."
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
          </FormGroup>
          <FormGroup label="CATEGORY">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="CURRENT LEVEL (%)">
            <input
              type="number" min="0" max="100"
              value={form.pct}
              onChange={e => setForm(f => ({ ...f, pct: e.target.value }))}
            />
          </FormGroup>
          <ModalActions>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Skill</button>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
