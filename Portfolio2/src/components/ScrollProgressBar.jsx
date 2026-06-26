import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()

  // Reset to 0 whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setProgress(0)
  }, [pathname])

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full z-[60] h-[3px] bg-white/10 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-500 shadow-[0_0_8px_2px_rgba(250,204,21,0.5)]"
        style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
      />
    </div>
  )
}
