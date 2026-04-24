import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { MANTRAS } from '../utils/data'

const NAV = [
  { to: '/',             icon: '◇', label: 'Dashboard' },
  { to: '/daily',        icon: '◈', label: 'Daily Schedule' },
  { to: '/notes',        icon: '◻', label: 'Notes' },
]

const HRCM_NAV = [
  { to: '/health',        label: 'Health',        dot: 'bg-health' },
  { to: '/relationships', label: 'Relationships',  dot: 'bg-rel' },
  { to: '/career',        label: 'Career',         dot: 'bg-career' },
  { to: '/money',         label: 'Money',          dot: 'bg-money' },
]

const GROW_NAV = [
  { to: '/skills',   icon: '◈', label: 'Skills' },
  { to: '/mindset',  icon: '◇', label: 'Mindset' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const mantra = MANTRAS[0]

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="md:hidden fixed top-4 left-4 z-50 text-txt-2 text-xl bg-bg-2 border border-border-1 w-9 h-9 rounded-lg flex items-center justify-center"
        aria-label="Toggle sidebar"
      >☰</button>

      {/* Overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setOpen(false)} />
      )}

      <nav className={`
        fixed top-0 left-0 h-screen w-60 bg-bg-2 border-r border-border-1
        flex flex-col z-40 overflow-y-auto
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border-1">
          <span className="text-accent text-xl">◈</span>
          <span className="font-head text-[18px] font-medium tracking-wide">LifeOS</span>
        </div>

        {/* Mantra strip */}
        <div className="px-5 py-2.5 border-b border-border-1 bg-accent-dim">
          <p className="font-head italic text-accent text-[11px] leading-relaxed">{mantra}</p>
        </div>

        {/* Nav */}
        <div className="flex-1 py-3 flex flex-col gap-0.5">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <span className="text-[11px]">{icon}</span>
              {label}
            </NavLink>
          ))}

          <p className="text-[9px] tracking-[0.14em] text-txt-3 px-5 pt-4 pb-1 font-medium">HRCM PILLARS</p>

          {HRCM_NAV.map(({ to, label, dot }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
              {label}
            </NavLink>
          ))}

          <p className="text-[9px] tracking-[0.14em] text-txt-3 px-5 pt-4 pb-1 font-medium">GROW</p>

          {GROW_NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <span className="text-[11px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-1">
          <div className="bg-bg-3 border border-border-2 rounded-xl px-3 py-3 text-center">
            <p className="text-[11px] text-txt-2 italic leading-relaxed">
              If you believe it,<br />you can do it
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
