import { useState } from 'react'

export default function HRCMPage({ pillar, store }) {
  const [input, setInput] = useState('')
  const items = store.data[pillar] || []

  const addItem = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newItem = {
      id: crypto.randomUUID(),
      text: input.trim(),
      createdAt: Date.now()
    }

    const updated = [...items, newItem]
    store.updatePillar(pillar, updated, `Added "${input.trim()}" to ${pillar}`)
    setInput('')
  }

  const deleteItem = (id) => {
    const updated = items.filter(item => item.id !== id)
    store.updatePillar(pillar, updated, `Removed item from ${pillar}`)
  }

  if (store.loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white capitalize mb-4">{pillar}</h2>

      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add to ${pillar}...`}
          className="flex-1 px-4 py-2 bg-bg-1 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 && <p className="text-gray-500">Nothing here yet.</p>}
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-bg-2 rounded-lg">
            <span className="text-white">{item.text}</span>
            <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 text-sm">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}