import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import Card from '../components/common/Card'
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  HelpCircle,
  Menu,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from 'lucide-react'

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

const stats = [
  { label: 'Students', value: '8,900+' },
  { label: 'Departments', value: '26' },
  { label: 'Complaints', value: '4,510' },
  { label: 'Resolved', value: '3,920' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure complaint tracking',
    description: 'Controlled student access with audit-ready case history and secure communication.',
  },
  {
    icon: TrendingUp,
    title: 'Actionable analytics',
    description: 'Trend dashboards and performance metrics for complaint resolution and response time.',
  },
  {
    icon: BookOpen,
    title: 'Structured workflows',
    description: 'Guide complaints through submission, review, assignment, and closure with transparency.',
  },
]

const steps = [
  'Register your account',
  'Submit a complaint',
  'Department review',
  'Issue resolved',
]

const testimonials = [
  {
    quote: 'The system made it easy to file a complaint and track every update without follow-up calls.',
    name: 'Nkechi A.',
    role: 'Final year student',
  },
  {
    quote: 'Staff now get a unified view of incoming complaints and can collaborate faster across departments.',
    name: 'Mrs. Okeke',
    role: 'Student affairs officer',
  },
]

const faqs = [
  {
    question: 'How do I track my complaint?',
    answer: 'After logging in, open My Complaints to see status updates, assigned staff, and resolution notes.',
  },
  {
    question: 'Can I submit more than one complaint?',
    answer: 'Yes. Students can submit multiple complaints, but each should cover a single issue to ensure clear resolution.',
  },
  {
    question: 'Who can access the admin reports?',
    answer: 'Only authorized staff and administrators can view complaint analytics, reports, and audit logs.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  const { profile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/95' : 'bg-transparent'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-600/10">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-600">University</p>
              <p className="text-base font-semibold text-slate-950 dark:text-white">Student Complaint Management</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {profile ? (
              <>
                <Link
                  to={profile.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/auth/login"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white/95 py-4 dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
                  {item.label}
                </a>
              ))}
              {profile ? (
                <>
                  <Link to={profile.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">Dashboard</Link>
                  <Link to="/auth/login" className="rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className="rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">Login</Link>
                  <Link to="/auth/register" className="rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="pt-28">
        <section id="home" className="overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200">
                <Star className="h-4 w-4" /> Trusted by university staff and students
              </div>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">
                  Student Complaint Management System
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  A modern portal for reporting issues, tracking progress, and resolving student complaints with transparency and speed.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={profile ? '/student/new' : '/auth/register'}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Submit Complaint
                </Link>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  Login
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <Card key={item.label} title={item.label} value={item.value} className="text-center hover:shadow-md transition cursor-default" />
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
              <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-blue-100 opacity-70 blur-3xl dark:bg-blue-500/30" />
              <div className="absolute -left-16 bottom-10 h-32 w-32 rounded-full bg-slate-100 opacity-70 blur-3xl dark:bg-slate-700/40" />
              <div className="relative z-10 space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Live workflow</p>
                  <div className="mt-6 space-y-4">
                    {['Complaint Submitted', 'Assigned', 'In Review', 'Resolved'].map((step, index) => (
                      <div key={step} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950 dark:shadow-slate-900/20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">{index + 1}</div>
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{step}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{index === 0 ? 'Student creates a report.' : index === 1 ? 'Staff picks up the case.' : index === 2 ? 'Department works the issue.' : 'Issue is closed with notes.'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Platform snapshot</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Open cases</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">42</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Resolution rate</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">98%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Features</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">Everything you need to manage campus complaints</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Built for students, administrators, and support teams to work together with clarity and accountability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -6 }}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">{feature.description}</p>
                  <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300">
                    Read more <ArrowRight size={16} />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-900 text-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">How it works</p>
                <h2 className="mt-4 text-4xl font-bold">A simple process for every complaint.</h2>
                <p className="mt-4 max-w-2xl text-slate-300">
                  Students submit issues, departments take action, and administrators monitor status from one unified platform.
                </p>
              </div>
              <div className="space-y-5 rounded-[2rem] border border-slate-800 bg-slate-950 p-8 shadow-2xl shadow-slate-950/20">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white">{index + 1}</div>
                    <div>
                      <p className="font-semibold text-white">{step}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {index === 0
                          ? 'Create your student profile and sign in.'
                          : index === 1
                          ? 'Provide accurate details for a quick resolution.'
                          : index === 2
                          ? 'Assigned staff review and respond promptly.'
                          : 'Receive confirmation when the case is closed.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Testimonials</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">Trusted by students and university teams</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">FAQ</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={item.question} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-slate-950 dark:text-white"
                >
                  <span className="text-base font-semibold">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 transition ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer id="contact" className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-3xl bg-blue-600 px-4 py-3 text-white">
                <ShieldCheck size={20} />
                <span className="text-sm font-semibold">University SCMS</span>
              </div>
              <p className="max-w-xs text-slate-600 dark:text-slate-400">
                A professional complaint system for students and university administrators with modern workflows and analytics.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Quick links</p>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400">
                <li><a href="#home" className="transition hover:text-slate-900 dark:hover:text-white">Home</a></li>
                <li><a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="transition hover:text-slate-900 dark:hover:text-white">How it works</a></li>
                <li><a href="#faq" className="transition hover:text-slate-900 dark:hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Support</p>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400">
                <li>Email: support@university.edu</li>
                <li>Phone: +234 800 123 4567</li>
                <li>Office: Admin block, campus center</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Legal</p>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400">
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Terms</a></li>
                <li><a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-7xl px-4 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
            © 2026 University Student Complaint Management System. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}
