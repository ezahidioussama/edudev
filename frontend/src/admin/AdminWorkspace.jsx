import { useEffect, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import DashboardOverview from '../pages/admin/DashboardOverview'
import UsersManagement from '../pages/admin/UsersManagement'
import ModulesManagement from '../pages/admin/ModulesManagement'
import AssignmentsManagement from '../pages/admin/AssignmentsManagement'
import ContentManagement from '../pages/admin/ContentManagement'
import Settings from '../pages/admin/Settings'
import Profile from '../pages/admin/Profile'

const defaultSettings = {
  general: { platform_name: 'EduDev', support_email: 'support@edudev.local' },
  appearance: { mode: 'light', primary_color: '#ff7900' },
  security: { session_timeout: 120, upload_size_limit: 20 },
  files: { pdf_max_size: 20, allowed_file_types: ['pdf'], storage_disk: 'local' },
  maintenance: { enabled: false },
  localization: { language: 'fr', timezone: 'Africa/Casablanca', date_format: 'd/m/Y H:i' },
}

export default function AdminWorkspace({
  user,
  api,
  onLogout,
  settings: appSettings = defaultSettings,
  onSettingsChange = null,
}) {
  const [darkMode, setDarkMode] = useState(
    () =>
      (appSettings.appearance?.mode ?? 'light') === 'dark' ||
      window.localStorage.getItem('edudev-admin-dark') === '1'
  )
  const [active, setActive] = useState('dashboard')
  const [loading, setLoading] = useState(() => !window.localStorage.getItem('edudev.admin.cache'))
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState({
    dashboard: null,
    users: [],
    modules: [],
    courses: [],
    practicalWorks: [],
    assessments: [],
    profile: user,
    settings: defaultSettings,
    assignmentHistory: [],
  })

  const [settingsForm, setSettingsForm] = useState(appSettings)

  useEffect(() => {
    loadAdmin()
  }, [])

  useEffect(() => {
    setSettingsForm(appSettings)
    setData((previous) => ({ ...previous, settings: appSettings }))
    setDarkMode((appSettings.appearance?.mode ?? 'light') === 'dark')
  }, [appSettings])

  useEffect(() => {
    window.localStorage.setItem('edudev-admin-dark', darkMode ? '1' : '0')
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  async function loadAdmin({ silent = false } = {}) {
    if (!silent) {
      setLoading(true)
    }
    setError('')

    try {
      const [
        dashboard,
        users,
        modules,
        courses,
        practicalWorks,
        assessments,
        profile,
        settings,
        assignments,
      ] = await Promise.all([
        api('/dashboard'),
        api('/admin/users'),
        api('/modules'),
        api('/courses'),
        api('/practical-works'),
        api('/assessments'),
        api('/profile'),
        api('/admin/settings'),
        api('/admin/module-assignments'),
      ])

      const nextData = {
        dashboard,
        users,
        modules,
        courses,
        practicalWorks,
        assessments,
        profile: profile.user,
        settings: settings.settings,
        assignmentHistory: assignments.history ?? [],
      }
      setData(nextData)
      setSettingsForm(settings.settings)
      onSettingsChange?.(settings.settings)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  function updateSettings(group, key, value) {
    const next = {
      ...settingsForm,
      [group]: {
        ...settingsForm[group],
        [key]: value,
      },
    }
    setSettingsForm(next)
    setData((current) => ({ ...current, settings: next }))
    onSettingsChange?.(next)
  }

  function applyThemePreference(mode) {
    if (mode === 'dark') setDarkMode(true)
    if (mode === 'light') setDarkMode(false)
  }

  async function submitSettings(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await api('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm),
      })
      setSettingsForm(response.settings)
      setData((previous) => ({ ...previous, settings: response.settings }))
      applyThemePreference(response.settings.appearance?.mode)
      const isDark = response.settings.appearance?.mode === 'dark'
      window.localStorage.setItem('edudev-admin-dark', isDark ? '1' : '0')
      onSettingsChange?.(response.settings)
      showToast('Paramètres mis à jour sur toute la plateforme.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function runSettingsAction(action) {
    setSaving(true)
    setError('')

    try {
      const response = await api('/admin/settings/action', {
        method: 'POST',
        body: JSON.stringify({ action }),
      })
      setSettingsForm(response.settings)
      setData((previous) => ({ ...previous, settings: response.settings }))
      onSettingsChange?.(response.settings)
      showToast('Action exécutée.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const platformName = data.settings.general?.platform_name ?? 'EduDev'
  const profileName = data.profile?.name ?? user.name

  return (
    <AdminLayout
      user={user}
      profileName={profileName}
      platformName={platformName}
      active={active}
      setActive={setActive}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      loading={loading}
      error={error}
      setError={setError}
      toast={toast}
      setToast={setToast}
      onRefresh={() => loadAdmin({ silent: true })}
      onLogout={onLogout}
    >
      {active === 'dashboard' && (
        <DashboardOverview
          stats={data.dashboard?.stats ?? {}}
          recentUsers={data.dashboard?.recent?.users ?? []}
          recentModules={data.dashboard?.recent?.modules ?? []}
          recentCourses={data.dashboard?.recent?.courses ?? []}
        />
      )}

      {active === 'users' && (
        <UsersManagement
          users={data.users}
          api={api}
          loadAdmin={loadAdmin}
          showToast={showToast}
          setError={setError}
          saving={saving}
          setSaving={setSaving}
        />
      )}

      {active === 'modules' && (
        <ModulesManagement
          modules={data.modules}
          api={api}
          loadAdmin={loadAdmin}
          showToast={showToast}
          setError={setError}
          saving={saving}
          setSaving={setSaving}
        />
      )}

      {active === 'assignments' && (
        <AssignmentsManagement
          users={data.users}
          modules={data.modules}
          assignmentHistory={data.assignmentHistory}
          api={api}
          loadAdmin={loadAdmin}
          showToast={showToast}
          setError={setError}
          saving={saving}
          setSaving={setSaving}
        />
      )}

      {active === 'content' && (
        <ContentManagement
          courses={data.courses}
          practicalWorks={data.practicalWorks}
          assessments={data.assessments}
          modules={data.modules}
          users={data.users}
          api={api}
          loadAdmin={loadAdmin}
          showToast={showToast}
          setError={setError}
        />
      )}

      {active === 'settings' && (
        <Settings
          settings={settingsForm}
          saving={saving}
          darkMode={darkMode}
          onChange={updateSettings}
          onSubmit={submitSettings}
          onAction={runSettingsAction}
          onDarkMode={setDarkMode}
        />
      )}

      {active === 'profile' && (
        <Profile
          profile={data.profile}
          api={api}
          loadAdmin={loadAdmin}
          showToast={showToast}
          setError={setError}
          saving={saving}
          setSaving={setSaving}
        />
      )}
    </AdminLayout>
  )
}
