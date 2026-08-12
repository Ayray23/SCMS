export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ className = '' }) {
  return <div className={`h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4 ${className}`}>
      <div className="h-6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse w-1/3" />
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={`rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 h-64 ${className}`}>
      <div className="h-full flex items-end gap-4 justify-around">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" style={{ height: Math.random() * 100 + 40 + '%' }} />
        ))}
      </div>
    </div>
  )
}
