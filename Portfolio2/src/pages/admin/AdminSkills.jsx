import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${bg} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`}></i>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><i className="fas fa-times"></i></button>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <i className="fas fa-trash text-red-600"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Category Form Modal ───────────────────────────────────────
const BG_OPTIONS = [
  { value: 'bg-blue-100',   label: 'Blue' },
  { value: 'bg-green-100',  label: 'Green' },
  { value: 'bg-purple-100', label: 'Purple' },
  { value: 'bg-yellow-100', label: 'Yellow' },
  { value: 'bg-pink-100',   label: 'Pink' },
  { value: 'bg-orange-100', label: 'Orange' },
  { value: 'bg-red-100',    label: 'Red' },
  { value: 'bg-gray-100',   label: 'Gray' },
]

const TITLE_COLOR_OPTIONS = [
  { value: 'text-blue-800',   label: 'Blue' },
  { value: 'text-green-800',  label: 'Green' },
  { value: 'text-purple-800', label: 'Purple' },
  { value: 'text-yellow-800', label: 'Yellow' },
  { value: 'text-pink-800',   label: 'Pink' },
  { value: 'text-orange-800', label: 'Orange' },
  { value: 'text-red-800',    label: 'Red' },
  { value: 'text-gray-800',   label: 'Gray' },
]

function CategoryFormModal({ category, onSave, onClose }) {
  const [form, setForm] = useState(
    category ?? {
      title: '',
      icon: 'fas fa-code',
      bg: 'bg-blue-100',
      title_color: 'text-blue-800',
    }
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function set(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setErrors({ title: 'Title is required.' }); return }
    setSaving(true)
    const payload = { title: form.title, icon: form.icon, bg: form.bg, title_color: form.title_color }
    let error
    if (category?.id) {
      ;({ error } = await supabase.from('skill_categories').update(payload).eq('id', category.id))
    } else {
      ;({ error } = await supabase.from('skill_categories').insert(payload))
    }
    setSaving(false)
    if (error) { setErrors({ submit: error.message }) } else { onSave() }
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-sm transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">
            <i className={`fas ${category ? 'fa-edit' : 'fa-plus-circle'} text-purple-600 mr-2`}></i>
            {category ? 'Edit Category' : 'Add Skill Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><i className="fas fa-times text-xl"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category Title <span className="text-red-500">*</span></label>
            <input ref={inputRef} type="text" value={form.title} onChange={set('title')} placeholder="e.g. Frontend Development" className={inputClass} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Icon Class (Font Awesome)</label>
            <input type="text" value={form.icon} onChange={set('icon')} placeholder="fas fa-laptop-code" className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">
              Preview: <i className={form.icon}></i>
              {' '}· Find icons at <span className="text-blue-500">fontawesome.com/icons</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Background Color</label>
              <select value={form.bg} onChange={set('bg')} className={inputClass}>
                {BG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title Color</label>
              <select value={form.title_color} onChange={set('title_color')} className={inputClass}>
                {TITLE_COLOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          {errors.submit && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              <i className="fas fa-exclamation-circle shrink-0"></i>{errors.submit}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition text-sm flex items-center gap-2 disabled:opacity-60">
              {saving && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
              {category ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Skill Form Modal ──────────────────────────────────────────
const COLOR_OPTIONS = [
  'text-orange-500','text-blue-500','text-yellow-400','text-cyan-400','text-pink-400',
  'text-purple-600','text-indigo-400','text-green-600','text-green-700','text-blue-400',
  'text-blue-800','text-green-500','text-indigo-500','text-red-500','text-blue-600',
  'text-orange-400','text-cyan-600','text-gray-600','text-red-600','text-gray-800',
  'text-black','text-orange-600','text-blue-500',
]

const HOVER_BG_OPTIONS = [
  'hover:bg-orange-100','hover:bg-blue-100','hover:bg-yellow-100','hover:bg-cyan-100',
  'hover:bg-pink-100','hover:bg-purple-100','hover:bg-indigo-100','hover:bg-green-100',
  'hover:bg-green-200','hover:bg-red-100','hover:bg-gray-100','hover:bg-gray-200',
  'hover:bg-orange-100','hover:bg-red-200',
]

function SkillFormModal({ skill, categories, onSave, onClose }) {
  const [form, setForm] = useState(
    skill ?? {
      category_id: categories[0]?.id ?? '',
      name: '',
      icon: 'fas fa-code',
      color: 'text-blue-500',
      hover_bg: 'hover:bg-blue-100',
    }
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function set(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Skill name is required.' }); return }
    if (!form.category_id) { setErrors({ category_id: 'Select a category.' }); return }
    setSaving(true)
    const payload = { category_id: form.category_id, name: form.name, icon: form.icon, color: form.color, hover_bg: form.hover_bg }
    let error
    if (skill?.id) {
      ;({ error } = await supabase.from('skills').update(payload).eq('id', skill.id))
    } else {
      ;({ error } = await supabase.from('skills').insert(payload))
    }
    setSaving(false)
    if (error) { setErrors({ submit: error.message }) } else { onSave() }
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-sm transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">
            <i className={`fas ${skill ? 'fa-edit' : 'fa-plus-circle'} text-blue-600 mr-2`}></i>
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><i className="fas fa-times text-xl"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <select value={form.category_id} onChange={set('category_id')} className={inputClass}>
              <option value="">Select a category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Skill Name <span className="text-red-500">*</span></label>
            <input ref={inputRef} type="text" value={form.name} onChange={set('name')} placeholder="e.g. React.js" className={inputClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Icon Class (Font Awesome)</label>
            <input type="text" value={form.icon} onChange={set('icon')} placeholder="fab fa-react" className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">Preview: <i className={`${form.icon} ${form.color}`}></i></p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Icon Color</label>
              <select value={form.color} onChange={set('color')} className={inputClass}>
                {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c.replace('text-', '')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hover Background</label>
              <select value={form.hover_bg} onChange={set('hover_bg')} className={inputClass}>
                {HOVER_BG_OPTIONS.map((c) => <option key={c} value={c}>{c.replace('hover:bg-', '')}</option>)}
              </select>
            </div>
          </div>
          {errors.submit && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              <i className="fas fa-exclamation-circle shrink-0"></i>{errors.submit}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm flex items-center gap-2 disabled:opacity-60">
              {saving && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
              {skill ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminSkills() {
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  const [categoryModal, setCategoryModal] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const [skillModal, setSkillModal] = useState(null)
  const [showSkillModal, setShowSkillModal] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [toast, setToast] = useState(null)

  function notify(message, type = 'success') { setToast({ message, type }) }

  async function fetchData() {
    const [{ data: cats }, { data: sks }] = await Promise.all([
      supabase.from('skill_categories').select('*').order('sort_order').order('title'),
      supabase.from('skills').select('*').order('sort_order').order('name'),
    ])
    setCategories(cats ?? [])
    setSkills(sks ?? [])
    if (!loading) return
    const ids = new Set((cats ?? []).map((c) => c.id))
    setExpandedCategories(ids)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function toggleCategory(id) {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function skillsFor(categoryId) {
    return skills.filter((s) => s.category_id === categoryId)
  }

  async function handleDeleteCategory() {
    setDeleting(true)
    const { error } = await supabase.from('skill_categories').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (error) { notify('Failed to delete category.', 'error') }
    else { await fetchData(); notify('Category deleted.') }
  }

  async function handleDeleteSkill() {
    setDeleting(true)
    const { error } = await supabase.from('skills').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (error) { notify('Failed to delete skill.', 'error') }
    else { await fetchData(); notify('Skill deleted.') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories · {skills.length} skills</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setSkillModal(null); setShowSkillModal(true) }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition text-sm shadow hover:shadow-md"
          >
            <i className="fas fa-plus"></i>Add Skill
          </button>
          <button
            onClick={() => { setCategoryModal(null); setShowCategoryModal(true) }}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition text-sm shadow hover:shadow-md"
          >
            <i className="fas fa-folder-plus"></i>Add Category
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((__, j) => <div key={j} className="h-14 bg-gray-100 rounded-lg"></div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && categories.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <i className="fas fa-code text-gray-300 text-5xl mb-4"></i>
          <h3 className="text-gray-600 font-semibold text-lg">No skill categories yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">Create a category first, then add skills to it.</p>
          <button onClick={() => { setCategoryModal(null); setShowCategoryModal(true) }} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">
            <i className="fas fa-folder-plus"></i>Add Category
          </button>
        </div>
      )}

      {/* Category list */}
      {!loading && categories.map((cat) => {
        const catSkills = skillsFor(cat.id)
        const expanded = expandedCategories.has(cat.id)
        return (
          <div key={cat.id} className="bg-white rounded-xl shadow overflow-hidden">
            {/* Category header */}
            <div className={`${cat.bg ?? 'bg-blue-100'} px-5 py-4 flex items-center justify-between`}>
              <button className="flex items-center gap-3 flex-1 text-left" onClick={() => toggleCategory(cat.id)}>
                <i className={`${cat.icon} ${cat.title_color ?? 'text-blue-800'} text-lg`}></i>
                <span className={`font-bold text-base ${cat.title_color ?? 'text-blue-800'}`}>{cat.title}</span>
                <span className="text-xs bg-white/60 rounded-full px-2 py-0.5 text-gray-600">{catSkills.length}</span>
                <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-xs text-gray-500 ml-auto`}></i>
              </button>
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setCategoryModal(cat); setShowCategoryModal(true) }} className="p-2 rounded-lg hover:bg-white/50 text-gray-600 hover:text-blue-600 transition" title="Edit category">
                  <i className="fas fa-edit text-sm"></i>
                </button>
                <button onClick={() => setDeleteTarget({ ...cat, _type: 'category' })} className="p-2 rounded-lg hover:bg-white/50 text-gray-600 hover:text-red-600 transition" title="Delete category">
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>

            {/* Skills grid */}
            {expanded && (
              <div className="p-5">
                {catSkills.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No skills in this category yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className={`group relative flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 ${skill.hover_bg} transition-all duration-200`}>
                        <i className={`${skill.icon} ${skill.color} text-2xl`}></i>
                        <span className="mt-1.5 font-semibold text-sm text-gray-700 text-center">{skill.name}</span>
                        {/* Hover actions */}
                        <div className="absolute inset-0 rounded-lg bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => { setSkillModal(skill); setShowSkillModal(true) }} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition" title="Edit">
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                          <button onClick={() => setDeleteTarget({ ...skill, _type: 'skill' })} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition" title="Delete">
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { setSkillModal({ category_id: cat.id }); setShowSkillModal(true) }}
                  className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <i className="fas fa-plus-circle"></i>Add skill to {cat.title}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Modals */}
      {showCategoryModal && (
        <CategoryFormModal
          category={categoryModal}
          onSave={async () => { setShowCategoryModal(false); await fetchData(); notify(categoryModal ? 'Category updated.' : 'Category added.') }}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showSkillModal && (
        <SkillFormModal
          skill={skillModal?.id ? skillModal : null}
          categories={categories}
          onSave={async () => { setShowSkillModal(false); await fetchData(); notify(skillModal?.id ? 'Skill updated.' : 'Skill added.') }}
          onClose={() => setShowSkillModal(false)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${deleteTarget._type === 'category' ? 'Category' : 'Skill'}`}
          message={
            deleteTarget._type === 'category'
              ? `Delete "${deleteTarget.title}"? All skills in this category will also be deleted.`
              : `Delete "${deleteTarget.name}"?`
          }
          onConfirm={deleteTarget._type === 'category' ? handleDeleteCategory : handleDeleteSkill}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
