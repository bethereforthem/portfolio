import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'
import { useInView } from '../hooks/useInView'

// ── Typing animation ──────────────────────────────────────────
const ROLES = [
  'Software Developer',
  'React.js Developer',
  'Full Stack Developer',
  'Problem Solver',
]

function useTyping(words, typeSpeed = 100, deleteSpeed = 55, pause = 2200) {
  const [idx, setIdx]         = useState(0)
  const [text, setText]       = useState('')
  const [deleting, setDel]    = useState(false)
  const timer                 = useRef(null)

  useEffect(() => {
    const current = words[idx]
    const delay   = deleting ? deleteSpeed : typeSpeed

    timer.current = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1))
        if (text.length + 1 === current.length) {
          timer.current = setTimeout(() => setDel(true), pause)
        }
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length - 1 === 0) {
          setDel(false)
          setIdx((i) => (i + 1) % words.length)
        }
      }
    }, delay)

    return () => clearTimeout(timer.current)
  }, [text, deleting, idx, words, typeSpeed, deleteSpeed, pause])

  return text
}

// ── Animated counter ──────────────────────────────────────────
function AnimatedCounter({ target, suffix = '+', duration = 1800 }) {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const startAt = Date.now()
    function tick() {
      const elapsed  = Date.now() - startAt
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>
}

// ── Static data ───────────────────────────────────────────────
const STATS = [
  { label: 'Projects Built',    value: 10, icon: 'fas fa-laptop-code',   color: 'text-blue-500   dark:text-blue-400' },
  { label: 'Technologies',      value: 20, icon: 'fas fa-code',           color: 'text-purple-500 dark:text-purple-400' },
  { label: 'Years Experience',  value: 2,  icon: 'fas fa-calendar-alt',   color: 'text-green-500  dark:text-green-400' },
  { label: 'Certificates',      value: 5,  icon: 'fas fa-certificate',    color: 'text-yellow-500 dark:text-yellow-400' },
]

const TECH_STACK = [
  { name: 'React.js',    icon: 'fab fa-react',      color: 'text-cyan-500' },
  { name: 'JavaScript',  icon: 'fab fa-js-square',  color: 'text-yellow-500' },
  { name: 'Python',      icon: 'fab fa-python',     color: 'text-blue-500' },
  { name: 'Node.js',     icon: 'fab fa-node-js',    color: 'text-green-600' },
  { name: 'Tailwind',    icon: 'fas fa-palette',    color: 'text-indigo-400' },
  { name: 'Django',      icon: 'fab fa-python',     color: 'text-green-700' },
  { name: 'MySQL',       icon: 'fas fa-database',   color: 'text-orange-600' },
  { name: 'Docker',      icon: 'fab fa-docker',     color: 'text-blue-400' },
  { name: 'Git',         icon: 'fab fa-git-alt',    color: 'text-orange-500' },
  { name: 'GitHub',      icon: 'fab fa-github',     color: 'text-gray-600 dark:text-gray-300' },
]

export default function Home() {
  const { profileData, socialLinks } = useProfile()
  const { fullName, profileImage, welcomeText, email, whatsappLink, linkedin } = profileData
  const firstName = fullName?.split(' ')[0] || 'David'
  const role = useTyping(ROLES)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="hero-gradient min-h-screen flex items-center pt-20 overflow-hidden relative"
        aria-label="Introduction"
      >
        {/* Decorative blobs */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Text ── */}
            <div className="text-white order-2 lg:order-1 space-y-6">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 backdrop-blur-sm w-fit">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
                Open to opportunities
              </div>

              {/* Name */}
              <h1
                className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Hi, I'm{' '}
                <span className="text-yellow-400">{firstName}</span>
              </h1>

              {/* Typing role */}
              <div className="text-xl md:text-2xl text-blue-200 h-8 flex items-center" aria-live="polite" aria-atomic="true">
                <span className="cursor-blink font-medium">{role}</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
                {welcomeText?.slice(0, 200) ||
                  'Passionate software developer from Rwanda, building modern web solutions that make a real impact.'}
                {welcomeText?.length > 200 && '…'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-1">
                <Link to="/projects" className="btn-primary">
                  <i className="fas fa-laptop-code" aria-hidden="true"></i>
                  My Projects
                </Link>
                <Link to="/contact" className="btn-outline-white">
                  <i className="fas fa-paper-plane" aria-hidden="true"></i>
                  Hire Me
                </Link>
              </div>

              {/* Social quick-links */}
              <div className="flex items-center gap-3 pt-1" aria-label="Social links">
                <span className="text-gray-400 text-sm font-medium">Connect:</span>
                {linkedin?.url && (
                  <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-colors duration-200">
                    <i className="fab fa-linkedin text-sm" aria-hidden="true"></i>
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-600 flex items-center justify-center transition-colors duration-200">
                    <i className="fab fa-whatsapp text-sm" aria-hidden="true"></i>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} aria-label="Send email"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-colors duration-200">
                    <i className="fas fa-envelope text-sm" aria-hidden="true"></i>
                  </a>
                )}
                {socialLinks.slice(0, 2).map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200">
                    <i className={`${link.icon} ${link.color} text-sm`} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Profile image ── */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {/* Ambient glow */}
                <div aria-hidden="true" className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl scale-110 pointer-events-none"></div>
                {/* Gradient ring */}
                <div className="relative p-1 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400">
                  <div className="p-1 rounded-full bg-gray-900">
                    <img
                      src={profileImage || '/images/david2.png'}
                      alt={`Profile photo of ${fullName}`}
                      className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover"
                      onError={(e) => { e.target.src = '/images/david2.png' }}
                    />
                  </div>
                </div>
                {/* Floating badges */}
                <div aria-hidden="true"
                  className="absolute -bottom-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float whitespace-nowrap">
                  <i className="fab fa-react mr-1"></i>React Dev
                </div>
                <div aria-hidden="true"
                  className="absolute -top-3 -left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float-delay whitespace-nowrap">
                  <i className="fas fa-code mr-1"></i>Full Stack
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs animate-bounce pointer-events-none">
          <span>Scroll</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section aria-label="Key statistics" className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <Reveal key={stat.label} className="text-center">
                <p className={`text-3xl md:text-4xl font-bold ${stat.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <AnimatedCounter target={stat.value} />
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
                  <i className={`${stat.icon} text-xs`} aria-hidden="true"></i>
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────── */}
      <section aria-label="Technologies I use" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-10">
              Technologies I work with
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3" role="list">
            {TECH_STACK.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 35}>
                <span
                  role="listitem"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all duration-300 cursor-default"
                >
                  <i className={`${tech.icon} ${tech.color} text-base`} aria-hidden="true"></i>
                  {tech.name}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video ─────────────────────────────────────────────── */}
      <section aria-label="Video introduction" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-8">
            <h2 className="section-heading mb-2">See Me in Action</h2>
            <p className="text-gray-500 dark:text-gray-400">A quick glimpse into what I build</p>
          </Reveal>
          <Reveal delay={100} className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
              <video
                autoPlay loop muted playsInline
                className="w-full object-cover"
                aria-label="Portfolio showcase video"
              >
                <source src="/images/david.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-500/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Let's Build Something Amazing
              </h2>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                I'm open to internships, freelance work, and junior developer roles worldwide.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3 rounded-full hover:scale-105 transition-transform shadow-md"
                >
                  <i className="fas fa-comments" aria-hidden="true"></i>
                  Get In Touch
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  <i className="fas fa-laptop-code" aria-hidden="true"></i>
                  View My Work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
