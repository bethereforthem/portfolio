import { useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { placeholderProjectCount, projects } from '../data/profile'

function ProjectCard({ project }) {
  if (project.variant === 'card') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg" src={project.image} alt={project.title} />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <i className={`${project.icon} ${project.iconColor} mr-2`}></i>
                {project.title}
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <i className="fa-solid fa-arrow-right mr-2"></i> View project
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (project.variant === 'currency') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <img src={project.image} alt={project.title} className="w-full h-90 object-cover rounded-lg shadow-sm" />
        <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <i className={`${project.icon} ${project.iconColor}`}></i>
          {project.title}
        </h3>
        <p className="text-gray-600 text-xl">{project.description}</p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <i className="fa fa-link mr-2"></i>
          View Project
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <img src={project.image} alt="To-Do List Project Screenshot" className="w-full max-w-md rounded-lg shadow" />
      <h3 className="text-2xl font-bold text-indigo-700">{project.title}</h3>
      <p className="text-gray-700 text-base">{project.description}</p>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        🔗 View Project
      </a>
    </div>
  )
}

function CustomProjectCard({ project, onRemove }) {
  return (
    <div className="relative bg-white p-6 pt-10 rounded-xl shadow-lg flex flex-col items-center text-center space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <span className="absolute top-3 left-3 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
        <i className="fas fa-user mr-1"></i> Added by you
      </span>
      <button
        type="button"
        onClick={() => onRemove(project.id)}
        aria-label="Remove project"
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
      >
        <i className="fas fa-times"></i>
      </button>

      {project.image ? (
        <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg shadow-sm" />
      ) : (
        <div className="w-full h-48 flex items-center justify-center rounded-lg bg-gray-100">
          <i className="fa-solid fa-diagram-project text-gray-400 text-5xl"></i>
        </div>
      )}

      <h3 className="text-2xl font-bold text-blue-700">{project.title}</h3>
      {project.description && <p className="text-gray-600">{project.description}</p>}

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <i className="fa fa-link mr-2"></i>
          View Project
        </a>
      )}
    </div>
  )
}

function AddProjectForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || !link.trim()) {
      setError('Title and project link are required.')
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      link: link.trim(),
    })

    setTitle('')
    setDescription('')
    setImage('')
    setLink('')
    setError('')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          <i className="fas fa-plus-circle text-blue-600 mr-2"></i> Add a New Project
        </h3>
        <button type="button" onClick={onClose} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Project Title *"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="url"
          placeholder="Project Link *"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none md:col-span-2"
        />
        <textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="3"
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none md:col-span-2"
        ></textarea>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-gray-400 max-w-md">
          <i className="fas fa-info-circle mr-1"></i>
          Saved to this browser only — it won't appear for other visitors of your live site.
        </p>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
        >
          <i className="fas fa-check mr-2"></i> Add Project
        </button>
      </div>
    </form>
  )
}

export default function Projects() {
  const [customProjects, setCustomProjects] = useLocalStorage('portfolio:customProjects', [])
  const [formOpen, setFormOpen] = useState(false)

  function handleAdd(project) {
    setCustomProjects((current) => [...current, project])
  }

  function handleRemove(id) {
    setCustomProjects((current) => current.filter((project) => project.id !== id))
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-4 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-laptop-code text-blue-600 mr-2"></i> My Projects
        </h1>
        <button
          type="button"
          onClick={() => setFormOpen((open) => !open)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-transform hover:scale-105"
        >
          <i className={`fas ${formOpen ? 'fa-minus' : 'fa-plus'}`}></i>
          {formOpen ? 'Close Form' : 'Add Project'}
        </button>
      </div>

      {formOpen && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <AddProjectForm onAdd={handleAdd} onClose={() => setFormOpen(false)} />
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 80}>
            <ProjectCard project={project} />
          </Reveal>
        ))}

        {customProjects.map((project, index) => (
          <Reveal key={project.id} delay={(projects.length + index) * 80}>
            <CustomProjectCard project={project} onRemove={handleRemove} />
          </Reveal>
        ))}

        {Array.from({ length: placeholderProjectCount }).map((_, index) => (
          <Reveal
            key={index}
            delay={(projects.length + customProjects.length + index) * 40}
            className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <i className="fa-solid fa-gears text-gray-500 text-4xl mb-2"></i>
            Under Development
          </Reveal>
        ))}
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
