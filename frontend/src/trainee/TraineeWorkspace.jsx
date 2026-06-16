import React, { useEffect, useMemo, useState } from 'react'
import logo from '../assets/logo.jpeg'
import { getEffectiveDarkMode, setUserThemePreference } from '../themePreferences'
import { client as axiosClient } from '../api/client'
import { classNames } from '../utils/helpers'

// Import page views
import DashboardOverview from '../pages/trainee/DashboardOverview'
import Modules from '../pages/trainee/Modules'
import Resources from '../pages/trainee/Resources'
import Profile from '../pages/trainee/Profile'

// Import shared layouts and subcomponents
import {
  GridIcon,
  ModulesIcon,
  BookIcon,
  ClipboardIcon,
  ShieldIcon,
  UserIcon,
  MenuIcon,
  RefreshIcon,
  LogoutIcon,
  CloseIcon,
  Avatar,
  LoadingState,
  Modal
} from '../pages/trainee/traineeShared'

const sections = [
  { key: 'dashboard', label: 'Tableau de bord', icon: GridIcon },
  { key: 'modules', label: 'Modules', icon: ModulesIcon },
  { key: 'courses', label: 'Cours', icon: BookIcon },
  { key: 'tp', label: 'TP', icon: ClipboardIcon },
  { key: 'controles', label: 'Contrôles', icon: ShieldIcon },
  { key: 'profile', label: 'Profil', icon: UserIcon },
]

const emptyPasswordForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
}

function SidebarLink({ active, label, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
        active
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
      )}
    >
      <span
        className={classNames(
          'flex h-9 w-9 items-center justify-center rounded-2xl transition',
          active
            ? 'bg-white/15'
            : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      {label}
    </button>
  )
}

function ToastStack({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={classNames(
            'pointer-events-auto rounded-2xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur',
            toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-600/20'
              : 'bg-slate-900 text-white shadow-slate-900/20'
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default function TraineeWorkspace({ user, api, onLogout, settings = null }) {
  const [active, setActive] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => getEffectiveDarkMode(settings, user))
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])
  const [preview, setPreview] = useState(null)
  const [filters, setFilters] = useState({
    query: '',
    module: 'all',
    trainer: 'all',
    type: 'all',
    sort: 'recent',
  })
  const [data, setData] = useState({
    dashboard: null,
    modules: [],
    courses: [],
    practicalWorks: [],
    assessments: [],
  })
  const [profileUser, setProfileUser] = useState(user)
  const [profileForm, setProfileForm] = useState(() => {
    const specialty = user?.specialty || ''
    const yr = specialty.includes('2') ? '2' : '1'
    let opt = 'Full Stack'
    if (specialty.includes('Mobile')) opt = 'Mobile'
    if (specialty.includes('RV/RA')) opt = 'RV/RA'
    return {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      bio: user?.bio ?? '',
      year_level: yr,
      option: opt,
    }
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordVisible, setPasswordVisible] = useState({ current: false, next: false, confirmation: false })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarDragging, setAvatarDragging] = useState(false)

  const platformName = settings?.general?.platform_name ?? 'EduDev'
  const currentUser = profileUser ?? user

  useEffect(() => {
    loadWorkspace()
  }, [])

  useEffect(() => {
    setDarkMode(getEffectiveDarkMode(settings, user))
  }, [settings, user])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url)
    }
  }, [preview])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const stats = useMemo(
    () => [
      {
        label: 'Modules disponibles',
        value: data.modules.length,
        accent: 'from-orange-500 to-amber-400',
        icon: ModulesIcon,
      },
      {
        label: 'Cours disponibles',
        value: data.courses.length,
        accent: 'from-cyan-500 to-blue-500',
        icon: BookIcon,
      },
      {
        label: 'TP disponibles',
        value: data.practicalWorks.length,
        accent: 'from-emerald-500 to-teal-500',
        icon: ClipboardIcon,
      },
      {
        label: 'Contrôles disponibles',
        value: data.assessments.length,
        accent: 'from-fuchsia-500 to-rose-500',
        icon: ShieldIcon,
      },
    ],
    [data.assessments.length, data.courses.length, data.modules.length, data.practicalWorks.length]
  )

  const resources = useMemo(() => {
    const courses = data.courses.map((course) => ({
      ...course,
      resourceType: 'courses',
      resourceLabel: 'Cours',
      body: course.description,
      moduleTitle: course.module?.title ?? 'Module',
      trainerName: course.trainer?.name ?? 'Formateur',
      date: course.created_at,
      downloadStats: course.download_stats,
    }))
    const tps = data.practicalWorks.map((item) => ({
      ...item,
      resourceType: 'tp',
      resourceLabel: 'TP',
      body: item.instructions,
      moduleTitle: item.module?.title ?? item.course?.module?.title ?? 'Module',
      trainerName: item.trainer?.name ?? 'Formateur',
      date: item.due_at,
      downloadStats: item.download_stats,
    }))
    const controles = data.assessments.map((item) => ({
      ...item,
      resourceType: 'controles',
      resourceLabel: 'Contrôle',
      body: item.course?.title ?? 'Contrôle général du module',
      moduleTitle: item.module?.title ?? item.course?.module?.title ?? 'Module',
      trainerName: item.trainer?.name ?? 'Formateur',
      date: item.scheduled_at ?? item.created_at,
      downloadStats: item.download_stats,
    }))

    return [...courses, ...tps, ...controles]
  }, [data.assessments, data.courses, data.practicalWorks])

  const moduleOptions = useMemo(() => {
    const values = new Map()
    data.modules.forEach((moduleItem) => values.set(String(moduleItem.id), moduleItem.title))
    resources.forEach((item) => {
      if (item.module_id) values.set(String(item.module_id), item.moduleTitle)
      if (item.module?.id) values.set(String(item.module.id), item.moduleTitle)
      if (item.course?.module_id) values.set(String(item.course.module_id), item.moduleTitle)
    })
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    )
  }, [data.modules, resources])

  const trainerOptions = useMemo(() => {
    const values = new Map()
    resources.forEach((item) => {
      if (item.trainer_id || item.trainer?.id)
        values.set(String(item.trainer_id ?? item.trainer.id), item.trainerName)
    })
    data.modules.forEach((moduleItem) => {
      ;(moduleItem.trainers ?? []).forEach((trainer) => values.set(String(trainer.id), trainer.name))
    })
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    )
  }, [data.modules, resources])

  const filteredResources = useMemo(
    () => filterResources(resources, filters),
    [resources, filters]
  )
  const filteredModules = useMemo(
    () => filterModules(data.modules, filters, resources),
    [data.modules, filters, resources]
  )
  const pageResources = useMemo(() => {
    if (active === 'courses') return filteredResources.filter((item) => item.resourceType === 'courses')
    if (active === 'tp') return filteredResources.filter((item) => item.resourceType === 'tp')
    if (active === 'controles') return filteredResources.filter((item) => item.resourceType === 'controles')
    return filteredResources
  }, [active, filteredResources])

  function toggleDarkMode() {
    setDarkMode((value) => {
      const next = !value
      setUserThemePreference(user, next ? 'dark' : 'light')
      return next
    })
  }

  async function loadWorkspace({ silent = false } = {}) {
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const [dashboard, modules, courses, practicalWorks, assessments, profile] = await Promise.all([
        api('/dashboard'),
        api('/trainee/modules'),
        api('/courses'),
        api('/trainee/practical-works'),
        api('/trainee/assessments'),
        api('/profile'),
      ])

      setData({ dashboard, modules, courses, practicalWorks, assessments })

      if (profile?.user) {
        setProfileUser(profile.user)
        const specialty = profile.user.specialty || ''
        const yr = specialty.includes('2') ? '2' : '1'
        let opt = 'Full Stack'
        if (specialty.includes('Mobile')) opt = 'Mobile'
        if (specialty.includes('RV/RA')) opt = 'RV/RA'
        setProfileForm({
          first_name: profile.user.first_name ?? '',
          last_name: profile.user.last_name ?? '',
          email: profile.user.email ?? '',
          phone: profile.user.phone ?? '',
          bio: profile.user.bio ?? '',
          year_level: yr,
          option: opt,
        })
      }
    } catch (requestError) {
      pushToast('error', requestError.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  function pushToast(type, message) {
    const toast = { id: crypto.randomUUID(), type, message }
    setToasts((previous) => [...previous, toast])
    window.setTimeout(() => setToasts((previous) => previous.filter((item) => item.id !== toast.id)), 4000)
  }

  function updateFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }))
    if (key === 'type' && value !== 'all') {
      setActive(value)
      setMobileMenuOpen(false)
    }
  }

  function resolveUrl(url) {
    if (!url) return ''
    if (url.startsWith('/api')) {
      return url.replace('/api', '')
    }
    return url
  }

  async function openPdf(resource) {
    if (!resource.document) return

    try {
      const url = resolveUrl(resource.document.preview_url)
      const response = await axiosClient.get(url, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf' },
      })
      const urlBlob = URL.createObjectURL(response.data)
      if (preview?.url) URL.revokeObjectURL(preview.url)
      setPreview({ title: resource.title, url: urlBlob })

      // Auto refresh workspace to update preview stats instantly!
      window.setTimeout(() => loadWorkspace({ silent: true }), 1000)
    } catch (requestError) {
      pushToast('error', "Impossible d'ouvrir ce PDF pour le moment.")
    }
  }

  async function downloadPdf(resource) {
    if (!resource.document) return

    try {
      const url = resolveUrl(resource.document.download_url)
      const response = await axiosClient.get(url, {
        responseType: 'blob',
      })
      const objectUrl = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = resource.document.name
      anchor.click()
      URL.revokeObjectURL(objectUrl)

      // Auto refresh workspace to update download stats instantly!
      window.setTimeout(() => loadWorkspace({ silent: true }), 1000)
    } catch (requestError) {
      pushToast('error', 'Téléchargement impossible.')
    }
  }

  function handleAvatarFile(file) {
    if (!file) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      setAvatarFile(null)
      setAvatarPreview('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setProfileErrors((previous) => ({ ...previous, avatar: 'Veuillez sélectionner une image valide.' }))
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setProfileErrors((previous) => ({ ...previous, avatar: 'La photo ne doit pas dépasser 4 Mo.' }))
      return
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setProfileErrors((previous) => {
      const next = { ...previous }
      delete next.avatar
      return next
    })
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function submitProfile(event) {
    event.preventDefault()
    const errors = validateProfile(profileForm)
    if (Object.keys(errors).length) {
      setProfileErrors(errors)
      return
    }

    setSaving(true)
    setProfileErrors({})

    try {
      const body = new FormData()
      body.append('first_name', profileForm.first_name)
      body.append('last_name', profileForm.last_name)
      body.append('email', profileForm.email)
      body.append('phone', profileForm.phone || '')
      body.append('bio', profileForm.bio || '')
      body.append('year_level', profileForm.year_level)
      body.append('option', profileForm.option)
      if (avatarFile) body.append('avatar', avatarFile)

      const response = await api('/profile', { method: 'POST', body })
      if (response?.user) {
        window.localStorage.setItem('edudev.avatar.buster', Date.now())
        setProfileUser(response.user)
        const specialty = response.user.specialty || ''
        const yr = specialty.includes('2') ? '2' : '1'
        let opt = 'Full Stack'
        if (specialty.includes('Mobile')) opt = 'Mobile'
        if (specialty.includes('RV/RA')) opt = 'RV/RA'
        setProfileForm({
          first_name: response.user.first_name ?? '',
          last_name: response.user.last_name ?? '',
          email: response.user.email ?? '',
          phone: response.user.phone ?? '',
          bio: response.user.bio ?? '',
          year_level: yr,
          option: opt,
        })
      }
      handleAvatarFile(null)
      pushToast('success', 'Profil mis à jour avec succès.')
      window.setTimeout(() => loadWorkspace({ silent: true }), 500)
    } catch (requestError) {
      pushToast('error', requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitPassword(event) {
    event.preventDefault()
    const errors = validatePassword(passwordForm)
    if (Object.keys(errors).length) {
      setPasswordErrors(errors)
      return
    }

    setSaving(true)
    setPasswordErrors({})

    try {
      await api('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(passwordForm),
      })
      setPasswordForm(emptyPasswordForm)
      pushToast('success', 'Mot de passe mis à jour avec succès.')
    } catch (requestError) {
      pushToast('error', requestError.message)
    } finally {
      setSaving(false)
    }
  }

  function sectionTitle(key) {
    return sections.find((section) => section.key === key)?.label ?? 'Tableau de bord'
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        <ToastStack toasts={toasts} />

        <div className="flex min-h-screen">
          <aside
            className={classNames(
              'fixed inset-y-0 left-0 z-40 w-80 flex-shrink-0 h-screen max-h-screen overflow-y-auto overflow-x-hidden lg:h-auto lg:max-h-none border-r border-white/50 bg-white/90 p-5 pb-28 lg:pb-5 shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20 lg:static lg:translate-x-0',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 dark:border-slate-800">
                <img src={logo} alt="EduDev Logo" className="h-full w-full object-cover rounded-2xl" />
              </div>
              <div className="flex-1 min-w-max">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  {platformName}
                </p>
                <span className="block whitespace-nowrap text-2xl font-semibold leading-tight text-slate-900 dark:text-white">
                  Espace stagiaire
                </span>
              </div>
            </div>

            <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-500 p-5 text-white shadow-xl shadow-slate-900/20">
              <div className="flex items-center gap-3">
                <Avatar user={currentUser} size="h-14 w-14" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold whitespace-normal" style={{ color: '#fdba74' }}>
                    {currentUser?.first_name + ' ' + currentUser?.last_name}
                  </h2>
                  <p className="truncate text-xs text-orange-50">{currentUser?.email}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-200">
                Accédez simplement à vos modules, cours PDF, TP et contrôles disponibles.
              </p>
            </div>

            <nav className="space-y-2">
              {sections.map((item) => (
                <SidebarLink
                  key={item.key}
                  active={active === item.key}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => {
                    setActive(item.key)
                    setMobileMenuOpen(false)
                  }}
                />
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Mode sombre</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confort de lecture des PDF.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={classNames(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition',
                    darkMode ? 'bg-orange-500' : 'bg-slate-300'
                  )}
                >
                  <span
                    className={classNames(
                      'inline-block h-5 w-5 rounded-full bg-white shadow transition',
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    )}
                  ></span>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 lg:pl-0">
            <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/70 bg-white/85 px-5 py-4 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/20">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((value) => !value)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <MenuIcon className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                      {platformName}
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {sectionTitle(active)}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadWorkspace({ silent: true })}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <RefreshIcon className={classNames('h-4 w-4', refreshing ? 'animate-spin' : '')} />
                    Actualiser
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </header>

              {loading ? <LoadingState /> : null}

              {!loading && active === 'dashboard' ? (
                <DashboardOverview
                  stats={stats}
                  user={currentUser}
                  modules={data.modules}
                  resources={resources}
                  filteredResources={filteredResources}
                  filters={filters}
                  moduleOptions={moduleOptions}
                  trainerOptions={trainerOptions}
                  updateFilter={updateFilter}
                  openPdf={openPdf}
                  downloadPdf={downloadPdf}
                />
              ) : null}

              {!loading && active === 'modules' ? (
                <Modules
                  filters={filters}
                  moduleOptions={moduleOptions}
                  trainerOptions={trainerOptions}
                  onFilter={updateFilter}
                  filteredModules={filteredModules}
                  resources={resources}
                  updateFilter={updateFilter}
                  setActive={setActive}
                />
              ) : null}

              {!loading && ['courses', 'tp', 'controles'].includes(active) ? (
                <Resources
                  active={active}
                  filters={filters}
                  moduleOptions={moduleOptions}
                  trainerOptions={trainerOptions}
                  onFilter={updateFilter}
                  pageResources={pageResources}
                  onPreview={openPdf}
                  onDownload={downloadPdf}
                />
              ) : null}

              {!loading && active === 'profile' ? (
                <Profile
                  currentUser={currentUser}
                  avatarPreview={avatarPreview}
                  stats={stats}
                  profileForm={profileForm}
                  profileErrors={profileErrors}
                  avatarFile={avatarFile}
                  avatarDragging={avatarDragging}
                  saving={saving}
                  passwordForm={passwordForm}
                  passwordErrors={passwordErrors}
                  passwordVisible={passwordVisible}
                  setProfileForm={setProfileForm}
                  setProfileErrors={setProfileErrors}
                  setPasswordForm={setPasswordForm}
                  setPasswordErrors={setPasswordErrors}
                  setPasswordVisible={setPasswordVisible}
                  setAvatarDragging={setAvatarDragging}
                  handleAvatarFile={handleAvatarFile}
                  submitProfile={submitProfile}
                  submitPassword={submitPassword}
                />
              ) : null}
            </main>
          </div>
        </div>

        <Modal
          open={Boolean(preview)}
          onClose={() => setPreview(null)}
          title={preview?.title ?? 'Prévisualisation du PDF'}
          width="max-w-6xl"
        >
          {preview ? (
            <iframe
              title={preview.title}
              src={preview.url}
              className="h-[72vh] w-full rounded-3xl border border-slate-200 dark:border-slate-800"
            ></iframe>
          ) : null}
        </Modal>
      </div>
    </div>
  )
}

function filterResources(resources, filters) {
  const search = normalize(filters.query)

  const filtered = resources.filter((item) => {
    const moduleId = String(item.module_id ?? item.module?.id ?? item.course?.module_id ?? '')
    const trainerId = String(item.trainer_id ?? item.trainer?.id ?? '')
    const haystack = normalize(
      [
        item.title,
        item.body,
        item.moduleTitle,
        item.trainerName,
        item.document?.name,
      ]
        .filter(Boolean)
        .join(' ')
    )
    const matchesSearch = !search || haystack.includes(search)
    const matchesModule = filters.module === 'all' || moduleId === String(filters.module)
    const matchesTrainer = filters.trainer === 'all' || trainerId === String(filters.trainer)
    const matchesType = filters.type === 'all' || item.resourceType === filters.type
    return matchesSearch && matchesModule && matchesTrainer && matchesType
  })

  if (filters.sort === 'downloads_count_desc') {
    return filtered.sort((a, b) => {
      const countA = a.downloadStats?.count ?? 0
      const countB = b.downloadStats?.count ?? 0
      return countB - countA
    })
  }

  if (filters.sort === 'downloads_desc') {
    return filtered.sort((a, b) => {
      const pctA = a.downloadStats?.percentage ?? 0
      const pctB = b.downloadStats?.percentage ?? 0
      return pctB - pctA
    })
  }

  if (filters.sort === 'downloads_asc') {
    return filtered.sort((a, b) => {
      const pctA = a.downloadStats?.percentage ?? 0
      const pctB = b.downloadStats?.percentage ?? 0
      return pctA - pctB
    })
  }

  return filtered.sort((a, b) => {
    const dateA = a.created_at || a.date || ''
    const dateB = b.created_at || b.date || ''
    return dateB.localeCompare(dateA)
  })
}

function filterModules(modules, filters, resources) {
  const search = normalize(filters.query)

  return modules.filter((moduleItem) => {
    const moduleResources = resources.filter(
      (item) => String(item.module_id ?? item.module?.id ?? item.course?.module_id) === String(moduleItem.id)
    )
    const trainers = (moduleItem.trainers ?? []).map((trainer) => trainer.name).join(' ')
    const haystack = normalize(
      [
        moduleItem.title,
        moduleItem.description,
        trainers,
        ...moduleResources.map((item) => `${item.title} ${item.trainerName}`),
      ].join(' ')
    )
    const matchesSearch = !search || haystack.includes(search)
    const matchesModule = filters.module === 'all' || String(moduleItem.id) === String(filters.module)
    const matchesTrainer =
      filters.trainer === 'all' ||
      moduleResources.some((item) => String(item.trainer_id ?? item.trainer?.id ?? '') === String(filters.trainer)) ||
      (moduleItem.trainers ?? []).some((trainer) => String(trainer.id) === String(filters.trainer))
    return matchesSearch && matchesModule && matchesTrainer
  })
}

function validateProfile(form) {
  const errors = {}
  if (!form.first_name || !form.first_name.trim()) errors.first_name = 'Le prénom est obligatoire.'
  if (!form.last_name || !form.last_name.trim()) errors.last_name = 'Le nom est obligatoire.'
  if (!form.email || !form.email.trim()) {
    errors.email = "L'adresse email est obligatoire."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.'
  }
  return errors
}

function validatePassword(form) {
  const errors = {}
  if (!form.current_password) errors.current_password = 'Le mot de passe actuel est obligatoire.'
  if (!form.password) {
    errors.password = 'Le nouveau mot de passe est obligatoire.'
  } else if (form.password.length < 8) {
    errors.password = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
  }
  if (!form.password_confirmation) {
    errors.password_confirmation = 'Veuillez confirmer le nouveau mot de passe.'
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas.'
  }
  return errors
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
