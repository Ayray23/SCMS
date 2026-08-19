import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile, changePassword } from '../services/authService'

export default function Settings() {
  const { profile } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(profile?.emailNotifications ?? true)
  const [smsNotifications, setSmsNotifications] = useState(profile?.smsNotifications ?? false)
  const [savingPrefs, setSavingPrefs] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  async function savePrefs() {
    setSavingPrefs(true)
    try {
      await updateUserProfile({ emailNotifications, smsNotifications })
      toast.success('Settings saved')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSavingPrefs(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error('Fill in both password fields')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setChangingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      toast.success('Password updated')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      const message =
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Current password is incorrect'
          : err.message || 'Failed to change password'
      toast.error(message)
    } finally {
      setChangingPassword(false)
    }
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
              <button onClick={savePrefs} disabled={savingPrefs} className="rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {savingPrefs ? 'Saving…' : 'Save preferences'}
              </button>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Security</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>Update the password used to sign in to your account.</p>
            </div>

            {!showPasswordForm ? (
              <div className="mt-6">
                <button onClick={() => setShowPasswordForm(true)} className="rounded-3xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Change password</button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {changingPassword ? 'Updating…' : 'Update password'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="rounded-3xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
