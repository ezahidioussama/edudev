export default function Empty({ label }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
      {label}
    </div>
  )
}
