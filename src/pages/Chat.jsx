import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your LifeOS guide. Ask me anything about your progress, or for advice on any pillar." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading || !user) return

    const userMsg = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.content,
          uid: user.uid,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong — try again in a moment." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">LifeOS Guide</h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400 italic">Thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your progress, or for advice..."
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
          Send
        </button>
      </form>
    </div>
  )
}