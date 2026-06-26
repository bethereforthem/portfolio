import { useEffect, useRef, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { projects as staticProjects } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

// ── Project Detail Modal ──────────────────────────────────────
function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const primaryLink = project.live_demo || project.link
  const statusColors = {
    completed:   'bg-green-100  dark:bg-green-900/40  text-green-700  dark:text-green-400',
    'in-progress':'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
    planned:     'bg-gray-100   dark:bg-gray-700       text-gray-600   dark:text-gray-300',
  }
  const statusLabel = {
    completed: 'Completed', 'in-progress': 'In Progress', planned: 'Planned',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Project details: ${project.title}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        >
          <i className="fas fa-times text-sm" aria-hidden="true"></i>
        </button>

        {/* Hero image */}
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-56 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-36 rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <i className={`${project.icon ?? 'fas fa-laptop-code'} text-white text-5xl`} aria-hidden="true"></i>
          </div>
        )}

        <div className="p-6">
          {/* Status + Category */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.status && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[project.status] ?? statusColors.completed}`}>
                {statusLabel[project.status] ?? project.status}
              </span>
            )}
            {(project.category || project.variant) && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {project.category || project.variant}
              </span>
            )}
            {project.completion_date && (
              <span className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                {project.completion_date}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {project.icon && <i className={`${project.icon} ${project.iconColor ?? ''} mr-2`} aria-hidden="true"></i>}
            {project.title}
          </h2>

          {/* Description */}
          {project.description && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{project.description}</p>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-md"
              >
                <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                Live Demo
              </a>
            )}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                <i className="fab fa-github" aria-hidden="true"></i>
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Project Card ──────────────────────────────────────────────
function ProjectCard({ project, onSelect }) {
  const primaryLink = project.live_demo || project.link

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group">
      {/* Image */}
      {project.image ? (
        <img
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          src={project.image}
          alt={project.title}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
          <i className={`${project.icon ?? 'fas fa-diagram-project'} ${project.iconColor ?? 'text-blue-400'} text-5xl`} aria-hidden="true"></i>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 flex-1">
            {project.description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((t) => (
              <span key={t} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {t}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-0.5">+{project.technologies.length - 4} more</span>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          <button
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label={`View details for ${project.title}`}
          >
            <i className="fas fa-info-circle text-xs" aria-hidden="true"></i>
            Details
          </button>
          {primaryLink && (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label={`View live demo for ${project.title}`}
            >
              <i className="fas fa-arrow-right text-xs" aria-hidden="true"></i>
              Live
            </a>
          )}
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label={`View GitHub repository for ${project.title}`}
            >
              <i className="fab fa-github text-xs" aria-hidden="true"></i>
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Projects() {
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [usingStatic, setUsingStatic] = useState(false)
  const [activeFilter, setFilter]     = useState('All')
  const [selectedProject, setSelected] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      if (!isSupabaseConfigured) {
        setUsingStatic(true)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error || !data?.length) {
        setUsingStatic(true)
      } else {
        setProjects(data)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const displayProjects = usingStatic ? staticProjects : projects

  // Build filter list from all projects
  const getCategory = (p) => p.category || p.variant || 'Other'
  const categories = ['All', ...Array.from(new Set(displayProjects.map(getCategory))).filter(Boolean)]
  const filtered = activeFilter === 'All'
    ? displayProjects
    : displayProjects.filter((p) => getCategory(p) === activeFilter)

  return (
    <>
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-gray-900 pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Reveal>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              My Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              A collection of things I've built — from web apps to developer tools.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        {/* ── Filter tabs ─────────────────────────────────── */}
        {!loading && categories.length > 1 && (
          <Reveal className="flex flex-wrap gap-2 mb-8 justify-center" role="group" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                aria-pressed={activeFilter === cat}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1.5 text-xs ${activeFilter === cat ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                    ({displayProjects.filter((p) => getCategory(p) === cat).length})
                  </span>
                )}
              </button>
            ))}
          </Reveal>
        )}

        {/* ── Skeletons ───────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Grid ────────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <Reveal key={project.id ?? project.title} delay={index * 70}>
                <ProjectCard project={project} onSelect={setSelected} />
              </Reveal>
            ))}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20" role="status">
            <i className="fas fa-folder-open text-gray-300 dark:text-gray-600 text-6xl mb-4" aria-hidden="true"></i>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {activeFilter === 'All' ? 'No projects published yet.' : `No projects in "${activeFilter}".`}
            </p>
            {activeFilter !== 'All' && (
              <button onClick={() => setFilter('All')} className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                Show all projects
              </button>
            )}
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Reveal>
          <CallToAction
            heading="Have a project in mind?"
            subtext="Whether it's a website, an app, or something experimental — I'd love to hear about it."
            buttonText="Let's Discuss It"
            to="/contact"
            icon="fas fa-lightbulb"
          />
        </Reveal>
      </div>

      {/* ── Project detail modal ─────────────────────────── */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
