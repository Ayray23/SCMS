import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { SkeletonCard } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', code: '' })

  useEffect(() => {
    // Load departments from localStorage (demo)
    const stored = localStorage.getItem('scms-departments')
    setDepartments(stored ? JSON.parse(stored) : [])
    setLoading(false)
  }, [])

  const handleSave = () => {
    if (!form.name) {
      toast.error('Department name is required')
      return
    }

    let updated
    if (editingId) {
      updated = departments.map(d => d.id === editingId ? { ...d, ...form, updatedAt: new Date().toISOString() } : d)
      toast.success('Department updated')
    } else {
      updated = [...departments, { id: Date.now(), ...form, createdAt: new Date().toISOString() }]
      toast.success('Department created')
    }

    setDepartments(updated)
    localStorage.setItem('scms-departments', JSON.stringify(updated))
    setForm({ name: '', description: '', code: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (dept) => {
    setForm(dept)
    setEditingId(dept.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this department?')) return
    const updated = departments.filter(d => d.id !== id)
    setDepartments(updated)
    localStorage.setItem('scms-departments', JSON.stringify(updated))
    toast.success('Department deleted')
  }

  const handleCancel = () => {
    setForm({ name: '', description: '', code: '' })
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
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Departments</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" /> Add Department
            </button>
          )}
        </div>
      </section>

      {showForm && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {editingId ? 'Edit Department' : 'New Department'}
          </h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="e.g., Student Affairs"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="e.g., SA01"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Department description"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="rounded-3xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Save
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
        {departments.length === 0 ? (
          <EmptyState
            title="No departments"
            description="Create your first department to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-slate-500">Name</th>
                  <th className="px-4 py-4 text-slate-500">Code</th>
                  <th className="px-4 py-4 text-slate-500">Description</th>
                  <th className="px-4 py-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{dept.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{dept.code}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{dept.description}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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
