import { Link } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'

export default function Error500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Zap className="h-16 w-16 text-orange-600" />
        </div>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white">500</h1>
        <p className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-200">Server Error</p>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Something went wrong on our end. Our team has been notified and is working to fix it. Please try again in a moment.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
            <ArrowLeft className="h-4 w-4" /> Reload page
          </button>
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
