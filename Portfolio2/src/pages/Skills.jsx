import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { skillCategories } from '../data/profile'

export default function Skills() {
  return (
    <>
      <section className="px-10 py-10 pt-20 space-y-16">
        {skillCategories.map((category, categoryIndex) => (
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
