import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks } from '../data/navLinks'
import { profile } from '../data/profile'

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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileContactOpen, setMobileContactOpen] = useState(false)

  const contactRef = useRef(null)
  const menuRef = useRef(null)

  useClickAway(contactRef, () => setContactOpen(false))
  useClickAway(menuRef, () => setIsOpen(false))

  return (
    <header className="fixed w-full top-0 left-0 bg-gradient-to-r from-blue-700 to-purple-600 text-white py-4 px-8 shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-full shadow-md" />
          <span className="text-2xl font-bold">{profile.name}</span>
        </div>

        <nav className="hidden md:flex space-x-8 text-lg font-semibold">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-yellow-300 flex items-center gap-1">
              <i className={link.headerIcon}></i> {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center relative" ref={contactRef}>
          <button
            onClick={() => setContactOpen((open) => !open)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold focus:outline-none"
          >
            <i className="fas fa-comments"></i> Text Me
            <i className="fas fa-caret-down"></i>
          </button>

          {contactOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2">
              <a href={`mailto:${profile.email}`} className="flex items-center px-4 py-2 hover:bg-gray-200">
                <i className="fas fa-envelope text-blue-500 mr-2"></i> Email
              </a>
              <a href={profile.whatsappLink} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 hover:bg-gray-200">
                <i className="fab fa-whatsapp text-green-500 mr-2"></i> WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen((open) => !open)} className="focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {!isOpen && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
              )}
              {isOpen && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-gradient-to-r from-blue-700 to-purple-600 text-white rounded-b-xl shadow-lg flex flex-col items-center space-y-4 py-6 text-lg font-semibold z-40 mt-4"
        >
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-yellow-300 flex items-center gap-2">
              <i className={link.headerIcon}></i> {link.label}
            </Link>
          ))}

          <div className="w-full flex flex-col items-center space-y-2">
            <button
              onClick={() => setMobileContactOpen((open) => !open)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold focus:outline-none"
            >
              <i className="fas fa-comments"></i> Text Me
              <i className="fas fa-caret-down"></i>
            </button>

            {mobileContactOpen && (
              <div className="flex flex-col items-center bg-white text-black rounded-lg shadow-lg w-48 py-2 mt-2">
                <a href={`mailto:${profile.email}`} className="flex items-center px-4 py-2 hover:bg-gray-200 w-full">
                  <i className="fas fa-envelope text-blue-500 mr-2"></i> Email Me
                </a>
                <a href={profile.whatsappLink} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 hover:bg-gray-200 w-full">
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
