import { Link } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'
import { navLinks } from '../data/navLinks'

export default function Footer() {
  const { profileData } = useProfile()
  const { email, phone, location } = profileData
  return (
    <footer className="bg-gray-900 text-gray-300 p-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Quick Links</h2>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-yellow-300 flex items-center gap-2">
                  <i className={link.footerIcon}></i> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Contact Info</h2>
          <p className="mb-2 flex items-center gap-2">
            <i className="fa fa-envelope"></i>{' '}
            <a href={`mailto:${email}`} className="hover:text-yellow-300">
              {email}
            </a>
          </p>
          <p className="mb-2 flex items-center gap-2">
            <i className="fa fa-phone"></i> {phone}
          </p>
          <p className="mb-2 flex items-center gap-2">
            <i className="fa fa-map-marker-alt"></i> {location}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Subscribe</h2>
          <p className="mb-4">Stay updated with my latest projects.</p>
          <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded bg-gray-700 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-bold transition">
              Subscribe <i className="fa fa-paper-plane ml-2"></i>
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          <a href="#top" className="text-6xl text-yellow-400 hover:text-yellow-500 transition">
            <i className="fa fa-arrow-circle-up"></i>
          </a>
          <p className="mt-2">Back to Top</p>
        </div>
      </div>

      <div className="text-center mt-10 text-sm text-gray-500">
        &copy; 2025 David Kayigamba | All rights reserved.
      </div>
    </footer>
  )
}
