import { useState } from 'react'

export default function Mindset({ store }) {
  const [principle, setPrinciple] = useState('')

  const mindset = store?.data?.mindset || []

  const handleAddPrinciple = (e) => {
    e.preventDefault()
    if (!principle.trim()) return

    const newEntry = {
      id: Date.now().toString(),
      text: principle.trim(),
      createdAt: new Date().toISOString()
    }

    const updated = [newEntry, ...mindset]
    store.updatePillar('mindset', updated)
    setPrinciple('')
  }

  const handleDeletePrinciple = (id) => {
    const updated = mindset.filter((m) => m.id !== id)
    store.updatePillar('mindset', updated)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mindset & Core Principles</h1>
        <p className="text-txt-3 text-sm">Mantras, mental models, and personal rules to live by.</p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddPrinciple} className="bg-bg-2 p-4 rounded-xl border border-gray-800 flex gap-3">
        <input
          type="text"
          placeholder="Add a principle or mental model..."
          value={principle}
          onChange={(e) => setPrinciple(e.target.value)}
          className="flex-1 bg-bg-1 border border-gray-700 px-4 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition shrink-0"
        >
          Add Principle
        </button>
      </form>

      {/* Principles List */}
      <div className="space-y-3">
        {mindset.length === 0 ? (
          <div className="bg-bg-2 border border-gray-800 rounded-xl p-8 text-center text-txt-3 text-sm">
            No principles added yet.
          </div>
        ) : (
          mindset.map((item) => (
            <div
              key={item.id}
              className="bg-bg-2 border border-gray-800 p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <p className="text-sm text-white italic font-serif">"{item.text}"</p>
              <button
                onClick={() => handleDeletePrinciple(item.id)}
                className="text-red-400 hover:text-red-300 text-xs shrink-0"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}