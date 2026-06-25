import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { skillCategories as staticSkillCategories } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function Skills() {
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingStatic, setUsingStatic] = useState(false)

  useEffect(() => {
    async function fetchSkills() {
      if (!isSupabaseConfigured) {
        setUsingStatic(true)
        setLoading(false)
        return
      }

      const [{ data: cats, error: catsError }, { data: sks, error: sksError }] = await Promise.all([
        supabase.from('skill_categories').select('*').order('sort_order').order('title'),
        supabase.from('skills').select('*').order('sort_order').order('name'),
      ])

      if (catsError || sksError || !cats?.length) {
        setUsingStatic(true)
      } else {
        setCategories(cats)
        setSkills(sks ?? [])
      }
      setLoading(false)
    }
    fetchSkills()
  }, [])

  function skillsFor(categoryId) {
    return skills.filter((s) => s.category_id === categoryId)
  }

  return (
    <>
      <section className="px-10 py-10 pt-20 space-y-16">
        {/* Loading skeleton */}
        {loading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-8 shadow-lg animate-pulse">
                <div className="h-7 bg-blue-200 rounded w-64 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <div key={j} className="h-20 bg-white rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Supabase categories */}
        {!loading && !usingStatic && categories.map((category, categoryIndex) => {
          const catSkills = skillsFor(category.id)
          return (
            <Reveal
              key={category.id}
              delay={categoryIndex * 80}
              className={`${category.bg ?? 'bg-blue-100'} rounded-xl p-8 shadow-lg`}
            >
              <h2 className={`text-3xl font-bold ${category.title_color ?? 'text-blue-800'} mb-6`}>
                <i className={category.icon}></i> {category.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {catSkills.map((skill, skillIndex) => (
                  <Reveal
                    key={skill.id}
                    delay={categoryIndex * 80 + skillIndex * 40}
                    className={`flex flex-col items-center justify-center p-5 rounded-lg bg-white ${skill.hover_bg ?? 'hover:bg-gray-100'} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <i className={`${skill.icon} ${skill.color} text-3xl`}></i>
                    <span className="mt-2 font-semibold">{skill.name}</span>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )
        })}

        {/* Static fallback */}
        {!loading && usingStatic && staticSkillCategories.map((category, categoryIndex) => (
          <Reveal key={category.title} delay={categoryIndex * 80} className={`${category.bg} rounded-xl p-8 shadow-lg`}>
            <h2 className={`text-3xl font-bold ${category.titleColor} mb-6`}>
              <i className={category.icon}></i> {category.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {category.skills.map((skill, skillIndex) => (
                <Reveal
                  key={skill.name}
                  delay={categoryIndex * 80 + skillIndex * 40}
                  className={`flex flex-col items-center justify-center p-5 rounded-lg bg-white ${skill.hoverBg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <i className={`${skill.icon} ${skill.color} text-3xl`}></i>
                  <span className="mt-2 font-semibold">{skill.name}</span>
                </Reveal>
              ))}
            </div>
          </Reveal>
        ))}

        {/* Empty state */}
        {!loading && !usingStatic && categories.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-code text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-lg font-medium">No skills published yet.</p>
          </div>
        )}
      </section>

      <div className="px-10 pb-16">
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
