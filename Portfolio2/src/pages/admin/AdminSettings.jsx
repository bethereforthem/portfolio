import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${bg} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><i className="fas fa-times"></i></button>
    </div>
  )
}

const FIELDS = [
  {
    key: 'cv_url',
    label: 'CV URL',
    icon: 'fas fa-file-alt',
    iconColor: 'text-green-600',
    description: 'Google Drive or direct link to your CV (Curriculum Vitae).',
    placeholder: 'https://drive.google.com/file/d/…/view',
  },
  {
    key: 'resume_url',
    label: 'Resume URL',
    icon: 'fas fa-briefcase',
    iconColor: 'text-indigo-600',
    description: 'Google Drive or direct link to your Resume.',
    placeholder: 'https://drive.google.com/file/d/…/view',
  },
]

export default function AdminSettings() {
  const [values, setValues] = useState({ cv_url: '', resume_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]))
        setValues((prev) => ({ ...prev, ...map }))
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })

    setSaving(false)
    if (error) {
      setToast({ message: 'Failed to save settings.', type: 'error' })
    } else {
      setToast({ message: 'Settings saved successfully.', type: 'success' })
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-sm transition'

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Update your CV and Resume links. Changes reflect immediately on the public About page.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-11 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <i className={`${field.icon} ${field.iconColor}`}></i>
                  {field.label}
                </label>
                <input
                  type="url"
                  value={values[field.key]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">{field.description}</p>

                {/* Live preview link */}
                {values[field.key] && (
                  <a
                    href={values[field.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <i className="fas fa-external-link-alt"></i>Preview current link
                  </a>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-save"></i>
                )}
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800 space-y-2">
        <p className="font-semibold"><i className="fas fa-info-circle mr-1.5"></i>How to update your CV or Resume</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Upload the new file to Google Drive</li>
          <li>Right-click the file → Share → Anyone with the link → Viewer</li>
          <li>Copy the share link and paste it above</li>
          <li>Click <strong>Save Settings</strong></li>
        </ol>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
