import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import Reveal from '../components/Reveal'
import { languages, profile } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function About() {
  const [cvUrl, setCvUrl] = useState(profile.cvUrl)
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['cv_url', 'resume_url'])
      .then(({ data }) => {
        if (!data) return
        data.forEach(({ key, value }) => {
          if (key === 'cv_url' && value) setCvUrl(value)
          if (key === 'resume_url' && value) setResumeUrl(value)
        })
      })
  }, [])
  return (
    <>
      <div className="pt-32"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-100">
        {/* Profile Card */}
        <Reveal className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-transform">
          <img
            src="/images/david2.png"
            alt="David"
            className="rounded-full border-4 border-green-400 w-48 h-48 shadow-md mb-6"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{profile.fullName}</h2>

          <div className="mt-4 flex flex-col space-y-4 text-gray-600 text-lg items-start">
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-green-500 w-6"></i>
              <span className="ml-3">{profile.aboutLocation}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-phone text-blue-500 w-6"></i>
              <span className="ml-3">{profile.phone}</span>
            </div>
            <div className="flex items-center">
              <i className="fab fa-whatsapp text-green-600 w-6"></i>
              <span className="ml-3">{profile.phone}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-graduation-cap text-purple-500 w-6"></i>
              <span className="ml-3">{profile.university}</span>
            </div>
            <div className="flex items-center">
              <i className="fab fa-linkedin text-blue-700 w-6"></i>
              <a href={profile.linkedin.url} className="ml-3 hover:underline text-blue-700">
                {profile.linkedin.label}
              </a>
            </div>
          </div>
        </Reveal>

        {/* Languages Card */}
        <Reveal
          delay={120}
          className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-10 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
            Languages of Communication
          </h1>
          <div className="space-y-6">
            {languages.map((language) => (
              <div
                key={language.name}
                className={`bg-gradient-to-r ${language.gradient} rounded-2xl p-6 shadow-lg flex items-center space-x-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <i className="fas fa-language text-white text-4xl"></i>
                <div>
                  <h2 className="text-2xl font-bold text-white">{language.name}</h2>
                  <p className={language.textColor}>{language.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CV and Resume Buttons */}
        <Reveal delay={240} className="flex flex-col space-y-6">
          <div className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 p-8 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform flex flex-col justify-between">
            <p className="text-lg text-gray-700 mb-6">
              <i className="fas fa-file-alt text-green-600 mr-2"></i>
              As a software developer, my CV highlights technical skills,
              programming languages, projects, work experience, and
              certifications.
            </p>
            <div className="flex justify-center">
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <button className="bg-green-500 hover:bg-green-700 text-white text-lg font-semibold px-6 py-2 rounded-lg flex items-center space-x-2 transition-transform hover:scale-105">
                  <i className="fas fa-eye"></i>
                  <span>See my CV</span>
                </button>
              </a>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 p-8 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform flex flex-col justify-between">
            <p className="text-lg text-gray-700 mb-6">
              <i className="fas fa-briefcase text-indigo-600 mr-2"></i>
              My resume focuses on technical expertise, programming skills, key
              projects, and relevant work experience.
            </p>
            <div className="flex justify-center">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <button className="bg-indigo-500 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-2 rounded-lg flex items-center space-x-2 transition-transform hover:scale-105">
                  <i className="fas fa-eye"></i>
                  <span>See my Resume</span>
                </button>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bio Section Full Width */}
        <Reveal
          delay={320}
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 p-8 rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-transform"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            <i className="fas fa-user text-yellow-500 mr-2"></i> Bio
          </h2>
          <p className="text-xl text-gray-700 text-center leading-relaxed">{profile.bio}</p>
        </Reveal>
      </div>

      <div className="px-6 pb-12">
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
