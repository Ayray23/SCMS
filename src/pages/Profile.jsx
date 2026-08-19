import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateUserProfile } from '../services/authService'

export default function Profile() {
  const { profile } = useAuth()
  const [fullName, setFullName] = useState(profile?.fullName || '')
  const [email] = useState(profile?.email || '')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  async function save() {
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty')
      return
    }
    setSaving(true)
    try {
      await updateUserProfile({ fullName: fullName.trim() })
      toast.success('Profile updated')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
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
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                <CheckCircle className="h-4 w-4" /> {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button onClick={() => setFullName(profile?.fullName || '')} className="rounded-3xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Account</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p><strong>Role:</strong> {profile?.role ?? 'Student'}</p>
              <p><strong>Matric number:</strong> {profile?.matricNumber ?? 'N/A'}</p>
              <p><strong>Department:</strong> {profile?.department ?? 'N/A'}</p>
              <p className="mt-3">Use the settings page to manage notifications and security options.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
