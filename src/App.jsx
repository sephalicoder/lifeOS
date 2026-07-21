import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useStore } from './hooks/useStore'
import { useToast, ToastContainer } from './hooks/useToast'
import { useAuth } from './hooks/useAuth'
import Chat from './pages/Chat'

// Pages
import Dashboard     from './pages/Dashboard'
import DailySchedule from './pages/DailySchedule'
import Notes         from './pages/Notes'
import HRCMPage      from './pages/HRCMPage'
import Skills        from './pages/Skills'
import Mindset       from './pages/Mindset'
import SignIn        from './pages/SignIn'
import SignUp        from './pages/SignUp'
import Progress from './pages/Progress'

// Protected Route Wrapper Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-1 text-white">
        <p>Loading...</p>
      </div>
    )
  }

  return user ? children : <Navigate to="/signin" replace />
}

export default function App() {
  const store = useStore()
  const { toasts, dismiss } = useToast()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg-1">
      {/* Show Sidebar only when logged in */}
      {user && <Sidebar />}

      <main className={`flex-1 ${user ? 'md:ml-60 p-6 md:p-10' : 'p-6'} max-w-5xl mx-auto`}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/signin" element={user ? <Navigate to="/" replace /> : <SignIn />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUp />} />

          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard store={store} />
            </ProtectedRoute>
          } />

          <Route path="/daily" element={
            <ProtectedRoute>
              <DailySchedule store={store} />
            </ProtectedRoute>
          } />

          <Route path="/notes" element={
            <ProtectedRoute>
              <Notes store={store} />
            </ProtectedRoute>
          } />

          <Route path="/health" element={
            <ProtectedRoute>
              <HRCMPage pillar="health" store={store} />
            </ProtectedRoute>
          } />

          <Route path="/relationships" element={
            <ProtectedRoute>
              <HRCMPage pillar="relationships" store={store} />
            </ProtectedRoute>
          } />

          <Route path="/career" element={
            <ProtectedRoute>
              <HRCMPage pillar="career" store={store} />
            </ProtectedRoute>
          } />

          <Route path="/money" element={
            <ProtectedRoute>
              <HRCMPage pillar="money" store={store} />
            </ProtectedRoute>
          } />

          <Route path="/skills" element={
            <ProtectedRoute>
              <Skills store={store} />
            </ProtectedRoute>
          } />

          <Route path="/mindset" element={
            <ProtectedRoute>
              <Mindset store={store} />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
  <ProtectedRoute>
    <Progress store={store} />
  </ProtectedRoute>
} />

<Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}