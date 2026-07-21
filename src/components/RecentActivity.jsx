import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../utils/firebase'
import { useAuth } from '../hooks/useAuth'

function toArray(v) {
  return Array.isArray(v) ? v : v ? Object.values(v) : []
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

const pillarEmoji = {
  health: '💪', relationships: '❤️', career: '💼', money: '💰',
  notes: '📝', schedule: '📅', skills: '🎯', mindset: '🧠'
}

export default function RecentActivity({ limit = 10 }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setEntries([]); setLoading(false); return }
    const logRef = ref(db, `users/${user.uid}/activityLog`)
    const unsub = onValue(logRef, (snap) => {
      const all = toArray(snap.val())
      const sorted = all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
      setEntries(sorted)
      setLoading(false)
    })
    return () => unsub()
  }, [user, limit])

  if (loading) return <p className="text-gray-400 text-sm">Loading activity...</p>

  if (entries.length === 0) {
    return (
      <div className="p-4 bg-bg-2 rounded-xl border border-border border-opacity-10">
        <p className="text-gray-500 text-sm">
          Nothing logged yet — your first entry will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-bg-2 rounded-xl border border-border border-opacity-10 divide-y divide-gray-800">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <span className="text-lg">{pillarEmoji[entry.pillar] || '✨'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{entry.description}</p>
            <p className="text-xs text-gray-500">{timeAgo(entry.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}