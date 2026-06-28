import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'
import { useInView } from '../hooks/useInView'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { projects as localProjects } from '../data/profile'

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

// ── Featured projects hook ────────────────────────────────────
const LOCAL_FALLBACK = localProjects.slice(0, 3).map((p, i) => ({
  id: i,
  title: p.title,
  description: p.description,
  image: p.image,
  live_demo: p.link,
  category: 'Web',
  technologies: 'HTML, CSS, JavaScript',
}))

function useFeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    if (!isSupabaseConfigured) {
      setProjects(LOCAL_FALLBACK)
      setLoading(false)
      return
    }

    async function load() {
      try {
        const { data } = await supabase
          .from('projects')
          .select('id, title, description, technologies, image, live_demo, github_link, category')
          .order('created_at', { ascending: false })
          .limit(3)
        if (!cancelled) setProjects(data?.length ? data : LOCAL_FALLBACK)
      } catch {
        if (!cancelled) setProjects(LOCAL_FALLBACK)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { projects, loading }
}

// ── Hero slides data ──────────────────────────────────────────
const SLIDE_DURATION = 6000

const SLIDES = [
  {
    bgColor: '#0a0a1a',
    eyebrow: "Hello, I'm",
    showName: true,
    showRole: true,
    sub: 'Software developer from Rwanda — I turn ideas into production-ready digital products with React, Node.js, Python, and modern DevOps tools.',
    chips: ['React.js', 'Node.js', 'Python', 'Docker'],
    accent: 'from-blue-400 via-violet-400 to-purple-400',
    ctas: [
      { to: '/projects', label: 'View My Work', icon: 'fas fa-arrow-right' },
      { to: '/contact',  label: 'Hire Me',      icon: 'fas fa-paper-plane' },
    ],
  },
  {
    bgColor: '#011a10',
    eyebrow: 'My Passion',
    headline: ['Code That', 'Changes Lives'],
    sub: 'I believe software is the most powerful tool of our generation. Every project I take on is driven by purpose — building systems that empower people and solve real-world problems.',
    chips: ['Problem Solver', 'Lifelong Learner', 'User-First Design'],
    accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    ctas: [
      { to: '/about',  label: 'My Story',  icon: 'fas fa-user' },
      { to: '/skills', label: 'My Skills', icon: 'fas fa-code' },
    ],
  },
  {
    bgColor: '#120a2e',
    eyebrow: 'What I Build',
    headline: ['Full Stack', 'Solutions'],
    sub: 'From pixel-perfect frontends to robust REST APIs and containerised deployments — I architect and ship the complete product, end to end. Driven by 3+ years of dedicated learning and real-world projects.',
    chips: ['Frontend', 'Backend', 'DevOps', 'Databases'],
    accent: 'from-violet-400 via-purple-400 to-pink-400',
    ctas: [
      { to: '/projects', label: 'See Projects', icon: 'fas fa-laptop-code' },
      { to: '/skills',   label: 'Tech Stack',   icon: 'fas fa-layer-group' },
    ],
  },
]

// ── Static data ───────────────────────────────────────────────
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
  { name: 'React.js',     icon: 'fab fa-react',     color: 'text-cyan-500'   },
  { name: 'JavaScript',   icon: 'fab fa-js-square',  color: 'text-yellow-400' },
  { name: 'Python',       icon: 'fab fa-python',     color: 'text-blue-400'   },
  { name: 'Node.js',      icon: 'fab fa-node-js',    color: 'text-green-500'  },
  { name: 'Tailwind CSS', icon: 'fas fa-palette',    color: 'text-indigo-400' },
  { name: 'Django',       icon: 'fab fa-python',     color: 'text-green-600'  },
  { name: 'MySQL',        icon: 'fas fa-database',   color: 'text-orange-500' },
  { name: 'Docker',       icon: 'fab fa-docker',     color: 'text-blue-500'   },
  { name: 'Git',          icon: 'fab fa-git-alt',    color: 'text-orange-400' },
  { name: 'GitHub',       icon: 'fab fa-github',     color: 'text-gray-500 dark:text-gray-300' },
]

export default function Home() {
  const { profileData, socialLinks } = useProfile()
  const {
    fullName, profileImage, welcomeText, email, whatsappLink, linkedin,
    projectsCount, technologiesCount, yearsCoding, certificates,
  } = profileData
  const firstName = fullName?.split(' ')[0] || 'David'
  const lastName  = fullName?.split(' ').slice(1).join(' ') || 'Kayigamba'

  const { projects: featuredProjects, loading: featuredLoading } = useFeaturedProjects()

  // ── Hero carousel state ───────────────────────────────────────
  const [slide, setSlide] = useState(0)
  const [slideKey, setSlideKey] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  const goToSlide = useCallback((i) => {
    setSlide(i)
    setSlideKey(k => k + 1)
  }, [])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setSlide(s => {
        const next = (s + 1) % SLIDES.length
        setSlideKey(k => k + 1)
        return next
      })
    }, SLIDE_DURATION)
    return () => clearInterval(intervalRef.current)
  }, [paused])

  const s = SLIDES[slide]

  const STATS = [
    { label: 'Projects Built',  value: projectsCount    || 0,  suffix: '+' },
    { label: 'Technologies',    value: technologiesCount || 0,  suffix: '+' },
    { label: 'Years Coding',    value: yearsCoding       || 2,  suffix: '+' },
    { label: 'Certificates',    value: certificates      || 5,  suffix: ''  },
  ]

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO — full-bleed immersive carousel
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundColor: s.bgColor, transition: 'background-color 0.9s ease' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Introduction"
      >
        {/* ── Profile image — full bleed background ── */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={profileImage || '/images/david2.png'}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Per-slide gradient overlays (fade in/out) ── */}
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{
              opacity: i === slide ? 1 : 0,
              background: `linear-gradient(to right, ${sl.bgColor} 0%, ${sl.bgColor}f0 25%, ${sl.bgColor}cc 45%, ${sl.bgColor}77 65%, ${sl.bgColor}22 80%, transparent 100%)`,
            }}
          />
        ))}

        {/* ── Top vignette (header area) ── */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        {/* ── Bottom vignette (controls area) ── */}
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* ── Slide content ── */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center container mx-auto px-6 lg:px-14 pt-28 pb-36">
          <div key={slideKey} className="max-w-xl space-y-5">

            {/* Eyebrow */}
            <p
              className="text-xs font-bold uppercase tracking-[0.35em] text-white/60 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              {s.eyebrow}
            </p>

            {/* Headline */}
            {s.showName ? (
              <h1
                className="text-5xl sm:text-6xl xl:text-[5.5rem] font-black leading-[1.04] text-white animate-fade-in-up"
                style={{ fontFamily: 'Poppins, sans-serif', animationDelay: '60ms' }}
              >
                {firstName}
                <br />
                <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                  {lastName}
                </span>
              </h1>
            ) : (
              <h1
                className="text-5xl sm:text-6xl xl:text-[5.5rem] font-black leading-[1.04] text-white animate-fade-in-up"
                style={{ fontFamily: 'Poppins, sans-serif', animationDelay: '60ms' }}
              >
                {s.headline[0]}
                <br />
                <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                  {s.headline[1]}
                </span>
              </h1>
            )}

            {/* Professional role display (slide 1 only) */}
            {s.showRole && (
              <div
                className="flex items-stretch gap-3.5 animate-fade-in-up"
                style={{ animationDelay: '110ms' }}
              >
                {/* Vertical gradient accent bar */}
                <div className={`w-[3px] rounded-full bg-gradient-to-b ${s.accent} shrink-0`} aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xl md:text-2xl font-black text-white tracking-tight leading-none"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Software Engineer
                  </span>
                  <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.22em]">
                    Full Stack Developer · React Specialist
                  </span>
                </div>
              </div>
            )}

            {/* Sub text */}
            <p
              className="text-white/75 text-base md:text-lg leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              {s.sub}
            </p>

            {/* Skill chips */}
            <div
              className="flex flex-wrap gap-2 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {s.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3.5 py-1 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold rounded-full backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-4 pt-1 animate-fade-in-up"
              style={{ animationDelay: '260ms' }}
            >
              <Link
                to={s.ctas[0].to}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${s.accent} text-gray-950 font-black px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.04] hover:shadow-2xl transition-all duration-300`}
              >
                {s.ctas[0].label}
                <i className={`${s.ctas[0].icon} text-sm`} aria-hidden="true" />
              </Link>
              <Link
                to={s.ctas[1].to}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
              >
                {s.ctas[1].label}
                <i className={`${s.ctas[1].icon} text-sm`} aria-hidden="true" />
              </Link>
            </div>

            {/* Social icons (slide 1 only) */}
            {s.showName && (
              <div
                className="flex items-center gap-3 pt-1 animate-fade-in-up"
                style={{ animationDelay: '320ms' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mr-1">Follow</span>
                {linkedin?.url && (
                  <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200">
                    <i className="fab fa-linkedin text-sm" aria-hidden="true" />
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                    className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200">
                    <i className="fab fa-whatsapp text-sm" aria-hidden="true" />
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} aria-label="Email"
                    className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200">
                    <i className="fas fa-envelope text-sm" aria-hidden="true" />
                  </a>
                )}
                {socialLinks.filter(l => !l.url?.toLowerCase().includes('linkedin')).slice(0, 2).map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                    className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/20 transition-all duration-200">
                    <i className={`${link.icon} text-sm`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Slide navigation — dots + arrows ── */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex items-center justify-center gap-4">
          <button
            onClick={() => goToSlide((slide - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full border border-white/30 text-white hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <i className="fas fa-chevron-left text-xs" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-500 ${
                  i === slide
                    ? 'w-8 h-2.5 bg-white'
                    : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/65'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goToSlide((slide + 1) % SLIDES.length)}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full border border-white/30 text-white hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <i className="fas fa-chevron-right text-xs" aria-hidden="true" />
          </button>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10 z-20">
          {!paused && (
            <div
              key={`pb-${slideKey}`}
              className="h-full bg-white/60 rounded-full"
              style={{ animation: `progressFill ${SLIDE_DURATION}ms linear forwards` }}
            />
          )}
        </div>

        {/* ── Slide counter badge ── */}
        <div className="absolute top-24 right-6 lg:right-12 z-20 bg-black/40 border border-white/10 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {slide + 1} / {SLIDES.length}
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURED PROJECTS
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Featured projects" className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <Reveal className="mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-3">My Work</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2
                className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Featured{' '}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <Link
                to="/projects"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
              >
                View all <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {featuredLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 h-72 animate-pulse" />
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <i className="fas fa-code text-4xl mb-3 block" aria-hidden="true" />
              <p className="font-medium">Projects coming soon</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id ?? i} delay={i * 100}>
                  <div className="group flex flex-col h-full bg-gray-50 dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300">
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-500/10 to-violet-500/10 dark:from-blue-900/30 dark:to-violet-900/30">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-code text-5xl text-blue-500/30 dark:text-blue-400/20" aria-hidden="true" />
                        </div>
                      )}
                      {project.category && (
                        <span className="absolute top-3 left-3 text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <h3
                        className="font-bold text-gray-900 dark:text-white text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 line-clamp-3">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(project.technologies)
                            ? project.technologies
                            : String(project.technologies).split(',')
                          ).slice(0, 3).map((t) => t.trim()).filter(Boolean).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 pt-1">
                        {project.live_demo && (
                          <a href={project.live_demo} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            <i className="fas fa-external-link-alt text-[10px]" aria-hidden="true" /> Live Demo
                          </a>
                        )}
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <i className="fab fa-github text-xs" aria-hidden="true" /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════ */}
      <section aria-label="Call to action" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-12 md:p-16 text-center text-white shadow-2xl shadow-indigo-500/20">
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
