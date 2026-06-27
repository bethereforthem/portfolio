import { createContext, useContext, useEffect, useState } from 'react'
import { languages, profile as defaultProfile } from '../data/profile'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const ProfileContext = createContext(null)

const DEFAULT = {
  ...defaultProfile,
  profileImage: '/images/david2.png',
  projectsCount: 10,
  technologiesCount: 20,
  yearsCoding: 2,
  certificates: 5,
}

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(DEFAULT)
  const [socialLinks, setSocialLinks] = useState([])
  const [langs] = useState(languages)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function load() {
      try {
        const [{ data: settings }, { data: links }] = await Promise.all([
          supabase.from('settings').select('key, value'),
          supabase.from('social_links').select('*').order('sort_order').order('label'),
        ])

        if (settings?.length) {
          const m = Object.fromEntries(settings.map((r) => [r.key, r.value]))
          setProfileData((prev) => ({
            ...prev,
            fullName:       m.full_name       || prev.fullName,
            bio:            m.bio             || prev.bio,
            profileImage:   m.profile_image   || prev.profileImage,
            phone:          m.phone           || prev.phone,
            email:          m.email           || prev.email,
            whatsappLink:   m.whatsapp_link   || prev.whatsappLink,
            location:       m.location        || prev.location,
            aboutLocation:  m.about_location  || prev.aboutLocation,
            contactAddress: m.contact_address || prev.contactAddress,
            workingHours:   m.working_hours   || prev.workingHours,
            university:     m.university      || prev.university,
            welcomeText:    m.welcome_text    || prev.welcomeText,
            cvUrl:          m.cv_url          || prev.cvUrl,
            resumeUrl:      m.resume_url      || prev.resumeUrl,
            projectsCount:     Number(m.projects_count)     || prev.projectsCount,
            technologiesCount: Number(m.technologies_count) || prev.technologiesCount,
            yearsCoding:       Number(m.years_coding)       || prev.yearsCoding,
            certificates:      Number(m.certificates)       || prev.certificates,
            linkedin: {
              url:   m.linkedin_url   || prev.linkedin.url,
              label: m.linkedin_label || prev.linkedin.label,
            },
          }))
        }

        if (links) setSocialLinks(links)
      } catch {
        // Supabase unavailable — profile stays at hardcoded defaults, site still works
      }
    }
    load()
  }, [])

  return (
    <ProfileContext.Provider value={{ profileData, socialLinks, languages: langs }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
