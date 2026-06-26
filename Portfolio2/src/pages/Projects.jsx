import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { projects as staticProjects } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

// ── Unified project card — same Flowbite style for all projects ──
function ProjectCard({ project }) {
  // Support both Supabase shape (live_demo, github_link) and static shape (link)
  const primaryLink = project.live_demo || project.link
  const githubLink = project.github_link

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
        {/* Image */}
        {project.image ? (
          <img
            className="rounded-t-lg w-full h-48 object-cover"
            src={project.image}
            alt={project.title}
          />
        ) : (
          <div className="rounded-t-lg w-full h-48 bg-gray-100 flex items-center justify-center">
            <i className="fas fa-diagram-project text-gray-300 text-5xl"></i>
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {project.icon && <i className={`${project.icon} ${project.iconColor ?? ''} mr-2`}></i>}
            {project.title}
          </h5>

          {/* Description */}
          {project.description && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1">
              {project.description}
            </p>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap mt-auto pt-2">
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 transition"
              >
                <i className="fa-solid fa-arrow-right mr-2"></i>View project
              </a>
            )}
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-400 transition"
              >
                <i className="fab fa-github mr-2"></i>GitHub
              </a>
            )}
          </div>
        </div>
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

        {/* Project grid */}
        {!loading && displayProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <Reveal key={project.id ?? project.title} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayProjects.length === 0 && (
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
