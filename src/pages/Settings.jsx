import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  function save() {
    // Placeholder: save settings
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Settings</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Preferences & security</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Adjust notification preferences and security options for your account.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="accent-blue-600" />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} className="accent-blue-600" />
                <span className="text-sm">SMS notifications</span>
              </label>
            </div>
            <div className="mt-6">
              <button onClick={save} className="rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save preferences</button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Security</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>Change password and enable two-factor authentication in your university account settings.</p>
            </div>
            <div className="mt-6">
              <button className="rounded-3xl border border-slate-200 px-4 py-2 text-sm">Change password</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
