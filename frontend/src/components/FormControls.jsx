import { classNames } from '../utils/helpers'

export function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
      />
    </label>
  )
}

export function FileInput({ label, accept, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  )
}

export function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        className="admin-input min-h-28 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
      ></textarea>
    </label>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([valueOption, labelOption]) => (
          <option key={valueOption} value={valueOption}>
            {labelOption}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Multi({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className="admin-input min-h-32 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        multiple
        value={value}
        onChange={(event) =>
          onChange(Array.from(event.target.selectedOptions, (option) => option.value))
        }
      >
        {options.map(([valueOption, labelOption]) => (
          <option key={valueOption} value={valueOption}>
            {labelOption}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Submit({ saving, label }) {
  return (
    <button className="primary-admin-button w-full" type="submit" disabled={saving}>
      {saving ? 'Enregistrement...' : label}
    </button>
  )
}

export function SmallButton({ children, onClick, danger = false, disabled = false }) {
  return (
    <button
      className={classNames(
        'rounded-2xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        danger
          ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
      )}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
