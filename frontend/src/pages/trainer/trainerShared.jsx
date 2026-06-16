/* eslint-disable react-refresh/only-export-components, no-unused-vars */
import { useEffect, useState } from 'react'
import { classNames } from '../../utils/helpers'

export function Panel({ children }) {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      {children}
    </section>
  )
}

export function SectionHeader({ eyebrow, title, description, action = null }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}

export function SkeletonBlock() {
  return <div className="h-24 animate-pulse rounded-[24px] bg-slate-100 dark:bg-slate-800"></div>
}

export function SkeletonCard({ tall = false }) {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-[28px] bg-white p-6 shadow-sm dark:bg-slate-900',
        tall ? 'h-64' : 'h-32'
      )}
    >
      <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      <div className="mt-5 h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      <div className="mt-5 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800"></div>
    </div>
  )
}

export function EmptyState({ title, description, compact = false, icon: Icon = SparkIcon }) {
  return (
    <div
      className={classNames(
        'rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 text-center dark:border-slate-700 dark:bg-slate-950/70',
        compact ? 'p-4' : 'p-10'
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

export function ActionButton({ children, onClick, tone = 'neutral', disabled = false }) {
  const tones = {
    neutral:
      'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200',
    danger:
      'border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        'rounded-2xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        tones[tone]
      )}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ tone, children }) {
  const tones = {
    neutral: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  }

  return (
    <span
      className={classNames(
        'inline-flex max-w-full shrink-0 break-words rounded-full px-3 py-1 text-xs font-semibold capitalize leading-snug',
        tones[tone]
      )}
    >
      {children}
    </span>
  )
}

export function MiniPill({ label }) {
  return (
    <span className="inline-flex max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium leading-snug text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
      {label}
    </span>
  )
}

export function CompactMetric({ label, value }) {
  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
      <p className="break-words text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold leading-tight text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

export function resolveApiUrl(url) {
  if (!url) return ''
  if (url.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL || '/api'
    const finalUrl = url.replace('/api', apiBase)
    const buster = window.localStorage.getItem('edudev.avatar.buster') || '1'
    const separator = finalUrl.includes('?') ? '&' : '?'
    return `${finalUrl}${separator}v=${buster}`
  }
  return url
}

// Icons
export function GridIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function ModulesIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m4 8 8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m4 12 8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CourseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 5.5h9.5A2.5 2.5 0 0 1 18 8v10.5H8.5A2.5 2.5 0 0 0 6 21V5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 7.5h-1A2.5 2.5 0 0 0 2.5 10V19A2.5 2.5 0 0 0 5 21h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function ClipboardIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 4.5h8M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v12.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5V7a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5h7M8.5 14.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function ShieldCheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m12 3.5 6 2.5V11c0 4-2.35 7.44-6 9-3.65-1.56-6-5-6-9V6l6-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.4 11.8 1.7 1.7 3.6-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function UserIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function SparkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5 13.9 10l6.6 1.9-6.6 1.9L12 20.5l-1.9-6.7L3.5 11.9l6.6-1.9L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function MenuIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function RefreshIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.34 5.66M20 7v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LogoutIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10 6H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m14 16 4-4-4-4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function DocumentIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 3.5h5.5L18.5 8v12A1.5 1.5 0 0 1 17 21.5H8A1.5 1.5 0 0 1 6.5 20V5A1.5 1.5 0 0 1 8 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.5 3.5V8h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 12h5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PlusIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CameraIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.5 6.5 10 4h4l1.5 2.5H19A2.5 2.5 0 0 1 21.5 9v8A2.5 2.5 0 0 1 19 19.5H5A2.5 2.5 0 0 1 2.5 17V9A2.5 2.5 0 0 1 5 6.5h3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function UploadIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 15V4.5M8 8.5l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9A2.5 2.5 0 0 0 19 17.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function EyeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2.75 12s3.4-5.75 9.25-5.75S21.25 12 21.25 12s-3.4 5.75-9.25 5.75S2.75 12 2.75 12Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function EyeOffIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 4.5 21 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.4c.45-.1.92-.15 1.4-.15 5.85 0 9.25 5.75 9.25 5.75a17 17 0 0 1-2.7 3.4M6.3 8.6C4.15 10.25 2.75 12 2.75 12s3.4 5.75 9.25 5.75c1.4 0 2.68-.33 3.84-.88" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.4 10.4a2.25 2.25 0 0 0 3.2 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TrainerStatCard({ label, value, accent, icon: Icon }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/45 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={classNames('h-1.5 flex-1 rounded-full bg-gradient-to-r', accent)}></div>
        <div className={classNames('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105', accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold text-slate-950 dark:text-white">{value}</strong>
    </article>
  )
}

export function ModuleSummaryCard({ module }) {
  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{module.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {module.description || 'Aucune description disponible pour ce module.'}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-orange-50 group-hover:text-orange-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-300">
          <ModulesIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <MiniPill label={`${module.courses_count} cours`} />
        <MiniPill label={`${module.practical_works_count} TP`} />
        <MiniPill label={`${module.assessments_count} contrôles`} />
      </div>
    </article>
  )
}

export function ProfileHero({ user, modulesCount, coursesCount, avatarPreview }) {
  const avatarUrl = avatarPreview || user?.avatar_url

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-orange-500 p-6 text-white sm:p-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-white/5"></div>
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white/20 bg-white/10 text-4xl font-semibold shadow-2xl shadow-slate-950/25 sm:h-32 sm:w-32">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name ?? 'Formateur'} className="h-full w-full object-cover" />
                ) : (
                  <span>{(user?.name ?? 'F').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-950/30">
                <CameraIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="min-w-0 pb-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-50">Formateur</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-100">Profil actif</span>
              </div>
              <h2 className="break-words text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: '#fdba74' }}>{user?.name}</h2>
              <p className="mt-2 break-words text-sm text-orange-50">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">Modules</p>
              <strong className="mt-2 block text-2xl font-semibold">{modulesCount}</strong>
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">Cours</p>
              <strong className="mt-2 block text-2xl font-semibold">{coursesCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProfileCard({ title, eyebrow, description, children, icon: Icon = UserIcon }) {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur transition hover:shadow-2xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20 dark:hover:shadow-black/30">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">{eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
