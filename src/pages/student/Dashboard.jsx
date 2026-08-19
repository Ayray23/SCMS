import { Link } from 'react-router-dom'
import { BarChart3, Clock3, Download, FilePlus, ShieldCheck } from 'lucide-react'
import Card from '../../components/common/Card'
import ComplaintChart from '../../components/charts/ComplaintChart'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { fetchComplaintsByStudent } from '../../services/complaintService'

const stats = [
  { title: 'Total complaints', value: '145', trend: '+12%', description: 'Since last week', icon: <ShieldCheck className="h-6 w-6" /> },
  { title: 'Pending', value: '23', trend: '+4%', description: 'Waiting for review', icon: <BarChart3 className="h-6 w-6" /> },
  { title: 'Resolved', value: '109', trend: '+18%', description: 'Closed cases', icon: <Clock3 className="h-6 w-6" /> },
  { title: 'Escalated', value: '13', trend: '-2%', description: 'Needs attention', icon: <Download className="h-6 w-6" /> },
]

const recentComplaints = [
  { id: '#1024', title: 'Library lighting issue', department: 'Facilities', status: 'Pending', priority: 'High', date: 'Jul 3' },
  { id: '#1021', title: 'Wi-Fi outage in hall 3', department: 'IT Services', status: 'In Review', priority: 'Medium', date: 'Jul 2' },
  { id: '#1018', title: 'Canteen food quality', department: 'Student Affairs', status: 'Resolved', priority: 'Low', date: 'Jun 30' },
]

const activities = [
  { title: 'Student submitted complaint #1024', time: '10 mins ago' },
  { title: 'Lecturer responded to #1018', time: '30 mins ago' },
  { title: 'Admin assigned complaint #1021', time: '2 hrs ago' },
  { title: 'Complaint #1018 marked resolved', time: 'Yesterday' },
]

const notifications = [
  { title: 'New response on #1024', time: '5 mins ago' },
  { title: 'Complaint #1018 resolved', time: '1 hr ago' },
  { title: 'Report available for download', time: 'Today' },
]

const events = [
  { title: 'Resolution deadline for #1024', date: 'Jul 10' },
  { title: 'Review meeting', date: 'Jul 12' },
]

export default function StudentDashboard() {
  const { user, profile } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [statsState, setStatsState] = useState(stats)
  const [recent, setRecent] = useState(recentComplaints)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const id = user?.uid
        if (!id) return
        const data = await fetchComplaintsByStudent(id)
        if (!mounted) return
        setComplaints(data)

        const total = data.length
        const pending = data.filter((c) => c.status === 'Pending').length
        const resolved = data.filter((c) => c.status === 'Resolved').length
        const escalated = data.filter((c) => c.status === 'Escalated').length

        setStatsState([
          { title: 'Total complaints', value: String(total), trend: total ? '+–' : '+0%', description: 'Since last week', icon: <ShieldCheck className="h-6 w-6" /> },
          { title: 'Pending', value: String(pending), trend: pending ? '+–' : '+0%', description: 'Waiting for review', icon: <BarChart3 className="h-6 w-6" /> },
          { title: 'Resolved', value: String(resolved), trend: resolved ? '+–' : '+0%', description: 'Closed cases', icon: <Clock3 className="h-6 w-6" /> },
          { title: 'Escalated', value: String(escalated), trend: escalated ? '-–' : '+0%', description: 'Needs attention', icon: <Download className="h-6 w-6" /> },
        ])

        setRecent(
          data.slice(0, 6).map((d) => ({
            id: d.referenceNumber ?? `#${d.id.slice(0, 6)}`,
            title: d.title ?? 'Untitled',
            department: d.department ?? 'General',
            status: d.status ?? 'Pending',
            priority: d.priority ?? 'Medium',
            date: d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : d.date ?? ''
          }))
        )
      } catch (err) {
        // ignore for now
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])
  const statusClass = (status) =>
    status === 'Resolved'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Pending'
      ? 'bg-amber-100 text-amber-700'
      : status === 'In Review'
      ? 'bg-sky-100 text-sky-700'
      : 'bg-violet-100 text-violet-700'
  return (
    <div className="space-y-8 mt-4">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Good morning, {profile?.fullName?.split(' ')[0] ?? 'Student'} 👋</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Welcome back.</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Here’s today’s complaint overview and the items that need your attention.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/new"
              className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-sm"
            >
              <FilePlus className="h-4 w-4" /> Submit Complaint
            </Link>
            <Link
              to="/student/complaints"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              View Complaints
            </Link>
            <button className="inline-flex items-center justify-center rounded-3xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 shadow-sm">
              <Download className="h-4 w-4" /> Download Report
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statsState.map((stat) => {
          const to =
            stat.title.includes('Total') ? '/student/complaints' : stat.title === 'Pending' ? '/student/complaints?filter=Pending' : stat.title === 'Resolved' ? '/student/complaints?filter=Resolved' : '/student/complaints?filter=Escalated'

          return (
            <Link key={stat.title} to={to} className="block">
              <Card title={stat.title} value={stat.value} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:shadow-md transition cursor-pointer">
                      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>{stat.description}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{stat.trend}</span>
                      </div>
              </Card>
            </Link>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Complaint trends</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">This semester</h2>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">Updated 5 min ago</div>
            </div>
            <div className="mt-6">
              <ComplaintChart
                data={[
                  { month: 'Jan', count: 20 },
                  { month: 'Feb', count: 18 },
                  { month: 'Mar', count: 24 },
                  { month: 'Apr', count: 21 },
                  { month: 'May', count: 28 },
                  { month: 'Jun', count: 23 },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Complaint categories</p>
              <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Academic</span>
                  <span>34%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-blue-600 w-[34%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Hostel</span>
                  <span>22%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-indigo-500 w-[22%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Finance</span>
                  <span>18%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-cyan-500 w-[18%]" />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Resolution rate</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">75%</h3>
                </div>
                <div className="rounded-3xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">+8%</div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p>Average resolution time</p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">1.8 days</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p>Complaints resolved this week</p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">42</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Notifications</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Recent alerts</h3>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">3 new</span>
            </div>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {notifications.map((item) => (
                <li key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Upcoming events</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">2 items</span>
            </div>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {events.map((item) => (
                <li key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Recent complaints</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Live case feed</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Page 1 of 1</span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-slate-500">ID</th>
                  <th className="px-4 py-3 text-slate-500">Title</th>
                  <th className="px-4 py-3 text-slate-500">Department</th>
                  <th className="px-4 py-3 text-slate-500">Status</th>
                  <th className="px-4 py-3 text-slate-500">Priority</th>
                  <th className="px-4 py-3 text-slate-500">Date</th>
                  <th className="px-4 py-3 text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{item.id}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.department}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.priority}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.date}</td>
                    <td className="px-4 py-3">
                      <Link to="/student/complaints" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Recent activity</p>
            <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {activities.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Quick actions</p>
            </div>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Submit new complaint</button>
              <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">View complaint history</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
