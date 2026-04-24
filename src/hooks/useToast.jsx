import { useState, useEffect, useCallback } from 'react'
import { MANTRAS } from '../utils/data'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Rotating mantra reminders
  useEffect(() => {
    const rand = () => MANTRAS[Math.floor(Math.random() * MANTRAS.length)]
    const t1 = setTimeout(() => show(rand()), 3000)
    const interval = setInterval(() => show(rand()), 4 * 60 * 60 * 1000)
    return () => { clearTimeout(t1); clearInterval(interval) }
  }, [show])

  return { toasts, show, dismiss }
}

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="toast-anim bg-bg-2 border border-accent rounded-xl p-4 max-w-xs shadow-xl">
          <button
            onClick={() => dismiss(t.id)}
            className="absolute top-2 right-3 text-txt-3 hover:text-txt-1 text-sm"
          >✕</button>
          <p className="font-head italic text-accent text-sm leading-relaxed pr-4">{t.msg}</p>
          <span className="text-[11px] text-txt-3 mt-1 block">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  )
}
