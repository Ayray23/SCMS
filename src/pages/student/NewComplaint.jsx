import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createComplaint, uploadAttachment } from '../../services/complaintService'
import { fetchDepartments } from '../../services/referenceDataService'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, CheckCircle, FileText, ShieldCheck, Upload } from 'lucide-react'

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024 // must match storage.rules

export default function NewComplaint() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const fileInputRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  const DRAFT_KEY = 'scms-draft-complaint'

  useEffect(() => {
    const draftJson = localStorage.getItem(DRAFT_KEY)
    if (draftJson) {
      try {
        const draft = JSON.parse(draftJson)
        reset(draft)
        if (draft.attachmentName) {
          // we can't restore File objects from localStorage; show name as hint
          setAttachmentFile({ name: draft.attachmentName })
        }
        toast.success('Loaded saved draft')
      } catch (e) {
        console.warn('Failed to load draft', e)
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true
    fetchDepartments()
      .then((data) => { if (mounted) setDepartments(data) })
      .catch((err) => console.error('Failed to load departments', err))
      .finally(() => { if (mounted) setDepartmentsLoading(false) })
    return () => { mounted = false }
  }, [])

  function handleFileSelect(file) {
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      toast.error('Attachment must be smaller than 10MB')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setAttachmentFile(file)
  }

  async function onSubmit(values) {
    if (!user) {
      toast.error('You must be logged in to submit a complaint')
      return
    }
    try {
      let attachmentUrl = null
      let attachmentName = null

      if (attachmentFile) {
        // if attachmentFile is a plain object (restored draft hint) we require reattach
        if (attachmentFile instanceof File) {
          attachmentUrl = await uploadAttachment(attachmentFile, user.uid)
          attachmentName = attachmentFile.name
        } else if (attachmentFile && attachmentFile.name) {
          attachmentName = attachmentFile.name
        }
      }

      await createComplaint({
        studentId: user.uid,
        studentName: profile?.fullName ?? null,
        studentMatric: profile?.matricNumber ?? null,
        referenceNumber: `SCMS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`,
        title: values.title,
        category: values.category,
        department: values.department,
        priority: values.priority,
        description: values.description,
        attachmentUrl,
        attachmentName,
      })
      toast.success('Complaint submitted successfully')
      setSubmitted(true)
      reset()
      setAttachmentFile(null)
      localStorage.removeItem(DRAFT_KEY)
      navigate('/student/complaints')
    } catch (err) {
      toast.error(err.message || 'Submission failed')
    }
  }

  function saveDraft() {
    const values = new FormData(document.querySelector('form'))
    const draft = Object.fromEntries(values.entries())
    if (attachmentFile && attachmentFile.name) draft.attachmentName = attachmentFile.name
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    toast.success('Draft saved locally')
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-blue-600">Submit a complaint</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Create a new report</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Provide the details of your concern so the right department can review and resolve it quickly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/complaints')}
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> My complaints
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold">Complaint guidelines</p>
              </div>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400 text-sm">
                <li>• Use a clear title so your issue is easy to identify.</li>
                <li>• Choose the department and category that best matches your concern.</li>
                <li>• Add details and attachments to speed up resolution.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Need help?</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              If you’re unsure where to assign your complaint, choose the closest category and the support team will route it.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
                <Upload className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-slate-700 dark:text-slate-300">Attach documents or screenshots for faster review.</p>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <p className="text-sm text-slate-700 dark:text-slate-300">You’ll receive status updates in your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complaint title</span>
              <input
                type="text"
                placeholder="Describe the issue in a short title"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
              <select
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Security">Security</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
              <select
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                disabled={departmentsLoading}
                {...register('department', { required: 'Department is required' })}
              >
                <option value="">{departmentsLoading ? 'Loading…' : 'Select department'}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              {errors.department && <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</span>
              <select
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                {...register('priority', { required: 'Priority is required' })}
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority.message}</p>}
            </label>

            <div className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Attachment</span>
              <div className="mt-3 flex items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <Upload className="h-5 w-5 text-slate-500" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Choose file
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">{attachmentFile?.name ?? 'No file selected'}</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    handleFileSelect(file)
                  }
                }}
              />
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Detailed description</span>
            <textarea
              rows={6}
              placeholder="Explain the issue with enough detail to help the team resolve it."
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-white">Reference</p>
              <p className="mt-1 text-sm">Automatic case reference is created after submission.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
              >
                Save draft
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-3 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit complaint'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
