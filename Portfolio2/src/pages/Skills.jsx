import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { skillCategories as staticSkillCategories } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

// ── Individual skill card ─────────────────────────────────────
function SkillCard({ skill, hoverBg, categoryIndex, skillIndex }) {
  return (
    <Reveal
      delay={categoryIndex * 80 + skillIndex * 40}
      className={`flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-gray-700/80 ${hoverBg ?? 'hover:bg-gray-100 dark:hover:bg-gray-600'} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-default`}
    >
      <i className={`${skill.icon} ${skill.color} text-3xl group-hover:scale-110 transition-transform duration-300`} aria-hidden="true"></i>
      <span className="mt-2 font-semibold text-sm text-gray-700 dark:text-gray-200 text-center leading-tight">{skill.name}</span>
    </Reveal>
  )
}

// ── Loading skeleton ──────────────────────────────────────────
function SkeletonSection() {
  return (
    <div className="rounded-2xl p-8 shadow-lg animate-pulse bg-blue-50 dark:bg-blue-900/20">
      <div className="h-7 bg-blue-200 dark:bg-blue-800/60 rounded w-56 mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, j) => (
          <div key={j} className="h-20 bg-white dark:bg-gray-700/50 rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const [categories, setCategories] = useState([])
  const [skills, setSkills]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [usingStatic, setUsingStatic] = useState(false)

  useEffect(() => {
    async function fetchSkills() {
      if (!isSupabaseConfigured) { setUsingStatic(true); setLoading(false); return }

      const [{ data: cats, error: catsErr }, { data: sks, error: sksErr }] = await Promise.all([
        supabase.from('skill_categories').select('*').order('sort_order').order('title'),
        supabase.from('skills').select('*').order('sort_order').order('name'),
      ])

      if (catsErr || sksErr || !cats?.length) {
        setUsingStatic(true)
      } else {
        setCategories(cats)
        setSkills(sks ?? [])
      }
      setLoading(false)
    }
    fetchSkills()
  }, [])

  const skillsFor = (catId) => skills.filter((s) => s.category_id === catId)

  const resolvedCategories = usingStatic
    ? staticSkillCategories.map((c) => ({ ...c, id: c.title, skills: c.skills }))
    : categories

  const totalSkills = usingStatic
    ? staticSkillCategories.reduce((sum, c) => sum + c.skills.length, 0)
    : skills.length

  return (
    <>
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-gray-900 pt-32 pb-10">
        <div className="max-w-6xl mx-auto px-10 text-center">
          <Reveal>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              My Skills
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Technologies and tools I've worked with across {resolvedCategories.length} categories.
            </p>
          </Reveal>

          {/* Quick stats */}
          {!loading && (
            <Reveal delay={100} className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400" style={{ fontFamily: 'Poppins, sans-serif' }}>{totalSkills}+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Skills</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400" style={{ fontFamily: 'Poppins, sans-serif' }}>{resolvedCategories.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400" style={{ fontFamily: 'Poppins, sans-serif' }}>2+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Years Learning</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <section className="px-6 md:px-10 py-10 space-y-10 bg-gray-50 dark:bg-gray-900" aria-label="Skills by category">
        {/* Loading */}
        {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonSection key={i} />)}

        {/* Supabase data */}
        {!loading && !usingStatic && categories.map((cat, catIdx) => {
          const catSkills = skillsFor(cat.id)
          return (
            <Reveal key={cat.id} delay={catIdx * 80}>
              <div className={`${cat.bg ?? 'bg-blue-100 dark:bg-blue-900/20'} rounded-2xl p-8 shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${cat.title_color ?? 'text-blue-800 dark:text-blue-200'} flex items-center gap-2`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <i className={cat.icon} aria-hidden="true"></i>
                    {cat.title}
                  </h2>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-700/70 px-3 py-1 rounded-full">
                    {catSkills.length} skill{catSkills.length !== 1 && 's'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catSkills.map((skill, si) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      hoverBg={skill.hover_bg}
                      categoryIndex={catIdx}
                      skillIndex={si}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}

        {/* Static fallback */}
        {!loading && usingStatic && staticSkillCategories.map((cat, catIdx) => (
          <Reveal key={cat.title} delay={catIdx * 80}>
            <div className={`${cat.bg} rounded-2xl p-8 shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${cat.titleColor} flex items-center gap-2`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <i className={cat.icon} aria-hidden="true"></i>
                  {cat.title}
                </h2>
                <span className="text-xs font-semibold text-gray-400 bg-white/70 px-3 py-1 rounded-full">
                  {cat.skills.length} skill{cat.skills.length !== 1 && 's'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cat.skills.map((skill, si) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    hoverBg={skill.hoverBg}
                    categoryIndex={catIdx}
                    skillIndex={si}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* Empty state */}
        {!loading && !usingStatic && categories.length === 0 && (
          <div className="text-center py-20" role="status">
            <i className="fas fa-code text-gray-300 dark:text-gray-600 text-6xl mb-4" aria-hidden="true"></i>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No skills published yet.</p>
          </div>
        )}
      </section>

      <div className="px-6 md:px-10 pb-16 bg-gray-50 dark:bg-gray-900">
        <Reveal>
          <CallToAction
            heading="Need these skills on your project?"
            subtext="From responsive frontends to full backend systems, I'd love to help bring your idea to life."
            buttonText="Hire Me"
            to="/contact"
            icon="fas fa-handshake"
          />
        </Reveal>
      </div>
    </>
  )
}
