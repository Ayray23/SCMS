import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Filter, FileText, BarChart3 } from 'lucide-react'
import Card from '../../components/common/Card'
import ComplaintChart from '../../components/charts/ComplaintChart'

export default function AdminReports() {
  const [range, setRange] = useState('30d')
  const [data, setData] = useState([])

  useEffect(() => {
    // Placeholder: replace with real data fetch
    setData([
      { month: 'Jan', count: 24 },
      { month: 'Feb', count: 30 },
      { month: 'Mar', count: 18 },
      { month: 'Apr', count: 40 },
      { month: 'May', count: 8 },
      { month: 'Jun', count: 4 },
    ])
  }, [range])

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
            <button className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
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
              <div className="rounded-3xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">Preview</div>
            </div>
            <div className="mt-6">
              <ComplaintChart data={data} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Summary</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card title="Total complaints" value="1,420" />
              <Card title="Resolved" value="1,120" />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Quick filters</p>
              <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <button className="w-full rounded-3xl bg-slate-50 px-4 py-3 text-left">By department</button>
              <button className="w-full rounded-3xl bg-slate-50 px-4 py-3 text-left">By priority</button>
              <button className="w-full rounded-3xl bg-slate-50 px-4 py-3 text-left">By status</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Exports</p>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Download full report</button>
              <button className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm">Download summary</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
