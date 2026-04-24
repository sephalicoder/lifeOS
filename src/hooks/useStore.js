import { useState, useCallback } from 'react'
import { load, save, uid, HRCM_DEFAULTS, SKILL_DEFAULTS } from '../utils/data'

export function useStore() {
  const [notes,    setNotesRaw]    = useState(() => load('notes', []))
  const [schedule, setScheduleRaw] = useState(() => load('schedule', []))
  const [skills,   setSkillsRaw]   = useState(() => load('skills', SKILL_DEFAULTS))
  const [hrcm,     setHrcmRaw]     = useState(() => load('hrcm', HRCM_DEFAULTS))
  const [reflection, setReflectionRaw] = useState(() => load('reflection', ''))

  const persist = (key, setter) => (val) => {
    setter(val)
    save(key, val)
  }

  const setNotes    = persist('notes', setNotesRaw)
  const setSchedule = persist('schedule', setScheduleRaw)
  const setSkills   = persist('skills', setSkillsRaw)
  const setHrcm     = persist('hrcm', setHrcmRaw)
  const setReflection = persist('reflection', setReflectionRaw)

  // ── NOTES ─────────────────────────────────────────────────
  const addNote = useCallback(() => {
    const n = { id: uid(), title: '', body: '', category: 'general', updated: Date.now() }
    setNotes(prev => [...prev, n])
    return n.id
  }, [])

  const updateNote = useCallback((id, patch) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch, updated: Date.now() } : n))
  }, [])

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  // ── SCHEDULE ──────────────────────────────────────────────
  const addTask = useCallback((task) => {
    setSchedule(prev => [...prev, { id: uid(), done: false, ...task }])
  }, [])

  const toggleTask = useCallback((id) => {
    setSchedule(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setSchedule(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearDone = useCallback(() => {
    setSchedule(prev => prev.filter(t => !t.done))
  }, [])

  // ── SKILLS ────────────────────────────────────────────────
  const addSkill = useCallback((skill) => {
    setSkills(prev => [...prev, { id: uid(), ...skill }])
  }, [])

  const updateSkill = useCallback((id, pct) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, pct } : s))
  }, [])

  const deleteSkill = useCallback((id) => {
    setSkills(prev => prev.filter(s => s.id !== id))
  }, [])

  // ── HRCM ──────────────────────────────────────────────────
  const updateHrcm = useCallback((pillar, patch) => {
    setHrcm(prev => ({ ...prev, [pillar]: { ...prev[pillar], ...patch } }))
  }, [])

  const addGoal = useCallback((pillar, text) => {
    setHrcm(prev => ({
      ...prev,
      [pillar]: { ...prev[pillar], goals: [...(prev[pillar].goals || []), text] }
    }))
  }, [])

  const removeGoal = useCallback((pillar, idx) => {
    setHrcm(prev => ({
      ...prev,
      [pillar]: { ...prev[pillar], goals: prev[pillar].goals.filter((_, i) => i !== idx) }
    }))
  }, [])

  return {
    notes, addNote, updateNote, deleteNote,
    schedule, addTask, toggleTask, deleteTask, clearDone,
    skills, addSkill, updateSkill, deleteSkill,
    hrcm, updateHrcm, addGoal, removeGoal,
    reflection, setReflection,
  }
}
