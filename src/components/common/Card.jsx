export default function Card({
  title,
  value,
  icon,
  children,
  className = "",
}) {
  return (
    <div
      className={`
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        dark:border-slate-800
        dark:bg-slate-950
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2
            className="
              mt-3
              break-words
              text-2xl
              font-bold
              leading-tight
              text-slate-900
              sm:text-3xl
              dark:text-white
            "
          >
            {value}
          </h2>
        </div>

        {/* Icon */}
        {icon && (
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-700
              dark:bg-slate-900
              dark:text-slate-200
            "
          >
            {icon}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}