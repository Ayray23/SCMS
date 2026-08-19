import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { SkeletonCard } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { fetchFaculties, createFaculty, updateFaculty, deleteFaculty } from '../../services/referenceDataService'

export default function AdminFaculties() {
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', dean: '' })

  async function load() {
    setLoading(true)
    try {
      const data = await fetchFaculties()
      setFaculties(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load faculties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Faculty name is required')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateFaculty(editingId, form)
        toast.success('Faculty updated')
      } else {
        await createFaculty(form)
        toast.success('Faculty created')
      }
      await load()
      setForm({ name: '', description: '', dean: '' })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to save faculty')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (faculty) => {
    setForm({ name: faculty.name ?? '', description: faculty.description ?? '', dean: faculty.dean ?? '' })
    setEditingId(faculty.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty?')) return
    try {
      await deleteFaculty(id)
      setFaculties((prev) => prev.filter((f) => f.id !== id))
      toast.success('Faculty deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete faculty')
    }
  }

  const handleCancel = () => {
    setForm({ name: '', description: '', dean: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <SkeletonCard className="h-96" />

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Manage System</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Faculties</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              These faculties appear as options for students during registration.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" /> Add Faculty
            </button>
          )}
        </div>
      </section>

      {showForm && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {editingId ? 'Edit Faculty' : 'New Faculty'}
          </h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Faculty Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="e.g., Faculty of Science"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dean Name</label>
              <input
                type="text"
                value={form.dean}
                onChange={(e) => setForm({ ...form, dean: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Dean's name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Faculty description"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-3xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-3xl border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {faculties.length === 0 ? (
          <EmptyState
            title="No faculties"
            description="Create your first faculty to get started. Students won't be able to register until at least one exists."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-slate-500">Name</th>
                  <th className="px-4 py-4 text-slate-500">Dean</th>
                  <th className="px-4 py-4 text-slate-500">Description</th>
                  <th className="px-4 py-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {faculties.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{faculty.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{faculty.dean}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{faculty.description}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(faculty)}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faculty.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
