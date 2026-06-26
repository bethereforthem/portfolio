import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated 404 number */}
        <div className="relative mb-6">
          <p
            className="text-[10rem] font-black leading-none select-none"
            style={{
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-hidden="true"
          >
            404
          </p>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-home" aria-hidden="true"></i>
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-semibold hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
          >
            <i className="fas fa-envelope" aria-hidden="true"></i>
            Contact Me
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick links
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: '/about',    label: 'About',    icon: 'fas fa-user' },
              { to: '/projects', label: 'Projects', icon: 'fas fa-laptop-code' },
              { to: '/skills',   label: 'Skills',   icon: 'fas fa-code' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <i className={`${link.icon} text-xs`} aria-hidden="true"></i>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
