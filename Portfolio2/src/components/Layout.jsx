import { Outlet } from 'react-router-dom'
import BackToTop from './BackToTop'
import Footer from './Footer'
import Header from './Header'
import WhatsAppChatWidget from './WhatsAppChatWidget'

export default function Layout() {
  return (
    <>
      <main className="w-full overflow-hidden">
        <Header />
        <Outlet />
        <Footer />
      </main>
      <WhatsAppChatWidget />
      <BackToTop />
    </>
  )
}
