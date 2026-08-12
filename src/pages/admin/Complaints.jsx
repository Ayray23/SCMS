import { useEffect, useMemo, useState } from 'react'
import { fetchAllComplaints } from '../../services/complaintService'
import { Filter, Search } from 'lucide-react'

const statusGroups = ['All', 'Pending', 'In Review', 'Resolved', 'Escalated']

export default function AdminComplaints() {
  const [items, setItems] = useState([])
  const [activeStatus, setActiveStatus] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const data = await fetchAllComplaints()
      setItems(data)
    }
    load()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = activeStatus === 'All' || item.status === activeStatus
      const matchesSearch = search.length === 0 || item.title.toLowerCase().includes(search.toLowerCase()) || item.referenceNumber.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [items, activeStatus, search])

  const totals = useMemo(() => {
    return {
      total: items.length,
      pending: items.filter((item) => item.status === 'Pending').length,
      inReview: items.filter((item) => item.status === 'In Review').length,
      resolved: items.filter((item) => item.status === 'Resolved').length,
    }
  }, [items])

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Complaint management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">All complaints</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Review every submitted case across departments, prioritize urgent issues, and keep workflows moving.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Total</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{totals.total}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-amber-700">{totals.pending}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Resolved</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{totals.resolved}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1fr_2.4fr] lg:items-end">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Filter status</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {statusGroups.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                    activeStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Search className="h-5 w-5" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search complaints by title or reference"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
            <thead>
              <tr>
                <th className="px-4 py-4 text-slate-500">Reference</th>
                <th className="px-4 py-4 text-slate-500">Title</th>
                <th className="px-4 py-4 text-slate-500">Department</th>
                <th className="px-4 py-4 text-slate-500">Submitted by</th>
                <th className="px-4 py-4 text-slate-500">Status</th>
                <th className="px-4 py-4 text-slate-500">Priority</th>
                <th className="px-4 py-4 text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={7}>
                    No records found for the selected status or search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{item.referenceNumber}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.title}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.department}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.studentName || 'Student'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'In Review'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.priority}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
