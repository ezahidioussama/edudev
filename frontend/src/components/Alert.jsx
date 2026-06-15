import { classNames } from '../utils/helpers'

export default function Alert({ tone, message, onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={classNames(
        'mb-4 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold',
        tone === 'error'
          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
      )}
    >
      {message}
    </button>
  )
}
