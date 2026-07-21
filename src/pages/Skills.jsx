import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'

export default function Skills({ store }) {
  const [name, setName] = useState('')
  const [pct, setPct] = useState(25)

  const skills = store?.data?.skills || []

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const newSkill = {
      id: Date.now().toString(),
      name: name.trim(),
      pct: Number(pct)
    }

    const updated = [...skills, newSkill]
    store.updatePillar('skills', updated)
    setName('')
  }

  const handleUpdateProgress = (id, newPct) => {
    const updated = skills.map((s) =>
      s.id === id ? { ...s, pct: Math.min(100, Math.max(0, Number(newPct))) } : s
    )
    store.updatePillar('skills', updated)
  }

  const handleDeleteSkill = (id) => {
    const updated = skills.filter((s) => s.id !== id)
    store.updatePillar('skills', updated)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Skills Tracker</h1>
        <p className="text-txt-3 text-sm">Monitor continuous learning and skill mastery.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleAddSkill} className="bg-bg-2 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Skill Name (e.g. React, System Design)..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-bg-1 border border-gray-700 px-4 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
        />
        <div className="flex items-center gap-2 bg-bg-1 border border-gray-700 px-3 py-2 rounded-lg">
          <span className="text-xs text-txt-3">Initial Progress:</span>
          <input
            type="number"
            min="0"
            max="100"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            className="w-16 bg-transparent text-white text-sm focus:outline-none text-right font-mono"
          />
          <span className="text-xs text-white">%</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
        >
          Add Skill
        </button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.length === 0 ? (
          <div className="col-span-full bg-bg-2 border border-gray-800 rounded-xl p-8 text-center text-txt-3 text-sm">
            No skills tracked yet. Add one above!
          </div>
        ) : (
          skills.map((s) => (
            <div key={s.id} className="bg-bg-2 border border-gray-800 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white text-base">{s.name}</h3>
                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={s.pct || 0}
                  onChange={(e) => handleUpdateProgress(s.id, e.target.value)}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-mono text-accent w-10 text-right">{s.pct || 0}%</span>
              </div>

              <ProgressBar pct={s.pct || 0} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}