import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${bg} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><i className="fas fa-times"></i></button>
    </div>
  )
}

const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-sm transition'
const textareaClass = `${inputClass} resize-none`

// ── Tab: Profile ─────────────────────────────────────────────
function ProfileTab({ settings, onChange, onSave, saving }) {
  return (
    <form onSubmit={onSave} className="space-y-5">
      {/* Profile image preview */}
      <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl">
        <img
          src={settings.profile_image || '/images/david2.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          onError={(e) => { e.target.src = '/images/david2.png' }}
        />
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-image text-blue-500 mr-1.5"></i>Profile Image URL
          </label>
          <input type="url" value={settings.profile_image} onChange={onChange('profile_image')} placeholder="https://…/photo.jpg" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Paste a direct image URL (Imgur, Google Drive direct link, etc.)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-user text-blue-500 mr-1.5"></i>Full Name
          </label>
          <input type="text" value={settings.full_name} onChange={onChange('full_name')} placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-graduation-cap text-purple-500 mr-1.5"></i>University / Role
          </label>
          <input type="text" value={settings.university} onChange={onChange('university')} placeholder="University of Rwanda Student" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <i className="fas fa-align-left text-yellow-500 mr-1.5"></i>Bio
        </label>
        <textarea value={settings.bio} onChange={onChange('bio')} rows={5} placeholder="Write a short bio about yourself…" className={textareaClass} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <i className="fas fa-quote-left text-indigo-500 mr-1.5"></i>Welcome Text (Home page)
        </label>
        <textarea value={settings.welcome_text} onChange={onChange('welcome_text')} rows={3} placeholder="Your intro/welcome message…" className={textareaClass} />
      </div>

      <SaveButton saving={saving} />
    </form>
  )
}

// ── Tab: Contact ─────────────────────────────────────────────
function ContactTab({ settings, onChange, onSave, saving }) {
  return (
    <form onSubmit={onSave} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-envelope text-blue-500 mr-1.5"></i>Email Address
          </label>
          <input type="email" value={settings.email} onChange={onChange('email')} placeholder="you@gmail.com" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-phone text-green-500 mr-1.5"></i>Phone Number
          </label>
          <input type="text" value={settings.phone} onChange={onChange('phone')} placeholder="+250 7xx xxx xxx" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          <i className="fab fa-whatsapp text-green-500 mr-1.5"></i>WhatsApp Link
        </label>
        <input type="url" value={settings.whatsapp_link} onChange={onChange('whatsapp_link')} placeholder="https://wa.me/+250…" className={inputClass} />
        <p className="text-xs text-gray-400 mt-1">Format: <code>https://wa.me/+COUNTRYCODENUMBER</code></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-map-marker-alt text-red-500 mr-1.5"></i>Location (Header / Footer)
          </label>
          <input type="text" value={settings.location} onChange={onChange('location')} placeholder="Kigali, Rwanda" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-map-pin text-red-400 mr-1.5"></i>About Page Location
          </label>
          <input type="text" value={settings.about_location} onChange={onChange('about_location')} placeholder="Musanze, Rwanda" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-address-card text-orange-500 mr-1.5"></i>Contact Page Address
          </label>
          <input type="text" value={settings.contact_address} onChange={onChange('contact_address')} placeholder="Musanze, Rwanda" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-clock text-cyan-500 mr-1.5"></i>Working Hours
          </label>
          <input type="text" value={settings.working_hours} onChange={onChange('working_hours')} placeholder="Mon-Fri, 9AM - 5PM" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fab fa-linkedin text-blue-700 mr-1.5"></i>LinkedIn URL
          </label>
          <input type="url" value={settings.linkedin_url} onChange={onChange('linkedin_url')} placeholder="https://linkedin.com/in/…" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <i className="fas fa-tag text-blue-600 mr-1.5"></i>LinkedIn Display Name
          </label>
          <input type="text" value={settings.linkedin_label} onChange={onChange('linkedin_label')} placeholder="Your Name" className={inputClass} />
        </div>
      </div>

      <SaveButton saving={saving} />
    </form>
  )
}

// ── Tab: Documents ────────────────────────────────────────────
function DocumentsTab({ settings, onChange, onSave, saving }) {
  const fields = [
    { key: 'cv_url', label: 'CV URL', icon: 'fas fa-file-alt', color: 'text-green-600', desc: 'Link to your CV document (Google Drive share link).' },
    { key: 'resume_url', label: 'Resume URL', icon: 'fas fa-briefcase', color: 'text-indigo-600', desc: 'Link to your Resume document (Google Drive share link).' },
  ]
  return (
    <form onSubmit={onSave} className="space-y-5">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
            <i className={`${f.icon} ${f.color}`}></i>{f.label}
          </label>
          <input type="url" value={settings[f.key]} onChange={onChange(f.key)} placeholder="https://drive.google.com/…" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
          {settings[f.key] && (
            <a href={settings[f.key]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
              <i className="fas fa-external-link-alt"></i>Preview link
            </a>
          )}
        </div>
      ))}
      <SaveButton saving={saving} />
    </form>
  )
}

// ── Tab: Social Links ─────────────────────────────────────────
const ICON_SUGGESTIONS = [
  { label: 'Instagram',  icon: 'fab fa-instagram',  color: 'text-pink-500' },
  { label: 'GitHub',     icon: 'fab fa-github',      color: 'text-gray-800' },
  { label: 'Twitter/X',  icon: 'fab fa-x-twitter',   color: 'text-gray-900' },
  { label: 'YouTube',    icon: 'fab fa-youtube',      color: 'text-red-600' },
  { label: 'Facebook',   icon: 'fab fa-facebook',     color: 'text-blue-600' },
  { label: 'TikTok',     icon: 'fab fa-tiktok',       color: 'text-gray-800' },
  { label: 'Portfolio',  icon: 'fas fa-globe',        color: 'text-blue-500' },
  { label: 'Other',      icon: 'fas fa-link',         color: 'text-gray-500' },
]

const EMPTY_LINK = { label: '', url: '', icon: 'fas fa-link', color: 'text-gray-500' }

function SocialLinksTab({ onToast }) {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_LINK)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const labelRef = useRef(null)

  async function fetchLinks() {
    const { data } = await supabase.from('social_links').select('*').order('sort_order').order('label')
    setLinks(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  function applyPreset(preset) {
    setForm((prev) => ({ ...prev, icon: preset.icon, color: preset.color, label: prev.label || preset.label }))
  }

  function setField(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  function startEdit(link) {
    setEditId(link.id)
    setForm({ label: link.label, url: link.url, icon: link.icon, color: link.color })
    setTimeout(() => labelRef.current?.focus(), 50)
  }

  function cancelEdit() { setEditId(null); setForm(EMPTY_LINK) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.label.trim() || !form.url.trim()) return
    setSaving(true)
    let error
    if (editId) {
      ;({ error } = await supabase.from('social_links').update({ label: form.label, url: form.url, icon: form.icon, color: form.color }).eq('id', editId))
    } else {
      ;({ error } = await supabase.from('social_links').insert({ label: form.label, url: form.url, icon: form.icon, color: form.color }))
    }
    setSaving(false)
    if (error) { onToast('Failed to save link.', 'error'); return }
    onToast(editId ? 'Link updated.' : 'Link added.', 'success')
    cancelEdit()
    fetchLinks()
  }

  async function handleDelete(id) {
    setDeleting(id)
    const { error } = await supabase.from('social_links').delete().eq('id', id)
    setDeleting(null)
    if (error) { onToast('Failed to delete link.', 'error'); return }
    onToast('Link deleted.', 'success')
    fetchLinks()
  }

  return (
    <div className="space-y-6">
      {/* Existing links */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Links</h3>
        {loading ? (
          <div className="space-y-2 animate-pulse">{[1,2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}</div>
        ) : links.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6 bg-gray-50 rounded-xl">No social links yet. Add one below.</p>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <i className={`${link.icon} ${link.color} text-xl w-6 text-center`}></i>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{link.label}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{link.url}</a>
                </div>
                <button onClick={() => startEdit(link)} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition" title="Edit">
                  <i className="fas fa-edit text-sm"></i>
                </button>
                <button onClick={() => handleDelete(link.id)} disabled={deleting === link.id} className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition disabled:opacity-50" title="Delete">
                  {deleting === link.id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <i className="fas fa-trash text-sm"></i>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit form */}
      <div className="border-t pt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{editId ? 'Edit Link' : 'Add New Link'}</h3>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ICON_SUGGESTIONS.map((p) => (
            <button key={p.label} type="button" onClick={() => applyPreset(p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm font-medium text-gray-700 transition">
              <i className={`${p.icon} ${p.color} text-sm`}></i>{p.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Label *</label>
              <input ref={labelRef} type="text" value={form.label} onChange={setField('label')} placeholder="Instagram" required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">URL *</label>
              <input type="url" value={form.url} onChange={setField('url')} placeholder="https://instagram.com/you" required className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Icon Class <span className="font-normal text-gray-400">(Font Awesome)</span>
              </label>
              <div className="flex items-center gap-2">
                <input type="text" value={form.icon} onChange={setField('icon')} placeholder="fab fa-instagram" className={inputClass} />
                <i className={`${form.icon} ${form.color} text-xl shrink-0`}></i>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Color Class <span className="font-normal text-gray-400">(Tailwind)</span>
              </label>
              <input type="text" value={form.color} onChange={setField('color')} placeholder="text-pink-500" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {editId && (
              <button type="button" onClick={cancelEdit} className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <i className={`fas ${editId ? 'fa-save' : 'fa-plus'}`}></i>}
              {editId ? 'Save Changes' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Shared save button ────────────────────────────────────────
function SaveButton({ saving }) {
  return (
    <div className="flex justify-end pt-2">
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm disabled:opacity-60">
        {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <i className="fas fa-save"></i>}
        Save Settings
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
const TABS = [
  { id: 'profile',  label: 'Profile',      icon: 'fas fa-user' },
  { id: 'contact',  label: 'Contact',      icon: 'fas fa-address-book' },
  { id: 'social',   label: 'Social Links', icon: 'fas fa-share-alt' },
  { id: 'docs',     label: 'Documents',    icon: 'fas fa-file-alt' },
]

const DEFAULT_SETTINGS = {
  full_name: '', bio: '', profile_image: '', university: '', welcome_text: '',
  email: '', phone: '', whatsapp_link: '', location: '', about_location: '',
  contact_address: '', working_hours: '', linkedin_url: '', linkedin_label: '',
  cv_url: '', resume_url: '',
}

export default function AdminSettings() {
  const [tab, setTab] = useState('profile')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  function notify(message, type = 'success') { setToast({ message, type }) }

  useEffect(() => {
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
        setSettings((prev) => ({ ...prev, ...map }))
      }
      setLoading(false)
    })
  }, [])

  function onChange(key) {
    return (e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const upserts = Object.entries(settings)
      .filter(([, v]) => v !== '')
      .map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    if (error) { notify('Failed to save settings.', 'error') }
    else { notify('Settings saved! Changes are live on your portfolio.', 'success') }
  }

  const tabProps = { settings, onChange, onSave: handleSave, saving }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your profile, contact info, social links, and documents. All changes reflect immediately on the public site.</p>
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              <i className={t.icon}></i>{t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-11 bg-gray-100 rounded-lg" />)}
            </div>
          ) : (
            <>
              {tab === 'profile' && <ProfileTab {...tabProps} />}
              {tab === 'contact' && <ContactTab {...tabProps} />}
              {tab === 'social'  && <SocialLinksTab onToast={notify} />}
              {tab === 'docs'    && <DocumentsTab {...tabProps} />}
            </>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
