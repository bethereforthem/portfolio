import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { projects as staticProjects } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const STATUS_LABELS = {
  completed: { label: 'Completed', bg: 'bg-green-100 text-green-700' },
  'in-progress': { label: 'In Progress', bg: 'bg-yellow-100 text-yellow-700' },
  planned: { label: 'Planned', bg: 'bg-gray-100 text-gray-500' },
}

// ── Public project card (admin-managed projects from Supabase) ──
function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-diagram-project text-gray-300 text-5xl"></i>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-800 leading-tight">{project.title}</h3>
          {project.status && STATUS_LABELS[project.status] && (
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[project.status].bg}`}>
              {STATUS_LABELS[project.status].label}
            </span>
          )}
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description}</p>
        )}

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((t) => (
              <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 mt-auto flex-wrap">
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
            >
              <i className="fab fa-github"></i>GitHub
            </a>
          )}
          {project.live_demo && (
            <a
              href={project.live_demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              <i className="fas fa-external-link-alt"></i>Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Static project card (keeps original design for legacy items) ──
function StaticProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="h-48 bg-gray-100 overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-diagram-project text-gray-300 text-5xl"></i>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {project.icon && <i className={`${project.icon} ${project.iconColor} mr-2`}></i>}
          {project.title}
        </h3>
        {project.description && <p className="text-gray-600 text-sm mb-4 flex-1">{project.description}</p>}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition self-start mt-auto"
          >
            <i className="fas fa-external-link-alt"></i>View Project
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingStatic, setUsingStatic] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      if (!isSupabaseConfigured) {
        setUsingStatic(true)
        setProjects([])
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
        setProjects([])
      } else {
        setProjects(data)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const displayProjects = usingStatic ? [] : projects

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-laptop-code text-blue-600 mr-2"></i>My Projects
        </h1>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Supabase projects */}
        {!loading && !usingStatic && displayProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Static fallback projects */}
        {!loading && usingStatic && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 80}>
                <StaticProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !usingStatic && displayProjects.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-folder-open text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-lg font-medium">No projects published yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-12">
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
    </>
  )
}
