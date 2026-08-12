import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { profile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.fullName || '')
  const [email] = useState(profile?.email || '')
  const navigate = useNavigate()

  function save() {
    // Placeholder: persist profile changes to backend
    setEditing(false)
    toast.success('Profile updated')
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Profile</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Your account</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage your personal details and account settings.</p>
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold"
            >
              Back
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile details</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Email</label>
                <input value={email} disabled className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800 dark:bg-slate-950" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                <CheckCircle className="h-4 w-4" /> Save changes
              </button>
              <button onClick={() => { setFullName(profile?.fullName || ''); setEditing(false) }} className="rounded-3xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Account</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p><strong>Role:</strong> {profile?.role ?? 'Student'}</p>
              <p><strong>UID:</strong> {profile?.uid ?? 'N/A'}</p>
              <p className="mt-3">Use the settings page to manage notifications and security options.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
