import { isSupabaseConfigured, supabase } from './supabase'

const GEO_KEY = 'pf_visit_geo'

async function getGeo() {
  try {
    const cached = sessionStorage.getItem(GEO_KEY)
    if (cached) return JSON.parse(cached)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)

    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null

    const geo = {
      country: data.country_name ?? null,
      country_code: data.country_code ?? null,
      city: data.city ?? null,
    }
    sessionStorage.setItem(GEO_KEY, JSON.stringify(geo))
    return geo
  } catch {
    return null
  }
}

export async function trackVisit(page = '/') {
  // Skip in local development to keep analytics clean
  if (import.meta.env.DEV) return
  if (!isSupabaseConfigured) return

  // Only record each page once per browser session
  const key = `pf_visited_${page}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')

  const geo = await getGeo()

  await supabase.from('visits').insert({
    page,
    country:      geo?.country      ?? null,
    country_code: geo?.country_code ?? null,
    city:         geo?.city         ?? null,
  })
}
