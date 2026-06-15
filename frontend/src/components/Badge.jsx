import { classNames } from '../utils/helpers'

export default function Badge({ children, tone = 'neutral' }) {
  const color =
    tone === 'success'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
      : tone === 'danger'
      ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

  return (
    <span className={classNames('inline-flex max-w-xs break-words rounded-full px-3 py-1 text-xs font-bold', color)}>
      {children}
    </span>
  )
}
