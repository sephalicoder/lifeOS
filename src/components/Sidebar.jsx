import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/signin')
    } catch (err) {
      console.error('Failed to log out:', err)
    }
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '☁️' },
    { path: '/daily', label: 'Daily Schedule', icon: '🎯' },
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/chat', label: 'AI Guide', icon: '🤖' },
    { path: '/health', label: 'Health', icon: '❤️' },
    { path: '/relationships', label: 'Relationships', icon: '💖' },
    { path: '/career', label: 'Career', icon: '🚀' },
    { path: '/money', label: 'Money', icon: '🪙' },
    { path: '/skills', label: 'Skills', icon: '💡' },
    { path: '/mindset', label: 'Mindset', icon: '🧠' },
    { path: '/progress', label: 'Progress', icon: '📊' }
  ]

  return (
    <aside className="w-60 bg-white border-r border-sky-100 p-4 fixed left-0 top-0 h-screen hidden md:flex flex-col justify-between z-50">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">☁️</span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">lifeOS</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] text-slate-400 truncate px-2 font-mono">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs py-1.5 px-3 rounded-lg border border-slate-200 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}