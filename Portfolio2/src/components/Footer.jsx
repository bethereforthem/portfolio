import { Link } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'
import { navLinks } from '../data/navLinks'

export default function Footer() {
  const { profileData, socialLinks } = useProfile()
  const { email, phone, location, linkedin } = profileData

  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                David K.
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
              {socialLinks.map((link) => (
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
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription"
            >
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="px-3 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2.5 rounded-lg font-bold text-sm transition-colors duration-200"
              >
                Subscribe <i className="fas fa-paper-plane ml-1.5" aria-hidden="true"></i>
              </button>
            </form>
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
