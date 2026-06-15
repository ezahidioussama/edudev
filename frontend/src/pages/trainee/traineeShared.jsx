/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react'
import { classNames } from '../../utils/helpers'

export function Panel({ children }) {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      {children}
    </section>
  )
}

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  )
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

export function LoadingState() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonCard tall />
        <SkeletonCard tall />
      </div>
    </div>
  )
}

export function EmptyState({ title, description, icon: Icon = SparkIcon }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-950/70">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

export function ActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    >
      {children}
    </button>
  )
}

export function StatusBadge({ tone, children }) {
  const tones = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  }
  return (
    <span
      className={classNames(
        'inline-flex max-w-full rounded-full px-3 py-1 text-xs font-semibold leading-snug',
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
      <p className="mt-2 break-words text-sm font-semibold leading-tight text-slate-900 dark:text-white">
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

export function Avatar({ user, size = 'h-20 w-20' }) {
  if (user?.avatar_url)
    return (
      <img
        src={resolveApiUrl(user.avatar_url)}
        alt={user.name ?? ''}
        className={classNames(size, 'rounded-3xl object-cover ring-4 ring-white/20')}
      />
    )
  return (
    <div
      className={classNames(
        size,
        'flex items-center justify-center rounded-3xl bg-white/15 text-xl font-semibold ring-4 ring-white/20'
      )}
    >
      {(user?.name ?? 'S').slice(0, 1).toUpperCase()}
    </div>
  )
}

export function formatBytes(bytes) {
  if (!bytes) return '0 Ko'
  const k = 1024
  const dm = 1
  const sizes = ['octets', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

export function BookIcon({ className = 'h-5 w-5' }) {
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

export function ShieldIcon({ className = 'h-5 w-5' }) {
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

export function SparkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5 13.9 10l6.6 1.9-6.6 1.9L12 20.5l-1.9-6.7L3.5 11.9l6.6-1.9L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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

export function CheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function DownloadIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4.5v10.5M8 11.5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9A2.5 2.5 0 0 0 19 17.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// Complex components that are shared
export function DashboardHero({ user, modules, resources }) {
  const readyResources = resources.filter((item) => item.document).length

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-500 p-6 text-white sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,360px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-100">
              Espace pédagogique
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Bonjour, {user?.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100">
              Retrouvez vos modules et documents PDF dans une interface claire, rapide et pensée
              pour la consultation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric label="Modules actifs" value={modules.length} />
            <HeroMetric label="PDF accessibles" value={readyResources} />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">{label}</p>
      <strong className="mt-2 block text-2xl font-semibold">{value}</strong>
    </div>
  )
}

export function ResourceToolbar({
  filters,
  moduleOptions,
  trainerOptions,
  onFilter,
  hideType = false,
  hideSort = false,
}) {
  const resourceTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'courses', label: 'Cours' },
    { value: 'tp', label: 'TP' },
    { value: 'controles', label: 'Contrôles' },
  ]

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <label className="relative min-w-[280px] flex-1">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.query}
          onChange={(event) => onFilter('query', event.target.value)}
          placeholder="Rechercher par module, formateur ou titre..."
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15"
        />
      </label>
      <SelectBox
        value={filters.module}
        onChange={(value) => onFilter('module', value)}
        options={[{ value: 'all', label: 'Tous les modules' }, ...moduleOptions]}
      />
      <SelectBox
        value={filters.trainer}
        onChange={(value) => onFilter('trainer', value)}
        options={[{ value: 'all', label: 'Tous les formateurs' }, ...trainerOptions]}
      />
      {!hideType ? (
        <SelectBox
          value={filters.type}
          onChange={(value) => onFilter('type', value)}
          options={resourceTypes}
        />
      ) : null}
      {!hideSort ? (
        <SelectBox
          value={filters.sort}
          onChange={(value) => onFilter('sort', value)}
          options={[
            { value: 'recent', label: 'Trier par : Récent' },
            { value: 'downloads_count_desc', label: 'Trier par : Plus téléchargé' },
            { value: 'downloads_desc', label: 'Taux : Élevé → Faible' },
            { value: 'downloads_asc', label: 'Taux : Faible → Élevé' },
          ]}
        />
      ) : null}
    </div>
  )
}

function SelectBox({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 min-w-[170px] flex-1 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15"
    >
      {options.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function ResourceGrid({ resources, emptyTitle, emptyDescription, onPreview, onDownload }) {
  if (!resources.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={DocumentIcon} />
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {resources.map((resource) => (
        <ResourceCard
          key={`${resource.resourceType}-${resource.id}`}
          resource={resource}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  )
}

function ResourceCard({ resource, onPreview, onDownload }) {
  const isCourse = resource.resourceType === 'courses'
  const isTp = resource.resourceType === 'tp'

  const Icon = isCourse ? BookIcon : isTp ? ClipboardIcon : ShieldIcon

  const theme = {
    accent: 'from-orange-500 to-orange-600',
    textAccent: 'text-orange-600 dark:text-orange-400',
    bgAccent: 'bg-orange-50 dark:bg-orange-500/10',
    pill: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300 border-orange-100 dark:border-orange-500/10',
    btnPrimary:
      'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/20 text-white',
    btnSecondary:
      'border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
    progress: 'bg-gradient-to-r from-orange-400 to-orange-500',
  }

  const stats = resource.downloadStats || { percentage: 0, count: 0 }

  return (
    <article className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:shadow-black/30 flex flex-col justify-between h-full">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-snug ${theme.pill}`}
              >
                {resource.resourceLabel}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    resource.document ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {resource.document ? 'PDF disponible' : 'PDF en cours'}
                </span>
              </div>
            </div>
          </div>

          <StatusBadge tone={resource.document ? 'success' : 'warning'}>
            {resource.document ? 'Prêt' : 'En attente'}
          </StatusBadge>
        </div>

        <div className="mt-5">
          <h3 className="break-words text-xl font-bold leading-snug text-slate-950 dark:text-white">
            {resource.title}
          </h3>
          <p className="mt-3 break-words text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
            {resource.body || 'Aucune description ou consigne renseignée pour ce contenu.'}
          </p>
        </div>

        <div className="my-5 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

        <div className="grid gap-3 grid-cols-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Module
            </span>
            <span
              className="mt-1 block truncate text-xs font-semibold text-slate-800 dark:text-slate-200"
              title={resource.moduleTitle}
            >
              {resource.moduleTitle}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Formateur
            </span>
            <span
              className="mt-1 block truncate text-xs font-semibold text-slate-800 dark:text-slate-200"
              title={resource.trainerName}
            >
              {resource.trainerName}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Date
            </span>
            <span className="mt-1 block truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {resource.date ? formatDate(resource.date) : 'Non définie'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800/80 dark:bg-slate-950/40">
        <div className="flex flex-col gap-4 w-full">
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Engagement des téléchargements
              </span>
              <span className={`font-bold ${theme.textAccent}`}>{stats.percentage}%</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${theme.progress}`}
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>

            <div className="mt-3 flex flex-col gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                <span>
                  <strong className="text-slate-850 dark:text-slate-250">{stats.count}</strong>{' '}
                  apprenant{stats.count > 1 ? 's' : ''} ont téléchargé{' '}
                  {isCourse ? 'le cours' : isTp ? 'le TP' : 'le contrôle'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-450 dark:bg-slate-500"></span>
                <span>
                  Dernier téléchargement :{' '}
                  <strong className="text-slate-850 dark:text-slate-250">
                    {formatRelativeTime(stats.lastDownloadAt || stats.last_download_at)}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-800/60 my-0.5"></div>

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              disabled={!resource.document}
              onClick={() => onPreview(resource)}
              className={`h-10 rounded-xl border px-3 text-xs font-bold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-1.5 ${theme.btnSecondary} w-full`}
            >
              <EyeIcon className="h-3.5 w-3.5" />
              Aperçu
            </button>
            <button
              type="button"
              disabled={!resource.document}
              onClick={() => onDownload(resource)}
              className={`h-10 rounded-xl shadow-md transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-1.5 ${theme.btnPrimary} w-full`}
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Télécharger
            </button>
          </div>
        </div>

        {resource.document && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 text-[11px] font-semibold text-slate-500 border border-slate-200/50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800/40">
            <DocumentIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate flex-1" title={resource.document.name}>
              {resource.document.name}
            </span>
            <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
              ({formatBytes(resource.document.size)})
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

function formatDate(value) {
  if (!value) return 'Non défini'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Aucun'
  try {
    let cleanDate = dateString.replace(' ', 'T')
    if (!cleanDate.endsWith('Z')) {
      cleanDate += 'Z'
    }
    const date = new Date(cleanDate)
    const now = new Date()
    const diffMs = now - date
    if (isNaN(diffMs) || diffMs < 0) return 'il y a quelques secondes'

    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'il y a quelques secondes'
    if (diffMins < 60) return `il y a ${diffMins} min`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `il y a ${diffHours} h`

    const diffDays = Math.floor(diffHours / 24)
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  } catch {
    return 'Non disponible'
  }
}

export function ProfileHero({ user, avatarPreview, stats }) {
  const avatarUrl = avatarPreview || user?.avatar_url

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-500 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white/20 bg-white/10 text-4xl font-semibold shadow-2xl shadow-slate-950/25">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name ?? 'Stagiaire'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{(user?.name ?? 'S').slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 pb-1">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-50">
                Stagiaire
              </span>
              <h2 className="mt-3 break-words text-3xl font-semibold leading-tight sm:text-4xl">
                {user?.name}
              </h2>
              <p className="mt-2 break-words text-sm text-orange-50">{user?.email}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            {stats.slice(0, 2).map((stat) => (
              <HeroMetric key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProfileCard({ title, eyebrow, icon: Icon, children }) {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">{eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  )
}

export function Modal({ open, onClose, title, children, width = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={classNames(
          'max-h-[90vh] w-full overflow-y-auto rounded-[32px] border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900',
          width
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="min-w-0 break-words text-xl font-semibold leading-tight text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

