import { useState } from 'react'
import { formatDate } from '../utils/data'

const CATEGORIES = ['general', 'health', 'relationships', 'career', 'money', 'mindset']

export default function Notes({ store }) {
  const { notes, addNote, updateNote, deleteNote } = store
  const [activeId, setActiveId] = useState(null)

  const active = notes.find(n => n.id === activeId)

  const handleNew = () => {
    const id = addNote()
    setActiveId(id)
  }

  if (active) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <button className="btn btn-ghost" onClick={() => setActiveId(null)}>← Back</button>
          <div className="flex gap-2">
            <select
              className="!w-auto"
              value={active.category}
              onChange={e => updateNote(active.id, { category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn-danger" onClick={() => { deleteNote(active.id); setActiveId(null) }}>
              Delete
            </button>
          </div>
        </div>
        <div className="card">
          <input
            type="text"
            className="!bg-transparent !border-0 !px-0 !py-0 font-head text-3xl font-light text-txt-1 mb-4 focus:ring-0"
            placeholder="Title..."
            value={active.title}
            onChange={e => updateNote(active.id, { title: e.target.value })}
          />
          <textarea
            className="!bg-transparent !border-0 !px-0 !py-0 !min-h-[320px] text-[14px] text-txt-1 leading-7 focus:ring-0"
            placeholder="Start writing..."
            value={active.body}
            onChange={e => updateNote(active.id, { body: e.target.value })}
          />
        </div>
        <p className="text-right text-[11px] text-txt-3 mt-2">Auto-saved</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="page-title mb-1">Notes</h1>
        <p className="text-txt-2 text-sm">Capture thoughts, plans, reflections</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button className="btn btn-primary" onClick={handleNew}>+ New Note</button>
      </div>

      {notes.length === 0 ? (
        <p className="text-txt-3 italic text-sm text-center py-12">No notes yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...notes].reverse().map(n => (
            <div
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className="card cursor-pointer hover:-translate-y-0.5 hover:border-border-2 transition-all"
            >
              <p className="font-head text-[15px] font-medium text-txt-1 mb-1.5">
                {n.title || 'Untitled'}
              </p>
              <p className="text-[12.5px] text-txt-2 leading-snug line-clamp-3">
                {n.body || ''}
              </p>
              <div className="flex justify-between mt-3 text-[11px] text-txt-3">
                <span>{formatDate(n.updated)}</span>
                <span>{n.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
