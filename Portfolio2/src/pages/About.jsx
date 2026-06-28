import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { useProfile } from '../contexts/ProfileContext'

// ── Static education/experience data ─────────────────────────
const TIMELINE = [
  {
    period: '2023 — Present',
    institution: 'University of Rwanda',
    role: 'Computer Science Student',
    description:
      'Pursuing a degree in Computer Science, studying data structures, algorithms, software engineering, and modern development practices.',
    icon: 'fas fa-university',
    gradient: 'from-blue-500 to-purple-500',
    status: 'current',
  },
  {
    period: '2020 — 2022',
    institution: 'Advanced Level Certificate (A2)',
    role: 'Mathematics, Physics & Computer Science',
    description:
      'Completed A2 level education with excellence, building a strong foundation in analytical thinking, problem solving, and computer science fundamentals.',
    icon: 'fas fa-graduation-cap',
    gradient: 'from-green-500 to-teal-500',
    status: 'completed',
  },
  {
    period: '2021 — Present',
    institution: 'Self-directed Learning',
    role: 'Software Development Journey',
    description:
      'Building real-world projects with React, Node.js, Python, and modern web technologies through structured online learning and hands-on development.',
    icon: 'fas fa-laptop-code',
    gradient: 'from-orange-500 to-yellow-500',
    status: 'current',
  },
]

// ── Key professional strengths ────────────────────────────────
const STRENGTHS = [
  { title: 'Problem Solving',     icon: 'fas fa-brain',      color: 'text-blue-500',   bg: 'bg-blue-50   dark:bg-blue-900/30' },
  { title: 'Team Collaboration',  icon: 'fas fa-users',      color: 'text-green-500',  bg: 'bg-green-50  dark:bg-green-900/30' },
  { title: 'Time Management',     icon: 'fas fa-clock',      color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  { title: 'Communication',       icon: 'fas fa-comments',   color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
  { title: 'Continuous Learning', icon: 'fas fa-book-open',  color: 'text-cyan-500',   bg: 'bg-cyan-50   dark:bg-cyan-900/30' },
  { title: 'Clean Code',          icon: 'fas fa-code',       color: 'text-red-500',    bg: 'bg-red-50    dark:bg-red-900/30' },
]

export default function About() {
  const { profileData, socialLinks, languages } = useProfile()
  const {
    fullName, profileImage, aboutLocation, phone, whatsappLink,
    university, linkedin, bio, cvUrl, resumeUrl,
  } = profileData

  return (
    <>
      {/* Page top spacer */}
      <div className="pt-32 bg-gray-50 dark:bg-gray-900"></div>

      {/* ── Profile grid ─────────────────────────────────────── */}
      <section
        aria-label="About me"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-100 dark:bg-gray-900"
      >
        {/* Profile Card */}
        <Reveal className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:scale-[1.02] hover:shadow-2xl transition-transform">
          <img
            src={profileImage}
            alt={`Profile photo of ${fullName}`}
            className="rounded-full border-4 border-green-400 w-48 h-48 shadow-md mb-6 object-cover"
            onError={(e) => { e.target.src = '/images/david2.png' }}
          />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {fullName}
          </h2>

          <div className="flex flex-col space-y-3 text-gray-600 dark:text-gray-300 text-base items-start w-full">
            {aboutLocation && (
              <div className="flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-green-500 w-5 text-center" aria-hidden="true"></i>
                <span>{aboutLocation}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-3">
                <i className="fas fa-phone text-blue-500 w-5 text-center" aria-hidden="true"></i>
                <span>{phone}</span>
              </div>
            )}
            {whatsappLink && (
              <div className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-green-600 w-5 text-center" aria-hidden="true"></i>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="hover:underline text-green-700 dark:text-green-400">
                  WhatsApp
                </a>
              </div>
            )}
            {university && (
              <div className="flex items-center gap-3">
                <i className="fas fa-graduation-cap text-purple-500 w-5 text-center" aria-hidden="true"></i>
                <span>{university}</span>
              </div>
            )}
            {linkedin?.url && (
              <div className="flex items-center gap-3">
                <i className="fab fa-linkedin text-blue-700 w-5 text-center" aria-hidden="true"></i>
                <a href={linkedin.url} target="_blank" rel="noopener noreferrer"
                  className="hover:underline text-blue-700 dark:text-blue-400">
                  {linkedin.label}
                </a>
              </div>
            )}
            {socialLinks
              .filter(l => !l.url?.toLowerCase().includes('linkedin'))
              .map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                <i className={`${link.icon} ${link.color} w-5 text-center`} aria-hidden="true"></i>
                <a href={link.url} target="_blank" rel="noopener noreferrer"
                  className="hover:underline dark:text-gray-300">
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Languages Card */}
        <Reveal
          delay={120}
          className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900/60 dark:via-purple-900/60 dark:to-pink-900/60 p-10 rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-300"
        >
          <h2
            className="text-3xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 mb-8"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Languages
          </h2>
          <div className="space-y-5">
            {languages.map((language) => (
              <div
                key={language.name}
                className={`bg-gradient-to-r ${language.gradient} rounded-2xl p-5 shadow-lg flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
              >
                <i className="fas fa-language text-white text-3xl shrink-0" aria-hidden="true"></i>
                <div>
                  <h3 className="text-xl font-bold text-white">{language.name}</h3>
                  <p className={language.textColor}>{language.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CV / Resume */}
        <Reveal delay={240} className="flex flex-col gap-5">
          {cvUrl && (
            <div className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-900/30 dark:to-green-900/20 p-7 rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-transform flex flex-col justify-between">
              <p className="text-base text-gray-700 dark:text-gray-200 mb-5">
                <i className="fas fa-file-alt text-green-600 mr-2" aria-hidden="true"></i>
                My CV highlights technical skills, languages, projects, and certifications.
              </p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-105"
                aria-label="View my CV (opens in new tab)"
              >
                <i className="fas fa-eye" aria-hidden="true"></i>
                View CV
              </a>
            </div>
          )}
          {resumeUrl && (
            <div className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 dark:from-indigo-900/40 dark:via-indigo-900/30 dark:to-indigo-900/20 p-7 rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-transform flex flex-col justify-between">
              <p className="text-base text-gray-700 dark:text-gray-200 mb-5">
                <i className="fas fa-briefcase text-indigo-600 mr-2" aria-hidden="true"></i>
                My resume focuses on technical expertise, projects, and work experience.
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-105"
                aria-label="View my resume (opens in new tab)"
              >
                <i className="fas fa-eye" aria-hidden="true"></i>
                View Resume
              </a>
            </div>
          )}
        </Reveal>

        {/* Bio — full width */}
        <Reveal
          delay={320}
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 dark:from-yellow-900/30 dark:via-yellow-900/20 dark:to-yellow-900/10 p-8 rounded-2xl shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-transform"
        >
          <h2
            className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <i className="fas fa-user text-yellow-500 mr-2" aria-hidden="true"></i>Bio
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center leading-relaxed max-w-3xl mx-auto">{bio}</p>
        </Reveal>
      </section>

      {/* ── Education & Experience Timeline ──────────────────── */}
      <section aria-label="Education and experience" className="bg-white dark:bg-gray-800 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="section-heading mb-3">
              <i className="fas fa-road text-blue-500 mr-3" aria-hidden="true"></i>
              My Journey
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Education &amp; experience milestones</p>
          </Reveal>

          <div className="relative space-y-8">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.institution} delay={i * 100}>
                <div className="flex gap-5">
                  {/* Icon column */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md shrink-0`}>
                      <i className={`${item.icon} text-white text-sm`} aria-hidden="true"></i>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700" aria-hidden="true"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {item.period}
                      </span>
                      {item.status === 'current' && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.institution}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-2">{item.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Strengths ─────────────────────────────────────── */}
      <section aria-label="Professional strengths" className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="section-heading mb-3">
              <i className="fas fa-star text-yellow-500 mr-3" aria-hidden="true"></i>
              Key Strengths
            </h2>
            <p className="text-gray-500 dark:text-gray-400">What I bring to every project</p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STRENGTHS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className={`${s.bg} rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:scale-[1.04] transition-transform cursor-default`}>
                  <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center`}>
                    <i className={`${s.icon} ${s.color} text-xl`} aria-hidden="true"></i>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white text-sm">{s.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 px-6 pb-12 pt-4">
        <Reveal>
          <CallToAction
            heading="Want to work together?"
            subtext="I'm currently open to internships, freelance work, and junior developer roles."
            buttonText="Let's Talk"
            to="/contact"
            icon="fas fa-comments"
          />
        </Reveal>
      </div>
    </>
  )
}
