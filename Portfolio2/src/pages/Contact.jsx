import { useRef, useState } from 'react'
import LocationMap from '../components/LocationMap'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'
import { profile } from '../data/profile'

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
      name: form.user_name.value.trim(),
      email: form.user_email.value.trim(),
      message: form.message.value.trim(),
    }

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong.')
      }

      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Failed to send message. Please try again.')
    }
  }

  return (
    <section className="flex-1 container mx-auto px-4 py-8 pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Reveal className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            <i className="fas fa-envelope-open-text text-blue-600"></i> Contact Us
          </h2>

          {/* Success state */}
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Message Sent!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Thanks for reaching out. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-600 mb-2 font-semibold">
                  <i className="fas fa-user text-blue-500 mr-2"></i> Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your Name"
                  required
                  disabled={status === 'sending'}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2 font-semibold">
                  <i className="fas fa-envelope text-blue-500 mr-2"></i> Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="Your Email"
                  required
                  disabled={status === 'sending'}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2 font-semibold">
                  <i className="fas fa-comment-dots text-blue-500 mr-2"></i> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Your Message"
                  required
                  disabled={status === 'sending'}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-60"
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  <i className="fas fa-exclamation-circle shrink-0"></i>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    Sending…
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>

        {/* Contact Info and Map */}
        <div className="flex flex-col gap-6">
          <Reveal delay={120} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              <i className="fas fa-address-book text-blue-600"></i> Contact Information
            </h3>
            <p className="text-gray-600 mb-2">
              <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
              <strong>Location:</strong> {contactAddress}
            </p>
            <p className="text-gray-600 mb-2">
              <i className="fas fa-phone text-blue-500 mr-2"></i>
              <strong>Phone:</strong> {phone}
            </p>
            <p className="text-gray-600 mb-2">
              <i className="fas fa-envelope text-blue-500 mr-2"></i>
              <strong>Email:</strong> {email}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-clock text-blue-500 mr-2"></i>
              <strong>Working Hours:</strong> {workingHours}
            </p>
          </Reveal>

          <Reveal delay={240} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              <i className="fas fa-map text-blue-600"></i> Our Location
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
  )
}
