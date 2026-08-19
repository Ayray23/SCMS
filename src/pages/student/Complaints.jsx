import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchComplaintsByStudent } from '../../services/complaintService'
import { ArrowRight, Filter, Plus, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { SkeletonTableRow } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'

const filters = ['All', 'Pending', 'In Review', 'Resolved', 'Escalated']

export default function Complaints() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const statusClass = (status) =>
    status === 'Resolved'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Pending'
      ? 'bg-amber-100 text-amber-700'
      : status === 'In Review'
      ? 'bg-sky-100 text-sky-700'
      : 'bg-rose-100 text-rose-700'

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const id = user?.uid
        if (!id) return
        const data = await fetchComplaintsByStudent(id)
        if (!mounted) return
        setItems(
          data.map((d) => ({
            ...d,
            referenceNumber: d.referenceNumber ?? `#${d.id.slice(0, 6)}`,
            date: d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : d.date ?? ''
          }))
        )
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter = activeFilter === 'All' || item.status === activeFilter
      const matchesQuery = query.length === 0 || item.title.toLowerCase().includes(query.toLowerCase()) || item.referenceNumber.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [items, activeFilter, query])

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">My complaints</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Track every submission</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Review the status of your complaints, see updates, and follow up on actions taken by the university.
            </p>
          </div>
          <Link
            to="/student/new"
            className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> New complaint
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-[1fr_2.2fr] lg:items-end">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Status</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Search className="h-5 w-5" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
                <th className="px-4 py-4 text-slate-500">Priority</th>
                <th className="px-4 py-4 text-slate-500">Status</th>
                <th className="px-4 py-4 text-slate-500">Date</th>
                <th className="px-4 py-4 text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6">
                    <EmptyState
                      title={items.length === 0 ? 'No complaints yet' : 'No matching complaints'}
                      description={items.length === 0 ? 'Submit your first complaint to get started.' : 'Try adjusting your filters or search.'}
                      action={
                        items.length === 0 ? (
                          <Link
                            to="/student/new"
                            className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                          >
                            <Plus className="h-4 w-4" /> Create complaint
                          </Link>
                        ) : null
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{item.referenceNumber}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.department}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.date}</td>
                    <td className="px-4 py-3">
                      <Link to={`/student/complaints/${item.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
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
