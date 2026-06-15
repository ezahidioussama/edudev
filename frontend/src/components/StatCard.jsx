import { classNames } from '../utils/helpers'

export default function StatCard({ label, value, accent }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/45 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div className={classNames('mb-5 h-1.5 rounded-full bg-gradient-to-r', accent)}></div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <strong className="mt-3 block text-3xl text-slate-950 dark:text-white">{value}</strong>
    </article>
  )
}
