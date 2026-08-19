import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { registerStudent } from '../../services/authService'
import { fetchDepartments, fetchFaculties } from '../../services/referenceDataService'
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react'

// Fallback options so registration works on day one, before an admin has
// added any real departments/faculties via the admin panel. Once real ones
// exist in Firestore they're merged in alongside these (deduped by name),
// so this list never blocks or hides anything an admin adds later.
const DEFAULT_DEPARTMENTS = [
  'Computer Science',
  'Electrical/Electronic Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Accounting',
  'Business Administration',
  'Economics',
  'Mass Communication',
  'Law',
  'Medicine and Surgery',
  'Nursing Science',
  'Biochemistry',
  'Microbiology',
  'Physics',
  'Chemistry',
  'Mathematics',
  'English Language',
  'Political Science',
  'Sociology',
  'Architecture',
]

const DEFAULT_FACULTIES = [
  'Faculty of Science',
  'Faculty of Engineering',
  'Faculty of Arts',
  'Faculty of Social Sciences',
  'Faculty of Law',
  'Faculty of Basic Medical Sciences',
  'Faculty of Clinical Sciences',
  'Faculty of Technology',
  'Faculty of Education',
  'Faculty of Agriculture',
]

// Combine fetched Firestore options with the fallback list, preferring the
// Firestore entry when a name appears in both (it may carry a real id/code).
function mergeOptions(fetched, fallbackNames) {
  const byName = new Map()
  fallbackNames.forEach((name) => byName.set(name.toLowerCase(), { id: name, name }))
  fetched.forEach((item) => byName.set(item.name.toLowerCase(), item))
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const password = watch('password', '')
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS.map((name) => ({ id: name, name })))
  const [faculties, setFaculties] = useState(DEFAULT_FACULTIES.map((name) => ({ id: name, name })))
  const [optionsLoading, setOptionsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadOptions() {
      try {
        const [depts, facs] = await Promise.all([fetchDepartments(), fetchFaculties()])
        if (!mounted) return
        setDepartments(mergeOptions(depts, DEFAULT_DEPARTMENTS))
        setFaculties(mergeOptions(facs, DEFAULT_FACULTIES))
      } catch (err) {
        // Fall back to the built-in lists above (already the initial state)
        // - this keeps registration working even if Firestore isn't reachable
        // yet (fresh project, rules not deployed, or offline).
        console.warn('Could not load departments/faculties from the database, using defaults', err)
      } finally {
        if (mounted) setOptionsLoading(false)
      }
    }
    loadOptions()
    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(values) {
    if (values.password !== values.confirmPassword) {
      return toast.error('Passwords do not match')
    }

    try {
      setLoading(true)
      await registerStudent({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        matricNumber: values.matricNumber,
        department: values.department,
        faculty: values.faculty,
        level: values.level,
        role: 'student',
      })
      toast.success('Account created successfully. Check your email to verify your account.')
      navigate('/auth/login')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/20 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="flex items-center gap-3 text-slate-500">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em]">Register new account</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-950 dark:text-white">Create your student account</h1>
              <p className="max-w-2xl text-slate-600 dark:text-slate-400">
                Join the campus complaint portal to submit issues, follow case updates, and receive timely resolutions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Guided onboarding</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Complete your profile and start submitting complaints in minutes.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Secure access</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Account security is enforced with university standards and safe login flows.</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Users className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold">What to expect</p>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li>• Provide your student details and complaint profile.</li>
                <li>• Keep your information accurate for fast case handling.</li>
                <li>• Use the portal to track complaint updates from start to finish.</li>
              </ul>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Create account</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Register</h2>
              </div>
              <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                <ArrowLeft size={16} /> Already have an account
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <User className="h-4 w-4" /> Full name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Student email
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

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Matric number</span>
                  <input
                    type="text"
                    placeholder="12345678"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    {...register('matricNumber', { required: 'Matric number is required' })}
                  />
                  {errors.matricNumber && <p className="mt-2 text-sm text-red-600">{errors.matricNumber.message}</p>}
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                  <select
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"

                    {...register('department', { required: 'Department is required' })}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>}
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Level</span>
                  <input
                    type="text"
                    placeholder="300"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    {...register('level')}
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Faculty</span>
                  <select
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"

                    {...register('faculty', { required: 'Faculty is required' })}
                  >
                    <option value="">Select faculty</option>
                    {faculties.map((fac) => (
                      <option key={fac.id} value={fac.name}>{fac.name}</option>
                    ))}
                  </select>
                  {errors.faculty && <p className="mt-2 text-sm text-red-600">{errors.faculty.message}</p>}
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Password
                </label>
                <div className="relative mt-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
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

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('confirmPassword', {
                    required: 'Confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <input type="checkbox" className="accent-blue-600" id="terms" />
                <label htmlFor="terms">I agree to the privacy policy and terms of use.</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">
                Login here
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
