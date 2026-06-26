import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

// ── Country bar (CSS, no extra dep) ──────────────────────────
function CountryBar({ country, count, max, index }) {
  const pct = max > 0 ? Math.max(4, (count / max) * 100) : 4
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-cyan-600',
    'from-orange-500 to-orange-600',
  ]
  const color = colors[index % colors.length]

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-500 w-4 text-right">{index + 1}</span>
      <span className="text-sm text-gray-700 w-28 truncate">{country}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} flex items-center justify-end pr-2 transition-all duration-700`}
          style={{ width: `${pct}%` }}
        >
          <span className="text-[10px] text-white font-bold leading-none">{count}</span>
        </div>
      </div>
    </div>
  )
}

// ── Custom tooltip for the line chart ────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-blue-600 font-bold">{payload[0].value} visit{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  )
}

// ── Skeleton pulse ────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient, loading, to }) {
  const inner = (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <div className="p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
          <i className={`${icon} text-white text-lg`} />
        </div>
        <div>
          <p className="text-gray-500 text-xs">{label}</p>
          {loading
            ? <Skeleton className="w-10 h-7 mt-1" />
            : <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
          }
        </div>
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

// ── Page views breakdown table ────────────────────────────────
function PageTable({ data, loading }) {
  if (loading) return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
    </div>
  )
  if (!data.length) return <p className="text-gray-400 text-sm text-center py-4">No page data yet.</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <th className="pb-2">Page</th>
            <th className="pb-2 text-right">Views</th>
            <th className="pb-2 text-right">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map(({ page, count, total }) => (
            <tr key={page} className="hover:bg-gray-50">
              <td className="py-2 font-medium text-gray-700">{page}</td>
              <td className="py-2 text-right text-gray-600">{count}</td>
              <td className="py-2 text-right">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {total > 0 ? Math.round((count / total) * 100) : 0}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth()

  const [contentStats, setContentStats] = useState({ projects: 0, categories: 0, skills: 0 })
  const [contentLoading, setContentLoading] = useState(true)

  const [visitStats, setVisitStats] = useState({ total: 0, thisMonth: 0, thisWeek: 0, countries: 0 })
  const [dailyData, setDailyData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [pageData, setPageData] = useState([])
  const [visitLoading, setVisitLoading] = useState(true)

  // Content stats
  useEffect(() => {
    async function fetchContent() {
      const [{ count: p }, { count: c }, { count: s }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skill_categories').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
      ])
      setContentStats({ projects: p ?? 0, categories: c ?? 0, skills: s ?? 0 })
      setContentLoading(false)
    }
    fetchContent()
  }, [])

  // Visit analytics
  useEffect(() => {
    async function fetchVisits() {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const startOfWeek  = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()

      const [
        { count: total },
        { count: thisMonth },
        { count: thisWeek },
        { data: recent },
        { data: byCountry },
        { data: byPage },
      ] = await Promise.all([
        supabase.from('visits').select('*', { count: 'exact', head: true }),
        supabase.from('visits').select('*', { count: 'exact', head: true }).gte('visited_at', startOfMonth),
        supabase.from('visits').select('*', { count: 'exact', head: true }).gte('visited_at', startOfWeek),
        supabase.from('visits').select('visited_at').gte('visited_at', thirtyDaysAgo).order('visited_at'),
        supabase.from('visits').select('country').not('country', 'is', null),
        supabase.from('visits').select('page'),
      ])

      // Build 30-day chart
      const dayCounts = {}
      recent?.forEach(v => {
        const d = v.visited_at.split('T')[0]
        dayCounts[d] = (dayCounts[d] || 0) + 1
      })
      const daily = []
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().split('T')[0]
        daily.push({
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          visits: dayCounts[key] || 0,
        })
      }
      setDailyData(daily)

      // Country breakdown
      const cCounts = {}
      byCountry?.forEach(v => { cCounts[v.country] = (cCounts[v.country] || 0) + 1 })
      setCountryData(
        Object.entries(cCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
      )

      // Page breakdown
      const pCounts = {}
      byPage?.forEach(v => { pCounts[v.page] = (pCounts[v.page] || 0) + 1 })
      const pTotal = byPage?.length ?? 0
      setPageData(
        Object.entries(pCounts)
          .map(([page, count]) => ({ page, count, total: pTotal }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
      )

      setVisitStats({
        total:     total    ?? 0,
        thisMonth: thisMonth ?? 0,
        thisWeek:  thisWeek  ?? 0,
        countries: Object.keys(cCounts).length,
      })
      setVisitLoading(false)
    }
    fetchVisits()
  }, [])

  const countryMax = countryData[0]?.count ?? 1

  return (
    <div className="space-y-8 pb-8">

      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-blue-600">{user?.email?.split('@')[0]}</span>
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your portfolio.</p>
      </div>

      {/* ── Visitor stats ── */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          <i className="fas fa-chart-line mr-1.5"></i>Visitor Analytics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Visits"   value={visitStats.total}     icon="fas fa-eye"          gradient="from-blue-500 to-blue-700"    loading={visitLoading} />
          <StatCard label="This Month"     value={visitStats.thisMonth}  icon="fas fa-calendar-alt" gradient="from-purple-500 to-purple-700" loading={visitLoading} />
          <StatCard label="Last 7 Days"    value={visitStats.thisWeek}   icon="fas fa-calendar-week"gradient="from-green-500 to-green-700"   loading={visitLoading} />
          <StatCard label="Countries"      value={visitStats.countries}  icon="fas fa-globe"        gradient="from-orange-400 to-orange-600" loading={visitLoading} />
        </div>
      </section>

      {/* ── 30-day chart ── */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-800">Daily Visits</h3>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
            <i className="fas fa-circle text-[6px]"></i> Page views
          </div>
        </div>
        {visitLoading ? (
          <Skeleton className="w-full h-52" />
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="url(#lineGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Countries + Pages ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Countries */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <i className="fas fa-map-marker-alt text-blue-500"></i>
            <div>
              <h3 className="font-bold text-gray-800">Visitors by Country</h3>
              <p className="text-xs text-gray-400">Top {countryData.length} countries</p>
            </div>
          </div>
          {visitLoading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
          ) : countryData.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-globe text-gray-300 text-4xl mb-3 block"></i>
              <p className="text-gray-400 text-sm">No country data yet.</p>
              <p className="text-gray-300 text-xs mt-1">Visitors will appear here after they browse the live site.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {countryData.map((item, i) => (
                <CountryBar key={item.country} country={item.country} count={item.count} max={countryMax} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Page breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <i className="fas fa-file-alt text-purple-500"></i>
            <div>
              <h3 className="font-bold text-gray-800">Top Pages</h3>
              <p className="text-xs text-gray-400">All-time page views</p>
            </div>
          </div>
          <PageTable data={pageData} loading={visitLoading} />
        </div>
      </div>

      {/* ── Content stats ── */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          <i className="fas fa-layer-group mr-1.5"></i>Content
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Projects"   value={contentStats.projects}   icon="fas fa-laptop-code" gradient="from-blue-500 to-blue-700"    loading={contentLoading} to="/admin/projects" />
          <StatCard label="Skill Categories" value={contentStats.categories} icon="fas fa-layer-group"  gradient="from-purple-500 to-purple-700" loading={contentLoading} to="/admin/skills" />
          <StatCard label="Total Skills"     value={contentStats.skills}     icon="fas fa-code"         gradient="from-green-500 to-green-700"   loading={contentLoading} to="/admin/skills" />
        </div>
      </section>

      {/* ── Quick actions ── */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/projects" className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition group">
            <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition">
              <i className="fas fa-plus text-blue-600"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Manage Projects</p>
              <p className="text-sm text-gray-500">Add, edit, or remove projects</p>
            </div>
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition group">
            <div className="w-10 h-10 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition">
              <i className="fas fa-cog text-orange-600"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Update Profile</p>
              <p className="text-sm text-gray-500">Bio, image, contact & social links</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Live site ── */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Your portfolio is live</h3>
          <p className="text-white/70 text-sm mt-0.5">Changes you make here reflect immediately on the public site.</p>
        </div>
        <Link to="/" target="_blank" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition text-sm">
          <i className="fas fa-external-link-alt"></i> View Portfolio
        </Link>
      </div>

    </div>
  )
}
