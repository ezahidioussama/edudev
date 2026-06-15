import { classNames } from '../utils/helpers'

export default function ToastStack({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={classNames(
            'pointer-events-auto rounded-2xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur',
            toast.type === 'error' ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-slate-900 text-white shadow-slate-900/20'
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
