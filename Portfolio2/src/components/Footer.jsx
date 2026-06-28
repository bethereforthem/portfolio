import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'
import { navLinks } from '../data/navLinks'

export default function Footer() {
  const { profileData, socialLinks } = useProfile()
  const { email, phone, location, linkedin, fullName } = profileData
  const initials = (fullName || 'David Kayigamba').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const firstName = fullName?.split(' ')[0] || 'David'
  const lastInitial = fullName?.split(' ')[1]?.[0] || 'K'

  const year = new Date().getFullYear()

  const [subEmail, setSubEmail] = useState('')
  const [subStatus, setSubStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [subMessage, setSubMessage] = useState('')

  async function handleSubscribe(e) {
    e.preventDefault()
    const trimmed = subEmail.trim()
    if (!trimmed) return

    setSubStatus('loading')
    setSubMessage('')
    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubStatus('success')
        setSubMessage("You're subscribed! Thanks for joining.")
        setSubEmail('')
      } else {
        setSubStatus('error')
        setSubMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubStatus('error')
      setSubMessage('Network error. Please check your connection.')
    }
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-sm font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {initials}
                </span>
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {firstName} <span className="text-yellow-400">{lastInitial}.</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Software developer from Rwanda, passionate about building impactful digital solutions.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-2" aria-label="Social media links">
              {linkedin?.url && (
                <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                  <i className="fab fa-linkedin text-sm" aria-hidden="true"></i>
                </a>
              )}
              {profileData.whatsappLink && (
                <a href={profileData.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center transition-colors duration-200">
                  <i className="fab fa-whatsapp text-sm" aria-hidden="true"></i>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} aria-label="Email"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-colors duration-200">
                  <i className="fas fa-envelope text-sm" aria-hidden="true"></i>
                </a>
              )}
              {socialLinks
                .filter(l => !l.url?.toLowerCase().includes('linkedin'))
                .map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                  <i className={`${link.icon} ${link.color} text-sm`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">Quick Links</h2>
            <ul className="space-y-2.5" role="list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="flex items-center gap-2 text-sm hover:text-yellow-300 transition-colors duration-200">
                    <i className={`${link.footerIcon} text-xs w-4`} aria-hidden="true"></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">Contact</h2>
            <ul className="space-y-2.5 text-sm" role="list">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200">
                    <i className="fas fa-envelope text-xs w-4 shrink-0" aria-hidden="true"></i>
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone text-xs w-4 shrink-0" aria-hidden="true"></i>
                  {phone}
                </li>
              )}
              {location && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-xs w-4 shrink-0" aria-hidden="true"></i>
                  {location}
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400 mb-4">Stay Updated</h2>
            <p className="text-sm text-gray-400 mb-4">Get notified when I publish new projects or write about tech.</p>

            {subStatus === 'success' ? (
              <div className="flex items-start gap-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl px-4 py-3.5">
                <i className="fas fa-check-circle text-emerald-400 mt-0.5 shrink-0" aria-hidden="true"></i>
                <p className="text-sm text-emerald-300 font-medium">{subMessage}</p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubscribe}
                aria-label="Newsletter subscription"
              >
                <input
                  type="email"
                  value={subEmail}
                  onChange={e => { setSubEmail(e.target.value); if (subStatus === 'error') setSubStatus('idle') }}
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  required
                  disabled={subStatus === 'loading'}
                  className="px-3 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition disabled:opacity-50"
                />
                {subStatus === 'error' && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                    {subMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 py-2.5 rounded-lg font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {subStatus === 'loading' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    <>
                      Subscribe <i className="fas fa-paper-plane" aria-hidden="true"></i>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {year} David Kayigamba. All rights reserved.</p>
          <p>Designed &amp; developed by David Kayigamba</p>
        </div>
      </div>
    </footer>
  )
}
