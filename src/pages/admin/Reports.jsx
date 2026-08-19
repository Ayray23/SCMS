import { useEffect, useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ComplaintChart from '../../components/charts/ComplaintChart'
import { fetchAllComplaints } from '../../services/complaintService'
import { SkeletonCard } from '../../components/common/Skeleton'

const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90, '12m': 365 }

function toCsv(rows, headers) {
  const escape = (val) => {
    const str = String(val ?? '')
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const lines = [headers.map(escape).join(',')]
  rows.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(',')))
  return lines.join('\n')
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AdminReports() {
  const [range, setRange] = useState('30d')
  const [groupBy, setGroupBy] = useState('status')
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

  const filtered = useMemo(() => {
    const days = RANGE_DAYS[range] ?? 30
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    return complaints.filter((c) => {
      const created = c.createdAt?.toDate ? c.createdAt.toDate().getTime() : null
      return created ? created >= cutoff : true
    })
  }, [complaints, range])

  const chartData = useMemo(() => {
    const days = RANGE_DAYS[range] ?? 30
    const months = Math.max(1, Math.ceil(days / 30))
    const now = new Date()
    const buckets = []
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({ month: d.toLocaleDateString(undefined, { month: 'short' }), year: d.getFullYear(), monthIndex: d.getMonth(), count: 0 })
    }
    filtered.forEach((c) => {
      const created = c.createdAt?.toDate ? c.createdAt.toDate() : null
      if (!created) return
      const bucket = buckets.find((b) => b.year === created.getFullYear() && b.monthIndex === created.getMonth())
      if (bucket) bucket.count += 1
    })
    return buckets.map(({ month, count }) => ({ month, count }))
  }, [filtered, range])

  const summary = useMemo(() => ({
    total: filtered.length,
    resolved: filtered.filter((c) => c.status === 'Resolved').length,
  }), [filtered])

  const breakdown = useMemo(() => {
    const key = groupBy === 'department' ? 'department' : groupBy === 'priority' ? 'priority' : 'status'
    const counts = {}
    filtered.forEach((c) => {
      const label = c[key] || 'Unspecified'
      counts[label] = (counts[label] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [filtered, groupBy])

  function exportFull() {
    if (filtered.length === 0) {
      toast.error('No complaints in the selected range to export')
      return
    }
    const headers = ['referenceNumber', 'title', 'department', 'category', 'priority', 'status', 'studentName', 'studentMatric']
    const csv = toCsv(filtered, headers)
    downloadCsv(`scms-complaints-${range}.csv`, csv)
    toast.success('Full report downloaded')
  }

  function exportSummary() {
    const headers = [groupBy, 'count']
    const rows = breakdown.map(([label, count]) => ({ [groupBy]: label, count }))
    const csv = toCsv(rows, headers)
    downloadCsv(`scms-summary-${groupBy}-${range}.csv`, csv)
    toast.success('Summary downloaded')
  }

  if (loading) return <SkeletonCard className="h-96" />

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Reports</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Analytics & exports</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Generate and export operational reports for complaint volume, resolution times, and trends.</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <button onClick={exportFull} className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Complaint trends</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Volume over time</h2>
              </div>
            </div>
            <div className="mt-6">
              <ComplaintChart data={chartData} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Summary</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card title="Total complaints" value={String(summary.total)} />
              <Card title="Resolved" value={String(summary.resolved)} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Breakdown by</p>
            <div className="mt-6 space-y-3">
              {['status', 'department', 'priority'].map((key) => (
                <button
                  key={key}
                  onClick={() => setGroupBy(key)}
                  className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium capitalize transition ${
                    groupBy === key ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  By {key}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              {breakdown.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No data in this range.</p>
              ) : (
                breakdown.map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2 dark:bg-slate-900">
                    <span className="text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Exports</p>
            <div className="mt-6 space-y-3">
              <button onClick={exportFull} className="w-full inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                <FileText className="h-4 w-4" /> Download full report
              </button>
              <button onClick={exportSummary} className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                Download summary ({groupBy})
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
