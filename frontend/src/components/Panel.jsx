import { classNames } from '../utils/helpers'

export default function Panel({ title, action = null, children, className = '' }) {
  return (
    <div
      className={classNames(
        'rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/45 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20',
        className
      )}
    >
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
        {action}
      </header>
      {children}
    </div>
  )
}
