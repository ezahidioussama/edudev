import { useEffect, useMemo, useState } from 'react'
import { getEffectiveDarkMode, setUserThemePreference } from '../themePreferences'
import { client as axiosClient } from '../services/apiClient'
import TrainerLayout from '../layouts/TrainerLayout'
import DashboardOverview from '../pages/trainer/DashboardOverview'
import Modules from '../pages/trainer/Modules'
import Courses from '../pages/trainer/Courses'
import PracticalWorks from '../pages/trainer/PracticalWorks'
import Assessments from '../pages/trainer/Assessments'
import Profile from '../pages/trainer/Profile'
import Modal from '../components/Modal'
import { resolveUrl } from '../utils/resolveUrl'
import { classNames } from '../utils/helpers'
import {
  GridIcon,
  ModulesIcon,
  CourseIcon,
  ClipboardIcon,
  ShieldCheckIcon,
  UserIcon,
  MenuIcon,
  RefreshIcon,
  LogoutIcon,
} from '../pages/trainer/trainerShared'

const trainerSections = [
  { key: 'dashboard', label: 'Tableau de bord', icon: GridIcon },
  { key: 'modules', label: 'Modules', icon: ModulesIcon },
  { key: 'courses', label: 'Cours', icon: CourseIcon },
  { key: 'tp', label: 'TP', icon: ClipboardIcon },
  { key: 'controles', label: 'Contrôles', icon: ShieldCheckIcon },
  { key: 'profile', label: 'Profil', icon: UserIcon },
]

function SidebarLink({ active, label, onClick, icon: Icon, badge = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
        active
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
      )}
    >
      <span className="flex items-center gap-3">
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
      </span>
      {badge ? (
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{badge}</span>
      ) : null}
    </button>
  )
}

function LoadingState() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[28px] bg-white p-6 shadow-sm dark:bg-slate-900 h-32"
          >
            <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="mt-5 h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="animate-pulse rounded-[28px] bg-white p-6 shadow-sm dark:bg-slate-900 h-64">
          <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="animate-pulse rounded-[28px] bg-white p-6 shadow-sm dark:bg-slate-900 h-64">
          <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  )
}

export default function TrainerWorkspace({ user, api, onLogout, settings = null }) {
  const [darkMode, setDarkMode] = useState(() => getEffectiveDarkMode(settings, user))
  const maxPdfSizeMo = settings?.files?.pdf_max_size ?? 20
  const maxPdfSizeBytes = maxPdfSizeMo * 1024 * 1024
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [workspace, setWorkspace] = useState({
    dashboard: null,
    modules: [],
    courses: [],
    practicalWorks: [],
    assessments: [],
  })

  const [profileUser, setProfileUser] = useState(user)
  const [previewDocument, setPreviewDocument] = useState(null)
  const [toasts, setToasts] = useState([])

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
    setProfileUser(user)
  }, [user])

  useEffect(() => {
    return () => {
      if (previewDocument?.url) {
        URL.revokeObjectURL(previewDocument.url)
      }
    }
  }, [previewDocument])

  const stats = useMemo(() => {
    const base = workspace.dashboard?.stats ?? {}
    return [
      { key: 'modules', label: 'Modules assignés', value: base.modules ?? 0 },
      { key: 'courses', label: 'Cours', value: base.courses ?? 0 },
      { key: 'practicalWorks', label: 'TP', value: base.practicalWorks ?? 0 },
      { key: 'assessments', label: 'Contrôles', value: base.assessments ?? 0 },
    ]
  }, [workspace.dashboard])

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
        api('/trainer/modules'),
        api('/courses'),
        api('/practical-works'),
        api('/assessments'),
        api('/profile'),
      ])

      setWorkspace({
        dashboard,
        modules,
        courses,
        practicalWorks,
        assessments,
      })
      if (profile?.user) {
        setProfileUser(profile.user)
      }
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  function pushToast(type, message) {
    const toast = { id: crypto.randomUUID(), type, message }
    setToasts((previous) => [...previous, toast])
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== toast.id))
    }, 4000)
  }

  async function openPreview(documentUrl, title) {
    try {
      const resolved = resolveUrl(documentUrl)
      const response = await axiosClient.get(resolved, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf' },
      })
      const urlBlob = URL.createObjectURL(response.data)

      if (previewDocument?.url) {
        URL.revokeObjectURL(previewDocument.url)
      }

      setPreviewDocument({ url: urlBlob, title })
    } catch (error) {
      pushToast('error', 'Impossible de prévisualiser ce document pour le moment.')
    }
  }

  async function downloadProtectedFile(url, fileName) {
    try {
      const resolved = resolveUrl(url)
      const response = await axiosClient.get(resolved, {
        responseType: 'blob',
      })
      const objectUrl = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = fileName
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      pushToast('error', 'Impossible de télécharger ce fichier pour le moment.')
    }
  }

  const platformName = settings?.general?.platform_name ?? 'EduDev'

  return (
    <TrainerLayout
      user={user}
      platformName={platformName}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      loading={loading}
      refreshing={refreshing}
      toasts={toasts}
      onRefresh={() => loadWorkspace({ silent: true })}
      onLogout={onLogout}
      sections={trainerSections}
      SidebarLink={SidebarLink}
      MenuIcon={MenuIcon}
      RefreshIcon={RefreshIcon}
      LogoutIcon={LogoutIcon}
    >
      {loading ? (
        <LoadingState />
      ) : (
        <>
          {activeSection === 'dashboard' && (
            <DashboardOverview
              stats={stats}
              modules={workspace.modules}
              courses={workspace.courses}
              practicalWorks={workspace.practicalWorks}
              assessments={workspace.assessments}
              onPreviewDocument={(document, title) =>
                document && openPreview(document.preview_url, title)
              }
            />
          )}

          {activeSection === 'modules' && (
            <Modules
              modules={workspace.modules}
              api={api}
              pushToast={pushToast}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === 'courses' && (
            <Courses
              modules={workspace.modules}
              courses={workspace.courses}
              api={api}
              pushToast={pushToast}
              loadWorkspace={loadWorkspace}
              openPreview={openPreview}
              downloadProtectedFile={downloadProtectedFile}
              saving={saving}
              setSaving={setSaving}
              maxPdfSizeMo={maxPdfSizeMo}
              maxPdfSizeBytes={maxPdfSizeBytes}
            />
          )}

          {activeSection === 'tp' && (
            <PracticalWorks
              courses={workspace.courses}
              practicalWorks={workspace.practicalWorks}
              api={api}
              pushToast={pushToast}
              loadWorkspace={loadWorkspace}
              openPreview={openPreview}
              downloadProtectedFile={downloadProtectedFile}
              saving={saving}
              setSaving={setSaving}
              maxPdfSizeMo={maxPdfSizeMo}
              maxPdfSizeBytes={maxPdfSizeBytes}
            />
          )}

          {activeSection === 'controles' && (
            <Assessments
              modules={workspace.modules}
              courses={workspace.courses}
              assessments={workspace.assessments}
              api={api}
              pushToast={pushToast}
              loadWorkspace={loadWorkspace}
              openPreview={openPreview}
              downloadProtectedFile={downloadProtectedFile}
              saving={saving}
              setSaving={setSaving}
              maxPdfSizeMo={maxPdfSizeMo}
              maxPdfSizeBytes={maxPdfSizeBytes}
            />
          )}

          {activeSection === 'profile' && (
            <Profile
              user={user}
              profileUser={profileUser}
              setProfileUser={setProfileUser}
              modulesCount={workspace.modules.length}
              coursesCount={workspace.courses.length}
              api={api}
              pushToast={pushToast}
              saving={saving}
              setSaving={setSaving}
            />
          )}

          <Modal
            open={Boolean(previewDocument)}
            onClose={() => setPreviewDocument(null)}
            title={previewDocument?.title ?? 'Prévisualisation du document'}
            width="max-w-6xl"
          >
            {previewDocument ? (
              <iframe
                title={previewDocument.title}
                src={previewDocument.url}
                className="h-[70vh] w-full rounded-3xl border border-slate-200 dark:border-slate-800"
              ></iframe>
            ) : null}
          </Modal>
        </>
      )}
    </TrainerLayout>
  )
}
