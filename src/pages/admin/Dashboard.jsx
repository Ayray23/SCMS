import Card from '../../components/common/Card'
import ComplaintChart from '../../components/charts/ComplaintChart'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const stats = [
  { title: 'Total complaints', value: '124' },
  { title: 'Open', value: '26' },
  { title: 'Resolved', value: '90' },
  { title: 'Avg response', value: '1.2 days' },
]

const insights = [
  { title: 'Pending approvals', value: '12', detail: 'Awaiting department review.' },
  { title: 'Staff response rate', value: '96%', detail: 'Last 30 days team performance.' },
]

const topCases = [
  { title: 'Safety review request', status: 'Escalated', team: 'Security', date: 'Jul 2' },
  { title: 'Hostel cleaning backlog', status: 'In Review', team: 'Facilities', date: 'Jul 1' },
]

const activity = [
  { title: 'New complaint assigned to Admin', detail: 'Complaint #1021 moved to review.', time: '25 mins ago' },
  { title: 'Report generated', detail: 'Daily summary is ready.', time: '1 hr ago' },
  { title: 'Case #1018 closed', detail: 'Resolved by the student affairs team.', time: 'Yesterday' },
]

export default function AdminDashboard() {
  const { profile } = useAuth()
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Administrator overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Campus operations at a glance</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Welcome back, {profile?.fullName ?? 'Administrator'}. Monitor the complaint lifecycle, prioritize critical cases, and keep teams aligned.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/admin/complaints" className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Review cases</Link>
            <Link to="/admin/complaints" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">Manage cases</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const to = stat.title === 'Total complaints' ? '/admin/complaints' : '/admin/complaints'
          return (
            <Link key={stat.title} to={to} className="block">
              <Card title={stat.title} value={stat.value} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:shadow-md transition cursor-pointer" />
            </Link>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Complaint trends</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Monthly volume</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">Healthy</span>
            </div>
            <div className="mt-6">
              <ComplaintChart
                data={[
                  { month: 'Jan', count: 24 },
                  { month: 'Feb', count: 30 },
                  { month: 'Mar', count: 18 },
                  { month: 'Apr', count: 40 },
                  { month: 'May', count: 8 },
                  { month: 'Jun', count: 4 },
                ]}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Operational insights</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {insights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Priority cases</p>
            <div className="mt-6 space-y-4">
              {topCases.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">{item.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.team} · {item.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Recent activity</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {activity.map((item) => (
                <li key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{item.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
