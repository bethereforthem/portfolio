import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY_FORM = {
  title: '',
  description: '',
  technologies: '',
  image: '',
  github_link: '',
  live_demo: '',
  category: 'Web',
  status: 'completed',
  completion_date: '',
}

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  planned: 'bg-gray-100 text-gray-600',
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const colors =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600'

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${colors} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-in`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`}></i>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <i className="fas fa-times"></i>
      </button>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <i className="fas fa-trash text-red-600"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Project Form Modal ────────────────────────────────────────
function ProjectFormModal({ project, onSave, onClose }) {
  const [form, setForm] = useState(
    project
      ? {
          ...project,
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(', ')
            : project.technologies ?? '',
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    return e
  }

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) {
      setErrors(e2)
      return
    }
    setSaving(true)

    const payload = {
      ...form,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    delete payload.id
    delete payload.created_at
    delete payload.updated_at

    let error
    if (project?.id) {
      ;({ error } = await supabase.from('projects').update(payload).eq('id', project.id))
    } else {
      ;({ error } = await supabase.from('projects').insert(payload))
    }

    setSaving(false)
    if (error) {
      setErrors({ submit: error.message })
    } else {
      onSave()
    }
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-sm transition'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">
            <i className={`fas ${project ? 'fa-edit' : 'fa-plus-circle'} text-blue-600 mr-2`}></i>
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input ref={titleRef} type="text" value={form.title} onChange={set('title')} placeholder="e.g. Portfolio Website" className={inputClass} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Brief description of the project…" className={inputClass} />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Technologies</label>
            <input type="text" value={form.technologies} onChange={set('technologies')} placeholder="React, Node.js, Tailwind CSS (comma-separated)" className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">Separate with commas.</p>
          </div>

          {/* Image & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={set('image')} placeholder="/images/project.png or https://…" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub Link</label>
              <input type="url" value={form.github_link} onChange={set('github_link')} placeholder="https://github.com/…" className={inputClass} />
            </div>
          </div>

          {/* Live Demo & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Live Demo URL</label>
              <input type="url" value={form.live_demo} onChange={set('live_demo')} placeholder="https://…" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={set('category')} placeholder="Web, Mobile, CLI…" className={inputClass} />
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={set('status')} className={inputClass}>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Completion Date</label>
              <input type="text" value={form.completion_date} onChange={set('completion_date')} placeholder="e.g. Jan 2025" className={inputClass} />
            </div>
          </div>

          {errors.submit && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              <i className="fas fa-exclamation-circle shrink-0"></i>
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : null}
              {project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [formProject, setFormProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  function notify(message, type = 'success') {
    setToast({ message, type })
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!error) setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  function openAdd() {
    setFormProject(null)
    setShowForm(true)
  }

  function openEdit(project) {
    setFormProject(project)
    setShowForm(true)
  }

  async function handleSave() {
    setShowForm(false)
    await fetchProjects()
    notify(formProject ? 'Project updated successfully.' : 'Project added successfully.')
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (error) {
      notify('Failed to delete project.', 'error')
    } else {
      await fetchProjects()
      notify('Project deleted.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-500 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm shadow hover:shadow-md"
        >
          <i className="fas fa-plus"></i>
          Add Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 space-y-3 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <i className="fas fa-folder-open text-gray-300 text-5xl mb-4"></i>
          <h3 className="text-gray-600 font-semibold text-lg">No projects yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">Add your first project to get started.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm"
          >
            <i className="fas fa-plus"></i>Add Project
          </button>
        </div>
      )}

      {/* Project cards */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
              {/* Image */}
              <div className="h-44 bg-gray-100 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <h3 className="font-bold text-gray-800 text-base leading-tight">{project.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[project.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {project.status}
                  </span>
                </div>

                {project.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                )}

                {/* Technologies */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition">
                      <i className="fab fa-github"></i>GitHub
                    </a>
                  )}
                  {project.live_demo && (
                    <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                      <i className="fas fa-external-link-alt"></i>Live Demo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition"
                  >
                    <i className="fas fa-edit"></i>Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                  >
                    <i className="fas fa-trash"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProjectFormModal
          project={formProject}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
