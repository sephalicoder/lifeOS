import { useEffect, useState } from 'react'
import { ref, onValue, set, push } from 'firebase/database'
import { db } from '../utils/firebase'
import { useAuth } from './useAuth'

const toArray = (v) => (Array.isArray(v) ? v : v ? Object.values(v) : [])

export function useStore() {
  const { user } = useAuth()
  const [data, setData] = useState({
    schedule: [], notes: [], health: [], relationships: [],
    career: [], money: [], skills: [], mindset: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setData({ schedule: [], notes: [], health: [], relationships: [], career: [], money: [], skills: [], mindset: [] })
      setLoading(false)
      return
    }

    const userRef = ref(db, `users/${user.uid}`)
    const unsubscribe = onValue(userRef, (snapshot) => {
      const val = snapshot.val()
      setData({
        schedule: toArray(val?.schedule),
        notes: toArray(val?.notes),
        health: toArray(val?.health),
        relationships: toArray(val?.relationships),
        career: toArray(val?.career),
        money: toArray(val?.money),
        skills: toArray(val?.skills),
        mindset: toArray(val?.mindset)
      })
      setLoading(false)
    }, (error) => {
      console.error('Firebase read failed:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const updatePillar = (key, updatedItems, changeDescription) => {
    if (!user) {
      console.warn('updatePillar called with no user — write skipped')
      return
    }
    const pillarRef = ref(db, `users/${user.uid}/${key}`)
    set(pillarRef, updatedItems).catch(err => console.error(`Write to ${key} failed:`, err))

    const logRef = ref(db, `users/${user.uid}/activityLog`)
    push(logRef, {
      pillar: key,
      description: changeDescription || `Updated ${key}`,
      timestamp: Date.now()
    }).catch(err => console.error('Activity log write failed:', err))
  }

  return { data, loading, updatePillar }
}