import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { profile } from '../data/profile'

export default function Home() {
  return (
    <>
      <section className="flex flex-wrap gap-6 mt-6 p-6 pt-20">
        <Reveal
          className="bg-white rounded-2xl w-full md:w-[40%] p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <h1 className="text-4xl text-blue-700 font-bold mb-4 flex items-center gap-2">
            <i className="fa fa-hand-peace"></i> Welcome!
          </h1>
          <p className="text-lg font-medium leading-8 tracking-wide text-gray-700">
            {profile.welcomeText}
          </p>
        </Reveal>

        <Reveal
          delay={150}
          className="bg-gradient-to-tr from-blue-300 to-purple-300 rounded-2xl w-full md:w-[58%] flex justify-center items-center overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <video autoPlay loop muted playsInline className="w-full rounded-2xl object-cover">
            <source src="/images/david.mp4" type="video/mp4" />
          </video>
        </Reveal>
      </section>

      <section className="px-6 pb-12">
        <Reveal>
          <CallToAction
            heading="Like what you see?"
            subtext="Let's build something great together. I'm always open to discussing new projects and opportunities."
            buttonText="Get In Touch"
            to="/contact"
            icon="fas fa-paper-plane"
          />
        </Reveal>
      </section>
    </>
  )
}
