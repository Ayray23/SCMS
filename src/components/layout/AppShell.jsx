import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell,
  Moon,
  Sun,
  Home,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  CalendarDays,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDarkMode } from '../../context/DarkModeContext'
import { logoutStudent } from '../../services/authService'
import { fetchUserNotifications, markNotificationRead } from '../../services/notificationService'

const studentNavItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: Home },
  { to: '/student/new', label: 'Submit Complaint', icon: ClipboardList },
  { to: '/student/complaints', label: 'My Complaints', icon: Layers },
  { to: '/student/profile', label: 'Profile', icon: Users },
  { to: '/student/settings', label: 'Settings', icon: Settings },
  { to: '#', label: 'Help', icon: HelpCircle, disabled: true },
  { to: '#', label: 'Logout', icon: LogOut, action: 'logout' },
]

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/complaints', label: 'Complaints', icon: ClipboardList },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '#', label: 'Users', icon: Users, disabled: true },
  { to: '#', label: 'Students', icon: Layers, disabled: true },
  { to: '/admin/departments', label: 'Departments', icon: CalendarDays },
  { to: '/admin/faculties', label: 'Faculties', icon: ShieldCheck },
  { to: '#', label: 'Audit Logs', icon: Layers, disabled: true },
  { to: '#', label: 'System Settings', icon: Settings, disabled: true },
  { to: '/admin/profile', label: 'Profile', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '#', label: 'Logout', icon: LogOut, action: 'logout' },
]

export default function AppShell({ children }) {
  const { user, profile } = useAuth()
  const { isDark, toggle: toggleDarkMode } = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const navItems = profile?.role === 'admin' ? adminNavItems : studentNavItems

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (!user?.uid) return
    fetchUserNotifications(user.uid)
      .then((data) => { if (mounted) setNotifications(data) })
      .catch((err) => console.error('Failed to load notifications', err))
    return () => { mounted = false }
  }, [user])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  async function handleMarkRead(notif) {
    if (notif.read) return
    try {
      await markNotificationRead(notif.id)
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)))
    } catch (err) {
      console.error('Failed to mark notification read', err)
    }
  }

  const handleNavAction = (item) => {
    if (item.action === 'logout') {
      logoutStudent()
    }
  }

  const basePath = profile?.role === 'admin' ? '/admin' : '/student'

  return (
    <div className={`${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <header className=" fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/95">
        <div className="mx-auto  flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            <div className="hidden sm:flex flex-col gap-1">
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">Dashboard</p>
              <h1 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{profile?.role === 'admin' ? 'Administrator Portal' : 'Student Portal'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
                >
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => handleMarkRead(notif)}
                        className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100 font-medium'
                        }`}
                      >
                        <p>{notif.title}</p>
                        {notif.message && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notif.message}</p>}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="inline-flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white">{profile?.fullName?.[0] ?? 'U'}</span>
                <span className="hidden sm:block text-sm font-medium text-slate-900 dark:text-slate-100">{profile?.fullName ?? 'User'}</span>
              </button>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
                >
                  <Link to={`${basePath}/profile`} className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">My Profile</Link>
                  <Link to={`${basePath}/settings`} className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Settings</Link>
                  <Link to={`${basePath}/settings`} className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Security</Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      logoutStudent()
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-8">
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 top-16 z-30 bg-slate-950/50 lg:hidden"
              aria-hidden="true"
            />
          )}
          <aside
            className={`fixed inset-y-0 left-0 top-16 z-40 w-[85vw] max-w-xs overflow-y-auto rounded-none border-r border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-20 lg:z-20 lg:mt-6 lg:h-[calc(100vh-6rem)] lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-[2rem] lg:border lg:shadow-xl lg:shadow-slate-900/5 lg:bg-white/95 lg:dark:bg-slate-950/95 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center gap-3 rounded-3xl bg-blue-600 px-4 py-4 text-white shadow-sm">
              <div className="rounded-2xl bg-white/20 p-3">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-blue-100">University</p>
                <p className="font-semibold text-white">Student Complaint System</p>
              </div>
            </div>

                {/* Reports link handled inside navItems */}
            <div className="mt-6">
              <NavLink onClick={closeSidebarOnMobile} to="/" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <Home className="h-4 w-4" />
                Home
              </NavLink>
            </div>

            <div className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const itemClasses = ({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    item.disabled
                      ? 'cursor-not-allowed text-slate-400 opacity-60'
                      : isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`

                if (item.disabled) {
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-400 transition dark:text-slate-500">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  )
                }

                if (item.action === 'logout') {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        handleNavAction(item)
                        closeSidebarOnMobile()
                      }}
                      className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                }

                return (
                  <NavLink key={item.label} to={item.to} onClick={closeSidebarOnMobile} className={itemClasses}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </aside>

          <main className="min-h-[calc(100vh-4rem)] pb-10 lg:min-w-0">
            <div className="mx-auto min-w-0 w-full max-w-7xl space-y-6 sm:space-y-10">
              {children}
              <footer className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 text-sm text-slate-500 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-400">
                <p>Need help? Visit the support center or contact your university IT services.</p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
