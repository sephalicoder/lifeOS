import { useEffect, useMemo, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../utils/firebase'
import { useAuth } from '../hooks/useAuth'

function toArray(v) {
  return Array.isArray(v) ? v : v ? Object.values(v) : []
}

function dateKey(ts) {
  return new Date(ts).toISOString().slice(0, 10)
}

export default function StreakHeatmap() {
  const { user } = useAuth()
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLog([]); setLoading(false); return }
    const logRef = ref(db, `users/${user.uid}/activityLog`)
    const unsub = onValue(logRef, (snap) => {
      setLog(toArray(snap.val()))
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  const dayCounts = useMemo(() => {
    const counts = {}
    log.forEach(entry => {
      const key = dateKey(entry.timestamp)
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [log])

  const weeks = useMemo(() => {
    const today = new Date()
    const days = []
    for (let i = 0; i < 182; i++) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      days.push(d)
    }
    days.reverse()

    const cols = []
    let col = []
    days.forEach((d, idx) => {
      col.push(d)
      if (d.getDay() === 6 || idx === days.length - 1) {
        cols.push(col)
        col = []
      }
    })
    return cols
  }, [])

  const intensity = (count) => {
    if (!count) return 'bg-slate-100'
    if (count === 1) return 'bg-sky-200'
    if (count === 2) return 'bg-sky-400'
    if (count <= 4) return 'bg-sky-600'
    return 'bg-sky-800'
  }

  if (loading) return null

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-3">Activity Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((d, di) => {
                const key = dateKey(d.getTime())
                const count = dayCounts[key] || 0
                return (
                  <div
                    key={di}
                    title={`${key}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                    className={`w-3 h-3 rounded-sm ${intensity(count)}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}