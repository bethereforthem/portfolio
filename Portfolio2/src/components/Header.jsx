import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useProfile } from '../contexts/ProfileContext'
import { navLinks } from '../data/navLinks'

function useClickAway(ref, onAway) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onAway()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, onAway])
}

function desktopLinkClass({ isActive }) {
  const base = 'relative flex items-center gap-1.5 px-1 py-0.5 transition-all duration-200'
  if (isActive) {
    return `${base} text-yellow-300 font-bold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:rounded-full after:bg-yellow-300`
  }
  return `${base} text-white/90 hover:text-yellow-300`
}

function mobileLinkClass({ isActive }) {
  const base = 'flex items-center gap-2 w-full px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold'
  if (isActive) {
    return `${base} bg-white/20 text-yellow-300 shadow-inner`
  }
  return `${base} text-white hover:bg-white/10 hover:text-yellow-300`
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileContactOpen, setMobileContactOpen] = useState(false)

  const contactRef = useRef(null)
  const menuRef = useRef(null)

  useClickAway(contactRef, () => setContactOpen(false))
  useClickAway(menuRef, () => setIsOpen(false))

  const { profileData } = useProfile()
  const { name, email, whatsappLink } = profileData

  return (
    <header className="fixed w-full top-0 left-0 bg-gradient-to-r from-blue-700 to-purple-600 dark:from-gray-950 dark:to-gray-900 text-white pt-[3px] shadow-lg dark:shadow-gray-900/80 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between py-4 px-8">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-full shadow-md" />
          <span className="text-2xl font-bold">{name}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 text-lg font-semibold">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={desktopLinkClass}
            >
              <i className={link.headerIcon}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle (desktop) */}
        <ThemeToggle className="hidden md:flex" />

        {/* Desktop Text Me */}
        <div className="hidden md:flex items-center relative" ref={contactRef}>
          <button
            onClick={() => setContactOpen((open) => !open)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold focus:outline-none transition-colors"
          >
            <i className="fas fa-comments"></i> Text Me
            <i className={`fas fa-caret-${contactOpen ? 'up' : 'down'}`}></i>
          </button>

          {contactOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-xl py-2 z-10">
              <a href={`mailto:${email}`} className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                <i className="fas fa-envelope text-blue-500 mr-2"></i> Email
              </a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                <i className="fab fa-whatsapp text-green-500 mr-2"></i> WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Hamburger + mobile theme toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setIsOpen((open) => !open)} className="focus:outline-none p-1" aria-label="Toggle menu" aria-expanded={isOpen} aria-controls="mobile-menu">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden bg-gradient-to-b from-blue-700 to-purple-700 dark:from-gray-950 dark:to-gray-900 text-white rounded-b-2xl shadow-lg dark:shadow-gray-900/80 flex flex-col items-stretch gap-1 px-4 pb-5 pt-2 z-40 transition-colors duration-300"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setIsOpen(false)}
              className={mobileLinkClass}
            >
              <i className={`${link.headerIcon} w-5 text-center`}></i>
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Text Me */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <button
              onClick={() => setMobileContactOpen((open) => !open)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-full font-semibold focus:outline-none transition-colors"
            >
              <i className="fas fa-comments"></i> Text Me
              <i className={`fas fa-caret-${mobileContactOpen ? 'up' : 'down'}`}></i>
            </button>

            {mobileContactOpen && (
              <div className="flex flex-col items-stretch bg-white text-black rounded-xl shadow-lg w-48 py-2">
                <a href={`mailto:${email}`} className="flex items-center px-4 py-2.5 hover:bg-gray-100 transition-colors">
                  <i className="fas fa-envelope text-blue-500 mr-2"></i> Email Me
                </a>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2.5 hover:bg-gray-100 transition-colors">
                  <i className="fab fa-whatsapp text-green-500 mr-2"></i> WhatsApp Me
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
