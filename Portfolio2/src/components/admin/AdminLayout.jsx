import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt', exact: true },
  { to: '/admin/projects', label: 'Projects', icon: 'fas fa-laptop-code' },
  { to: '/admin/skills', label: 'Skills', icon: 'fas fa-code' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-700 to-purple-700 text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/20">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-shield-alt text-yellow-300"></i>
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Admin Panel</p>
            <p className="text-xs text-white/60 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <i className={`${item.icon} w-5 text-center`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-5 border-t border-white/20 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition font-medium text-sm"
          >
            <i className="fas fa-external-link-alt w-5 text-center"></i>
            View Live Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition font-medium text-sm"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 h-16">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h1 className="text-gray-800 font-semibold hidden md:block">Portfolio Management</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
