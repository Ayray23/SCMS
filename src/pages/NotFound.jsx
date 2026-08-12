import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-20 text-white">
      <div className="w-full max-w-4xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-12 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              <ShieldAlert className="h-4 w-4" /> Page not found
            </div>
            <div>
              <h1 className="text-6xl font-bold tracking-tight">404</h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                The page you’re looking for cannot be found. Return to the dashboard or the landing page to continue.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-right">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
