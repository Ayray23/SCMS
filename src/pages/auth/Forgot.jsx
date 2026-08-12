import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { sendPasswordReset } from '../../services/authService'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'

export default function Forgot() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)

  async function onSubmit(values) {
    try {
      setLoading(true)
      await sendPasswordReset(values.email)
      toast.success('Password reset email sent. Check your inbox.')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-[1.25rem] bg-white p-8 shadow-lg dark:bg-slate-900">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Reset your password</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your student email to receive reset instructions.</p>
              </div>
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400">Back</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending...
                  </>
                ) : (
                  'Send reset email'
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              Remembered your password? <Link to="/auth/login" className="font-semibold text-blue-600">Login</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
