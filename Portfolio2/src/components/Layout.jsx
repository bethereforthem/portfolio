import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { trackVisit } from '../lib/trackVisit'
import { navLinks } from '../data/navLinks'
import BackToTop from './BackToTop'
import Footer from './Footer'
import Header from './Header'
import ScrollProgressBar from './ScrollProgressBar'
import WhatsAppChatWidget from './WhatsAppChatWidget'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [nextPageLabel, setNextPageLabel] = useState(null)
  const timerRef = useRef(null)
  const triggeredRef = useRef(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    trackVisit(location.pathname)
  }, [location.pathname])

  // Scroll to top and reset trigger on every route change
  useEffect(() => {
    window.scrollTo(0, 0)
    triggeredRef.current = false
    setNextPageLabel(null)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [location.pathname])

  // Auto-navigate to the next page when the footer sentinel enters the viewport
  useEffect(() => {
    const currentIndex = navLinks.findIndex(l =>
      l.path === '/' ? location.pathname === '/' : location.pathname.startsWith(l.path)
    )
    // Only for known nav pages that have a next destination
    if (currentIndex < 0 || currentIndex >= navLinks.length - 1) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true
          const next = navLinks[currentIndex + 1]
          setNextPageLabel(next.label)
          timerRef.current = setTimeout(() => navigate(next.path), 900)
        }
      },
      { threshold: 0 }
    )

    // Delay before watching so the observer doesn't fire immediately on page load
    // when the footer happens to be visible before the user has scrolled at all.
    const activationId = setTimeout(() => observer.observe(sentinel), 800)

    return () => {
      clearTimeout(activationId)
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ScrollProgressBar />
      <Header />
      <main className="w-full overflow-hidden">
        <Outlet />
      </main>

      {/* Sentinel: becomes visible exactly when the footer enters the viewport */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <Footer />
      <WhatsAppChatWidget />
      <BackToTop />

      {/* Toast that appears 900 ms before auto-navigation fires */}
      {nextPageLabel && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up bg-gray-950/95 text-white px-6 py-3.5 rounded-full shadow-2xl text-sm font-semibold flex items-center gap-3 border border-white/10 backdrop-blur-sm pointer-events-none">
          <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shrink-0" />
          Going to {nextPageLabel}…
        </div>
      )}
    </div>
  )
}
