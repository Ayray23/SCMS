import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { getComplaintById, updateComplaint, addComplaintEvent, fetchComplaintEvents, withdrawComplaint } from '../../services/complaintService'
import { useAuth } from '../../context/AuthContext'
import { SkeletonCard } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [reply, setReply] = useState('')
  const [adminSaving, setAdminSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getComplaintById(id)
        if (!mounted) return
        setComplaint(data)
        setForm({ title: data?.title ?? '', description: data?.description ?? '', priority: data?.priority ?? '' })
        try {
          const ev = await fetchComplaintEvents(id)
          if (mounted) setEvents(ev)
        } catch (e) {
          console.warn('Failed to load events', e)
        }
      } catch (err) {
        // if error, navigate back
        console.error(err)
        if (mounted) navigate('/student/complaints')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id, navigate])

  if (loading) return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student/complaints" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        </div>
      </div>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
  if (!complaint) return <div className="p-8">Complaint not found.</div>

  const created = complaint.createdAt && complaint.createdAt.toDate ? complaint.createdAt.toDate().toLocaleString() : complaint.date ?? ''

  async function saveEdit() {
    setError(null)
    setSaving(true)
    const prev = { ...complaint }
    const updated = { ...complaint, ...form }
    setComplaint(updated)
    try {
      await updateComplaint(complaint.id, { title: form.title, description: form.description, priority: form.priority })
      try {
        await addComplaintEvent(complaint.id, {
          type: 'edit',
          actorId: profile?.uid ?? null,
          actorName: profile?.fullName ?? profile?.email ?? 'User',
          note: 'Complaint details updated'
        })
        const ev = await fetchComplaintEvents(complaint.id)
        setEvents(ev)
      } catch (e) {
        console.warn('Failed to record event', e)
      }
      toast.success('Complaint updated')
      setEditing(false)
    } catch (err) {
      console.error(err)
      setComplaint(prev)
      setError('Failed to save changes.')
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function submitAdminReply(status) {
    if (!isAdmin) return
    setError(null)
    setAdminSaving(true)
    const prev = { ...complaint }
    const updated = { ...complaint, resolutionNote: reply, status }
    setComplaint(updated)
    try {
      await updateComplaint(complaint.id, { resolutionNote: reply, status })
      try {
        await addComplaintEvent(complaint.id, {
          type: 'status_change',
          actorId: profile?.uid ?? null,
          actorName: profile?.fullName ?? profile?.email ?? 'Admin',
          note: `Status changed to ${status}`,
          metadata: { resolutionNote: reply }
        })
        const ev = await fetchComplaintEvents(complaint.id)
        setEvents(ev)
      } catch (e) {
        console.warn('Failed to record event', e)
      }
      toast.success('Update saved')
      setReply('')
    } catch (err) {
      console.error(err)
      setComplaint(prev)
      setError('Failed to submit reply.')
      toast.error('Failed to submit')
    } finally {
      setAdminSaving(false)
    }
  }

  async function handleWithdraw() {
    if (complaint.status !== 'Pending') {
      toast.error('Only pending complaints can be withdrawn.')
      return
    }
    if (!window.confirm('Are you sure you want to withdraw this complaint?')) return
    setAdminSaving(true)
    const prev = { ...complaint }
    try {
      await withdrawComplaint(complaint.id)
      await addComplaintEvent(complaint.id, {
        type: 'withdrawn',
        actorId: profile?.uid ?? null,
        actorName: profile?.fullName ?? profile?.email ?? 'Student',
        note: 'Complaint withdrawn by student'
      })
      const updated = { ...complaint, status: 'Withdrawn' }
      setComplaint(updated)
      const ev = await fetchComplaintEvents(complaint.id)
      setEvents(ev)
      toast.success('Complaint withdrawn successfully.')
    } catch (err) {
      console.error(err)
      setComplaint(prev)
      toast.error('Failed to withdraw complaint.')
    } finally {
      setAdminSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student/complaints" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {!isAdmin && complaint?.status === 'Pending' && (
            <button onClick={handleWithdraw} disabled={adminSaving} className="inline-flex items-center gap-2 rounded-3xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60">
              Withdraw
            </button>
          )}
          {!editing ? (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              <Edit3 className="h-4 w-4" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60">
                Save
              </button>
              <button onClick={() => { setEditing(false); setForm({ title: complaint.title, description: complaint.description, priority: complaint.priority }) }} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full lg:w-[60%]">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none min-h-[120px]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))} className="mt-2 w-40 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                {error && <p className="text-sm text-rose-600">{error}</p>}
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{complaint.title}</h1>
                <p className="mt-1 text-sm text-slate-500">Reference: <span className="font-medium text-slate-900">{complaint.referenceNumber ?? `#${complaint.id?.slice(0,6)}`}</span></p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{complaint.description}</p>
              </>
            )}
          </div>

          <div className="mt-4 w-full max-w-xs space-y-3 lg:mt-0">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500">Status</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{complaint.status}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500">Priority</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{complaint.priority ?? 'Medium'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500">Department</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{complaint.department ?? complaint.assignedDepartment ?? 'General'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500">Submitted</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{created}</p>
            </div>
          </div>
        </div>

        {complaint.resolutionNote && (
          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Resolution note</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{complaint.resolutionNote}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tracking timeline</h3>
          <p className="mt-2 text-sm text-slate-500">Events recorded for this complaint.</p>
          <div className="mt-4 space-y-3">
            {events.length === 0 ? (
              <div className="text-sm text-slate-500">No timeline events yet.</div>
            ) : (
              events.map((ev) => {
                const when = ev.createdAt && ev.createdAt.toDate ? ev.createdAt.toDate().toLocaleString() : ''
                return (
                  <div key={ev.id} className="flex items-start gap-3">
                    <div className="h-3 w-3 shrink-0 rounded-full bg-blue-600 mt-2" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{ev.actorName ?? 'System'}</p>
                        <p className="text-xs text-slate-400">{when}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ev.note}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Admin reply</h3>
            <p className="mt-2 text-sm text-slate-500">Post a response and update the status.</p>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none min-h-[100px]" />
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
            <div className="mt-3 flex items-center gap-2">
              <button disabled={adminSaving} onClick={() => submitAdminReply('In Review')} className="rounded-3xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60">Mark In Review</button>
              <button disabled={adminSaving} onClick={() => submitAdminReply('Resolved')} className="rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">Resolve</button>
              <button disabled={adminSaving} onClick={() => submitAdminReply('Escalated')} className="rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60">Escalate</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
