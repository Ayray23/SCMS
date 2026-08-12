import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { loginStudent } from '../../services/authService'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  async function onSubmit(values) {
    setLoginError('')
    try {
      setLoading(true)
      await loginStudent(values.email, values.password)
      toast.success('Welcome back 👋')
      const from = location.state?.from?.pathname || '/student/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      const message = err.message || 'Login failed'
      setLoginError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/20 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="flex items-center gap-3 text-slate-500">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em]">University Portal</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-950 dark:text-white">Welcome back</h1>
              <p className="max-w-2xl text-slate-600 dark:text-slate-400">
                Sign in to continue with your student complaint dashboard and manage cases from one secure portal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Realtime updates</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Track the status of your complaints in real time.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Secure access</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Your data is protected with university-grade authentication.</p>
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Student login</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Sign in</h2>
              </div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                <ArrowLeft size={16} /> Back to home
              </Link>
            </div>

            {loginError && (
              <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Password
                </label>
                <div className="relative mt-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 characters required',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  Remember me
                </label>
                <Link to="/auth/forgot" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="relative my-6 text-center text-sm text-slate-400 dark:text-slate-500">
              <span className="bg-slate-50 px-3 dark:bg-slate-950">or continue with</span>
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don’t have an account?{' '}
              <Link to="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">
                Register now
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
