import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
      <Routes>
        {/* Public portfolio */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin — login (no protection needed) */}
        <Route
          path="/admin/login"
          element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>}
        />

        {/* Admin — protected dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </ProfileProvider>
    </AuthProvider>
  )
}
