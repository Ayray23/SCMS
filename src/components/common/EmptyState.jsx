import { AlertCircle } from 'lucide-react'

export function EmptyState({ icon: Icon = AlertCircle, title, description, action = null, className = '' }) {
  return (
    <div className={`rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-12 text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <Icon className="h-12 w-12 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
