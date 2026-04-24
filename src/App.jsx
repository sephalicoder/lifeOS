import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useStore } from './hooks/useStore'
import { useToast, ToastContainer } from './hooks/useToast'

import Dashboard     from './pages/Dashboard'
import DailySchedule from './pages/DailySchedule'
import Notes         from './pages/Notes'
import HRCMPage      from './pages/HRCMPage'
import Skills        from './pages/Skills'
import Mindset       from './pages/Mindset'

export default function App() {
  const store = useStore()
  const { toasts, dismiss } = useToast()

  return (
    <div className="flex min-h-screen bg-bg-1">
      <Sidebar />

      <main className="flex-1 md:ml-60 p-6 md:p-10 max-w-5xl">
        <Routes>
          <Route path="/"              element={<Dashboard     store={store} />} />
          <Route path="/daily"         element={<DailySchedule store={store} />} />
          <Route path="/notes"         element={<Notes         store={store} />} />
          <Route path="/health"        element={<HRCMPage pillar="health"        store={store} />} />
          <Route path="/relationships" element={<HRCMPage pillar="relationships" store={store} />} />
          <Route path="/career"        element={<HRCMPage pillar="career"        store={store} />} />
          <Route path="/money"         element={<HRCMPage pillar="money"         store={store} />} />
          <Route path="/skills"        element={<Skills        store={store} />} />
          <Route path="/mindset"       element={<Mindset       store={store} />} />
        </Routes>
      </main>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
