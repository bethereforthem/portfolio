import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ projects: 0, categories: 0, skills: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [{ count: projectCount }, { count: categoryCount }, { count: skillCount }] =
        await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('skill_categories').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
        ])
      setStats({
        projects: projectCount ?? 0,
        categories: categoryCount ?? 0,
        skills: skillCount ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    {
      label: 'Total Projects',
      value: stats.projects,
      icon: 'fas fa-laptop-code',
      gradient: 'from-blue-500 to-blue-700',
      to: '/admin/projects',
    },
    {
      label: 'Skill Categories',
      value: stats.categories,
      icon: 'fas fa-layer-group',
      gradient: 'from-purple-500 to-purple-700',
      to: '/admin/skills',
    },
    {
      label: 'Total Skills',
      value: stats.skills,
      icon: 'fas fa-code',
      gradient: 'from-green-500 to-green-700',
      to: '/admin/skills',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back,{' '}
          <span className="text-blue-600">{user?.email?.split('@')[0]}</span>
        </h2>
        <p className="text-gray-500 mt-1">Manage your portfolio content from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow group overflow-hidden"
          >
            <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`}></div>
            <div className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0`}>
                <i className={`${card.icon} text-white text-xl`}></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? <span className="inline-block w-8 h-7 bg-gray-200 rounded animate-pulse"></span> : card.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/projects"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition">
              <i className="fas fa-plus text-blue-600"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Manage Projects</p>
              <p className="text-sm text-gray-500">Add, edit, or remove projects</p>
            </div>
          </Link>

          <Link
            to="/admin/skills"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition">
              <i className="fas fa-plus text-purple-600"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Manage Skills</p>
              <p className="text-sm text-gray-500">Add, edit, or remove skills</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Live site link */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Your portfolio is live</h3>
          <p className="text-white/70 text-sm mt-0.5">Changes you make here reflect immediately on the public site.</p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition text-sm"
        >
          <i className="fas fa-external-link-alt"></i>
          View Portfolio
        </Link>
      </div>
    </div>
  )
}
