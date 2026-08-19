import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/common/Card'
import ComplaintChart from '../../components/charts/ComplaintChart'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchAllComplaints } from '../../services/complaintService'
import { SkeletonCard } from '../../components/common/Skeleton'

function monthKey(date) {
  return date.toLocaleDateString(undefined, { month: 'short' })
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchAllComplaints()
      .then((data) => { if (mounted) setComplaints(data) })
      .catch((err) => console.error('Failed to load complaints', err))
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const stats = useMemo(() => {
    const total = complaints.length
    const open = complaints.filter((c) => c.status === 'Pending' || c.status === 'In Review').length
    const resolved = complaints.filter((c) => c.status === 'Resolved').length

    const resolvedDurationsMs = complaints
      .filter((c) => c.status === 'Resolved' && c.createdAt?.toDate && c.updatedAt?.toDate)
      .map((c) => c.updatedAt.toDate().getTime() - c.createdAt.toDate().getTime())
    const avgResponseDays = resolvedDurationsMs.length
      ? (resolvedDurationsMs.reduce((a, b) => a + b, 0) / resolvedDurationsMs.length / (1000 * 60 * 60 * 24)).toFixed(1)
      : '—'

    return [
      { title: 'Total complaints', value: String(total) },
      { title: 'Open', value: String(open) },
      { title: 'Resolved', value: String(resolved) },
      { title: 'Avg response', value: resolvedDurationsMs.length ? `${avgResponseDays} days` : 'N/A' },
    ]
  }, [complaints])

  const chartData = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ month: monthKey(d), year: d.getFullYear(), monthIndex: d.getMonth(), count: 0 })
    }
    complaints.forEach((c) => {
      const created = c.createdAt?.toDate ? c.createdAt.toDate() : null
      if (!created) return
      const bucket = months.find((m) => m.year === created.getFullYear() && m.monthIndex === created.getMonth())
      if (bucket) bucket.count += 1
    })
    return months.map(({ month, count }) => ({ month, count }))
  }, [complaints])

  const priorityCases = useMemo(() => {
    return complaints
      .filter((c) => c.status === 'Escalated' || c.priority === 'High')
      .slice(0, 4)
      .map((c) => ({
        title: c.title ?? 'Untitled complaint',
        status: c.status,
        team: c.department ?? 'Unassigned',
        date: c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
      }))
  }, [complaints])

  const recentActivity = useMemo(() => {
    return [...complaints]
      .sort((a, b) => (b.updatedAt?.toDate?.() ?? 0) - (a.updatedAt?.toDate?.() ?? 0))
      .slice(0, 4)
      .map((c) => ({
        title: `${c.referenceNumber ?? c.title ?? 'Complaint'} — ${c.status}`,
        detail: c.title ?? '',
        time: c.updatedAt?.toDate ? c.updatedAt.toDate().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '',
      }))
  }, [complaints])

  if (loading) return <SkeletonCard className="h-96" />

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
        {stats.map((stat) => (
          <Link key={stat.title} to="/admin/complaints" className="block">
            <Card title={stat.title} value={stat.value} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:shadow-md transition cursor-pointer" />
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Complaint trends</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Monthly volume</h2>
              </div>
            </div>
            <div className="mt-6">
              <ComplaintChart data={chartData} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Priority cases</p>
            <div className="mt-6 space-y-4">
              {priorityCases.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No escalated or high-priority cases right now.</p>
              ) : (
                priorityCases.map((item, i) => (
                  <div key={i} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">{item.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.team} · {item.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Recent activity</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
              ) : (
                recentActivity.map((item, i) => (
                  <li key={i} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{item.time}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
