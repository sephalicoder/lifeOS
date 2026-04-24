import { useState } from 'react'
import Modal, { ModalActions, FormGroup } from '../components/Modal'
import { todayStr } from '../utils/data'

const CATEGORIES = ['personal', 'health', 'rel', 'career', 'money']

export default function DailySchedule({ store }) {
  const { schedule, addTask, toggleTask, deleteTask, clearDone } = store
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ task: '', time: '08:00', category: 'personal', note: '' })

  const sorted = [...schedule].sort((a, b) => a.time.localeCompare(b.time))

  const handleAdd = () => {
    if (!form.task.trim()) return
    addTask({ ...form })
    setForm({ task: '', time: '08:00', category: 'personal', note: '' })
    setShowModal(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="page-title mb-1">Daily Schedule</h1>
        <p className="text-txt-3 text-xs">{todayStr()}</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
        <button className="btn btn-ghost" onClick={clearDone}>Clear done</button>
      </div>

      <div className="card">
        {sorted.length === 0 ? (
          <p className="text-txt-3 italic text-sm text-center py-8">
            Your day is empty — start planning it!
          </p>
        ) : sorted.map(t => (
          <div
            key={t.id}
            className={`grid gap-3 py-3 border-b border-border-1 last:border-0 transition-opacity ${t.done ? 'opacity-40' : ''}`}
            style={{ gridTemplateColumns: '72px 1fr auto' }}
          >
            <span className="text-txt-3 text-xs font-medium pt-0.5">{t.time}</span>
            <div>
              <span className={`text-sm text-txt-1 ${t.done ? 'line-through' : ''}`}>
                {t.task}
              </span>
              <span className={`tag tag-${t.category}`}>{t.category}</span>
              {t.note && <p className="text-[11.5px] text-txt-2 mt-1">{t.note}</p>}
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
              />
              <button
                className="btn btn-danger px-1.5 py-0.5 text-xs"
                onClick={() => deleteTask(t.id)}
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Add Task" onClose={() => setShowModal(false)}>
          <FormGroup label="TASK">
            <input
              type="text"
              placeholder="e.g. Morning run"
              value={form.task}
              onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
              autoFocus
            />
          </FormGroup>
          <div className="grid grid-cols-2 gap-3">
            <FormGroup label="TIME">
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="CATEGORY">
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormGroup>
          </div>
          <FormGroup label="NOTE (OPTIONAL)">
            <input
              type="text"
              placeholder="Any detail..."
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </FormGroup>
          <ModalActions>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Add Task</button>
          </ModalActions>
        </Modal>
      )}
    </div>
  )
}
