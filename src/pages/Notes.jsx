import { useState } from 'react'

export default function Notes({ store }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const notes = store?.data?.notes || []

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!title.trim() && !content.trim()) return

    const noteTitle = title.trim() || 'Untitled Note'
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: content.trim(),
      updated: new Date().toISOString()
    }

    const updated = [newNote, ...notes]
    store.updatePillar('notes', updated, `Added note: "${noteTitle}"`)
    setTitle('')
    setContent('')
  }

  const handleDeleteNote = (id, noteTitle) => {
    const updated = notes.filter((n) => n.id !== id && n._id !== id)
    store.updatePillar('notes', updated, `Deleted note: "${noteTitle || 'Note'}"`)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Notes</h1>
        <p className="text-txt-3 text-sm">Capture quick thoughts, ideas, and logs.</p>
      </div>

      <form onSubmit={handleAddNote} className="bg-bg-2 p-5 rounded-xl border border-gray-800 space-y-3">
        <input
          type="text"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-bg-1 border border-gray-700 px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:border-blue-500 text-sm"
        />
        <textarea
          placeholder="Write your note here..."
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-bg-1 border border-gray-700 p-4 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
          >
            Save Note
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <div className="col-span-full bg-bg-2 border border-gray-800 rounded-xl p-8 text-center text-txt-3 text-sm">
            No notes saved yet.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id || note._id} className="bg-bg-2 border border-gray-800 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-base mb-2">{note.title}</h3>
                <p className="text-txt-2 text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800/60">
                <span className="text-[11px] text-txt-3">
                  {new Date(note.updated).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id || note._id, note.title)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}