import { useRef, useState } from 'react'
import LocationMap from '../components/LocationMap'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'
import { profile } from '../data/profile'

const inputClass = [
  'w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600',
  'bg-white dark:bg-gray-700/50',
  'text-gray-900 dark:text-white',
  'placeholder-gray-400 dark:placeholder-gray-500',
  'focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none',
  'disabled:opacity-60 transition-colors duration-200',
].join(' ')

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const { profileData } = useProfile()
  const { contactAddress, phone, email, workingHours } = profileData

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const form = formRef.current
    const data = {
      name:    form.user_name.value.trim(),
      email:   form.user_email.value.trim(),
      message: form.message.value.trim(),
    }

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Something went wrong.')
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Failed to send message. Please try again.')
    }
  }

  const INFO = [
    { icon: 'fas fa-map-marker-alt', label: 'Location',      value: contactAddress },
    { icon: 'fas fa-phone',          label: 'Phone',         value: phone },
    { icon: 'fas fa-envelope',       label: 'Email',         value: email, href: email ? `mailto:${email}` : null },
    { icon: 'fas fa-clock',          label: 'Working Hours', value: workingHours },
  ].filter((i) => i.value)

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page header */}
      <div className="pt-32 pb-10 text-center">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get In Touch
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Have a project, question, or just want to say hi? I'd love to hear from you.
          </p>
        </Reveal>
      </div>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* ── Contact Form ─────────────────────────────────── */}
          <Reveal className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <h2
              className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <i className="fas fa-paper-plane text-blue-600" aria-hidden="true"></i>
              Send a Message
            </h2>

            {/* Success */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4" role="status">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i className="fas fa-check text-green-600 dark:text-green-400 text-2xl" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="user_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <i className="fas fa-user text-blue-500 mr-1.5" aria-hidden="true"></i>Name
                  </label>
                  <input
                    type="text" id="user_name" name="user_name"
                    placeholder="Your Name" required
                    disabled={status === 'sending'}
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="user_email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <i className="fas fa-envelope text-blue-500 mr-1.5" aria-hidden="true"></i>Email
                  </label>
                  <input
                    type="email" id="user_email" name="user_email"
                    placeholder="your@email.com" required
                    disabled={status === 'sending'}
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    <i className="fas fa-comment-dots text-blue-500 mr-1.5" aria-hidden="true"></i>Message
                  </label>
                  <textarea
                    id="message" name="message" rows={5}
                    placeholder="Tell me about your project or question…" required
                    disabled={status === 'sending'}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                {status === 'error' && (
                  <div role="alert" className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                    <i className="fas fa-exclamation-circle shrink-0" aria-hidden="true"></i>
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                      Sending…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" aria-hidden="true"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>

          {/* ── Info + Map ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <Reveal delay={120} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <h3
                className="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <i className="fas fa-address-book text-blue-600" aria-hidden="true"></i>
                Contact Information
              </h3>
              <ul className="space-y-3" role="list">
                {INFO.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <i className={`${item.icon} text-blue-500 mt-0.5 w-4 shrink-0`} aria-hidden="true"></i>
                    <div>
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-200 text-sm">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={240} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <h3
                className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <i className="fas fa-map text-blue-600" aria-hidden="true"></i>
                My Location
              </h3>
              <LocationMap
                lat={profile.mapLocation.lat}
                lng={profile.mapLocation.lng}
                label={profile.mapLocation.label}
              />
            </Reveal>
          </div>

        </div>
      </section>
    </div>
  )
}
