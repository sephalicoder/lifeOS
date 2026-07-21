import { useMemo, useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../utils/firebase'
import { useAuth } from '../hooks/useAuth'
import RecentActivity from '../components/RecentActivity'

function toArray(v) {
  return Array.isArray(v) ? v : v ? Object.values(v) : []
}

function useActivityLog() {
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

  return { log, loading }
}

function dateKey(ts) {
  const d = new Date(ts)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function cap(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function encouragement(streak, weekPercent) {
  if (streak >= 7) return `${streak} days in a row — that's real momentum. Keep going.`
  if (streak >= 1) return `You're on a ${streak}-day streak. Nice consistency.`
  if (weekPercent >= 40) return `You've shown up ${weekPercent}% of this week already — solid effort.`
  return `Every day you log something is a win. Let's start today.`
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-bg-2 rounded-xl border border-border border-opacity-10">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function Heatmap({ dayCounts }) {
  const weeks = useMemo(() => {
    const today = new Date()
    const days = []
    for (let i = 0; i < 182; i++) { // ~26 weeks
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
    if (!count) return 'bg-bg-2'
    if (count === 1) return 'bg-blue-900'
    if (count === 2) return 'bg-blue-700'
    if (count <= 4) return 'bg-blue-500'
    return 'bg-blue-400'
  }

  return (
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
  )
}

export default function Progress({ store }) {
  const { log, loading } = useActivityLog()

  const { dayCounts, streak, bestStreak, totalActiveDays, mostActivePillar, weekPercent } = useMemo(() => {
    const counts = {}
    const pillarTotals = {}

    log.forEach(entry => {
      const key = dateKey(entry.timestamp)
      counts[key] = (counts[key] || 0) + 1
      pillarTotals[entry.pillar] = (pillarTotals[entry.pillar] || 0) + 1
    })

    // current streak (consecutive days up to today with activity)
    let streak = 0
    let cursor = new Date()
    while (true) {
      const key = dateKey(cursor.getTime())
      if (counts[key]) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else break
    }

    // best streak ever
    const sortedDays = Object.keys(counts).sort()
    let bestStreak = 0, run = 0, prev = null
    sortedDays.forEach(day => {
      if (prev) {
        const diff = (new Date(day) - new Date(prev)) / 86400000
        run = diff === 1 ? run + 1 : 1
      } else run = 1
      bestStreak = Math.max(bestStreak, run)
      prev = day
    })

    const totalActiveDays = sortedDays.length
    const mostActivePillar = Object.entries(pillarTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    // % of last 7 days with activity
    let activeInLast7 = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      if (counts[dateKey(d.getTime())]) activeInLast7++
    }
    const weekPercent = Math.round((activeInLast7 / 7) * 100)

    return { dayCounts: counts, streak, bestStreak, totalActiveDays, mostActivePillar, weekPercent }
  }, [log])

  if (loading) return <p className="text-gray-400">Loading your progress...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Your Progress</h2>
      <p className="text-gray-400 mb-6">{encouragement(streak, weekPercent)}</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Current streak" value={`${streak} ${streak === 1 ? 'day' : 'days'}`} />
        <StatCard label="Best streak" value={`${bestStreak} ${bestStreak === 1 ? 'day' : 'days'}`} />
        <StatCard label="This week" value={`${weekPercent}%`} />
        <StatCard label="Most active area" value={mostActivePillar ? cap(mostActivePillar) : '—'} />
      </div>

      {/* Heatmap */}
      <Heatmap dayCounts={dayCounts} />

      <p className="text-sm text-gray-500 mt-6 mb-8">
        Every entry — a note, a habit, a task — lights up a day here. This isn't about a perfect
        streak; it's a record of showing up for yourself, over and over.
      </p>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
        <RecentActivity limit={15} />
      </div>
    </div>
  )
}