import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import { emailjsConfig, profile } from '../data/profile'

export default function Contact() {
  const formRef = useRef(null)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = formRef.current

    emailjs
      .sendForm(emailjsConfig.serviceId, emailjsConfig.adminTemplateId, form, emailjsConfig.publicKey)
      .then(() => {
        emailjs
          .sendForm(emailjsConfig.serviceId, emailjsConfig.userTemplateId, form, emailjsConfig.publicKey)
          .then(() => {
            setShowSuccess(true)
            form.reset()
          })
          .catch((error) => {
            alert('User confirmation failed. ' + JSON.stringify(error))
          })
      })
      .catch((error) => {
        alert('Failed to send message. ' + JSON.stringify(error))
      })
  }

  return (
    <section className="flex-1 container mx-auto px-4 py-8 pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Reveal className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            <i className="fas fa-envelope-open-text text-blue-600"></i> Contact Us
          </h2>

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
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              <i className="fas fa-paper-plane mr-2"></i> Send Message
            </button>
          </form>

          {showSuccess && (
            <div className="mt-4 text-center font-semibold text-green-600">
              Message sent successfully! Check your email for confirmation.
            </div>
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
              <strong>Location:</strong> {profile.contactAddress}
            </p>
            <p className="text-gray-600 mb-2">
              <i className="fas fa-phone text-blue-500 mr-2"></i>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p className="text-gray-600 mb-2">
              <i className="fas fa-envelope text-blue-500 mr-2"></i>
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-clock text-blue-500 mr-2"></i>
              <strong>Working Hours:</strong> {profile.workingHours}
            </p>
          </Reveal>

          <Reveal delay={240} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              <i className="fas fa-map text-blue-600"></i> Our Location
            </h3>
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509366!2d144.9537363153167!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57798c3c9374b5!2s123%20Main%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1617196357886!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
              title="Location map"
            ></iframe>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
