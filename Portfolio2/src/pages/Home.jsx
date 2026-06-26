import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'
import { useInView } from '../hooks/useInView'

// ── Typewriter hook ───────────────────────────────────────────
const ROLES = ['Software Developer', 'React.js Developer', 'Full Stack Developer', 'Problem Solver']

function useTyping(words, typeSpeed = 90, deleteSpeed = 50, pause = 2000) {
  const [idx, setIdx]      = useState(0)
  const [text, setText]    = useState('')
  const [deleting, setDel] = useState(false)
  const timer              = useRef(null)

  useEffect(() => {
    const current = words[idx]
    timer.current = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1))
        if (text.length + 1 === current.length) {
          timer.current = setTimeout(() => setDel(true), pause)
        }
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length - 1 === 0) { setDel(false); setIdx((i) => (i + 1) % words.length) }
      }
    }, deleting ? deleteSpeed : typeSpeed)
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
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>
}

// ── Static data ───────────────────────────────────────────────
const STATS = [
  { label: 'Projects Built',   value: 10, suffix: '+' },
  { label: 'Technologies',     value: 20, suffix: '+' },
  { label: 'Years Coding',     value: 2,  suffix: '+' },
  { label: 'Certificates',     value: 5,  suffix: ''  },
]

const SERVICES = [
  {
    icon: 'fas fa-layer-group',
    title: 'Frontend Development',
    desc: 'Pixel-perfect, responsive UIs built with React and Tailwind CSS that perform on every device.',
    tags: ['React', 'Tailwind CSS', 'JavaScript'],
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'hover:border-blue-200 dark:hover:border-blue-800',
  },
  {
    icon: 'fas fa-server',
    title: 'Backend Development',
    desc: 'Scalable REST APIs and server logic with Node.js and Django, secured with modern auth patterns.',
    tags: ['Node.js', 'Django', 'REST APIs'],
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'hover:border-violet-200 dark:hover:border-violet-800',
  },
  {
    icon: 'fas fa-database',
    title: 'Database & DevOps',
    desc: 'Efficient database design and containerised deployments using Docker, MySQL, and CI/CD pipelines.',
    tags: ['MySQL', 'Docker', 'Git & GitHub'],
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'hover:border-emerald-200 dark:hover:border-emerald-800',
  },
]

const TECH = [
  { name: 'React.js',    icon: 'fab fa-react',     color: 'text-cyan-500'   },
  { name: 'JavaScript',  icon: 'fab fa-js-square',  color: 'text-yellow-400' },
  { name: 'Python',      icon: 'fab fa-python',     color: 'text-blue-400'   },
  { name: 'Node.js',     icon: 'fab fa-node-js',    color: 'text-green-500'  },
  { name: 'Tailwind CSS',icon: 'fas fa-palette',    color: 'text-indigo-400' },
  { name: 'Django',      icon: 'fab fa-python',     color: 'text-green-600'  },
  { name: 'MySQL',       icon: 'fas fa-database',   color: 'text-orange-500' },
  { name: 'Docker',      icon: 'fab fa-docker',     color: 'text-blue-500'   },
  { name: 'Git',         icon: 'fab fa-git-alt',    color: 'text-orange-400' },
  { name: 'GitHub',      icon: 'fab fa-github',     color: 'text-gray-500 dark:text-gray-300' },
]

export default function Home() {
  const { profileData, socialLinks } = useProfile()
  const { fullName, profileImage, welcomeText, email, whatsappLink, linkedin } = profileData
  const firstName = fullName?.split(' ')[0] || 'David'
  const lastName  = fullName?.split(' ').slice(1).join(' ') || 'Kayigamba'
  const role = useTyping(ROLES)

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-gray-950 pt-20"
        aria-label="Introduction"
      >
        {/* Dot-grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.18) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-500/8 dark:bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

            {/* ── TEXT COLUMN ── */}
            <div className="order-2 lg:order-1 space-y-7">

              {/* Availability pill */}
              <div className="inline-flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Available for work
              </div>

              {/* Headline */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-3">
                  Hello, I'm
                </p>
                <h1
                  className="text-5xl sm:text-6xl xl:text-[4.5rem] font-black leading-[1.04] tracking-tight text-gray-900 dark:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {firstName}
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {lastName}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 w-full h-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  </span>
                </h1>
              </div>

              {/* Role typewriter */}
              <div
                className="flex items-center gap-3 text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium h-7"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="shrink-0 w-7 h-0.5 rounded-full bg-blue-500" aria-hidden="true" />
                <span className="cursor-blink">{role}</span>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-[480px]">
                {welcomeText?.slice(0, 200) ||
                  'Passionate about crafting clean, scalable web experiences — turning ideas into products that users love.'}
                {welcomeText?.length > 200 && '…'}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 pt-1">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.03] transition-all duration-300"
                >
                  View My Work
                  <i className="fas fa-arrow-right text-sm" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3.5 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                >
                  Hire Me
                  <i className="fas fa-paper-plane text-sm" aria-hidden="true" />
                </Link>
              </div>

              {/* Social row */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mr-1">Follow</span>
                {linkedin?.url && (
                  <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200">
                    <i className="fab fa-linkedin text-sm" aria-hidden="true" />
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                    className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200">
                    <i className="fab fa-whatsapp text-sm" aria-hidden="true" />
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} aria-label="Email"
                    className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200">
                    <i className="fas fa-envelope text-sm" aria-hidden="true" />
                  </a>
                )}
                {socialLinks.slice(0, 2).map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                    className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10 hover:border-gray-400 transition-all duration-200">
                    <i className={`${link.icon} ${link.color} text-sm`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── IMAGE COLUMN ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div aria-hidden="true" className="absolute inset-6 bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl blur-3xl opacity-20 dark:opacity-15" />

                {/* Gradient border frame */}
                <div className="relative p-[3px] rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 shadow-2xl">
                  <div className="rounded-[22px] overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={profileImage || '/images/david2.png'}
                      alt={`${fullName} — Software Developer`}
                      className="w-64 h-72 sm:w-80 sm:h-96 md:w-96 md:h-[440px] object-cover"
                      onError={(e) => { e.target.src = '/images/david2.png' }}
                    />
                  </div>
                </div>

                {/* Experience card */}
                <div className="absolute -bottom-5 -left-6 bg-white dark:bg-gray-900 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl px-5 py-3.5 flex items-center gap-3.5 border border-gray-100 dark:border-gray-800">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
                    <i className="fas fa-code text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>2+</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Years coding</p>
                  </div>
                </div>

                {/* Projects card */}
                <div className="absolute -top-5 -right-6 bg-white dark:bg-gray-900 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl px-5 py-3.5 flex items-center gap-3.5 border border-gray-100 dark:border-gray-800">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <i className="fas fa-laptop-code text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>10+</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Projects built</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-blue-500 rounded-full animate-scroll-dot" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Key statistics" className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-gray-800">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="py-10 px-6 text-center">
                  <p
                    className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-1"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHAT I BUILD
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Services" className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <Reveal className="mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-3">What I Do</p>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight max-w-lg"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Building Digital Products{' '}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                From Idea to Launch
              </span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 100}>
                <div className={`group h-full ${svc.bg} rounded-2xl p-7 border border-transparent ${svc.border} hover:shadow-xl transition-all duration-300 cursor-default`}>
                  <div className={`w-13 h-13 w-12 h-12 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <i className={`${svc.icon} text-white text-lg`} aria-hidden="true" />
                  </div>
                  <h3
                    className="text-lg font-bold text-gray-900 dark:text-white mb-2.5"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{svc.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-white dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TECH MARQUEE
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Technologies" className="py-14 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Reveal>
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-10">
            Technologies I work with
          </p>
        </Reveal>
        <div className="relative">
          {/* Scrolling track — duplicated for seamless loop */}
          <div className="flex gap-5 animate-marquee whitespace-nowrap will-change-transform">
            {[...TECH, ...TECH].map((tech, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm shrink-0"
              >
                <i className={`${tech.icon} ${tech.color} text-xl`} aria-hidden="true" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
          {/* Fade masks */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VIDEO SHOWCASE
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Video introduction" className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-3">In Action</p>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              See What I Build
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">A quick look at the work I deliver</p>
          </Reveal>
          <Reveal delay={100} className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/5">
              <video
                autoPlay loop muted playsInline
                className="w-full object-cover"
                aria-label="Portfolio showcase video"
              >
                <source src="/images/david.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Call to action" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-12 md:p-16 text-center text-white shadow-2xl shadow-indigo-500/20">
              {/* Subtle dot pattern overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative z-10 max-w-2xl mx-auto">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-200 mb-4">Let's Connect</p>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Have a Project in Mind?
                </h2>
                <p className="text-indigo-100 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  I'm open to internships, freelance, and developer roles. Let's build something exceptional together.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2.5 bg-white text-indigo-700 font-black px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
                  >
                    <i className="fas fa-paper-plane" aria-hidden="true" />
                    Start a Conversation
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2.5 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/70 transition-all duration-300"
                  >
                    <i className="fas fa-folder-open" aria-hidden="true" />
                    Browse Projects
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
