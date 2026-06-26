import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { trackVisit } from '../lib/trackVisit'
import BackToTop from './BackToTop'
import Footer from './Footer'
import Header from './Header'
import ScrollProgressBar from './ScrollProgressBar'
import WhatsAppChatWidget from './WhatsAppChatWidget'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    trackVisit(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ScrollProgressBar />
      <Header />
      <main className="w-full overflow-hidden">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppChatWidget />
      <BackToTop />
    </div>
  )
}
