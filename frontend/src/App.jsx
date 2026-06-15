import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import { getEffectiveDarkMode } from './themePreferences'
import { api as axiosApi, setAccessToken, getAccessToken, setRefreshToken, getRefreshToken } from './api/client'
import AuthExperience from './pages/AuthExperience'
import MaintenanceExperience from './pages/MaintenanceExperience'

const AdminWorkspace = lazy(() => import('./admin/AdminWorkspace'))
const TrainerWorkspace = lazy(() => import('./trainer/TrainerWorkspace'))
const TraineeWorkspace = lazy(() => import('./trainee/TraineeWorkspace'))

const API_BASE = resolveApiBase()
const AUTH_USER_KEY = 'edudev.auth.user'

const defaultSettings = {
  general: { platform_name: 'EduDev', support_email: 'support@edudev.local' },
  appearance: { mode: 'light', primary_color: '#ff7900' },
  files: { pdf_max_size: 20, allowed_file_types: ['pdf'], storage_disk: 'local' },
  maintenance: { enabled: false },
}

const emptyRegister = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  filiere: 'Développement Digital',
  year_level: '1',
  option: 'Full Stack',
  password: '',
  password_confirmation: '',
}

function PremiumLoader({ message = 'Chargement...' }) {
  return (
    <div className="premium-splash-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div className="premium-loader" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div className="loader-ring" style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#ff7900',
          animation: 'spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite'
        }}></div>
        <p className="loader-text" style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          letterSpacing: '0.025em',
          opacity: 0.8,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>{message}</p>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.95; }
        }
      `}} />
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => readStoredUser())
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(emptyRegister)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterPasswordConfirmation, setShowRegisterPasswordConfirmation] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)

  const platformName = settings?.general?.platform_name || 'EduDev'
  const maintenanceEnabled = settings?.maintenance?.enabled === true

  useEffect(() => {
    const rToken = getRefreshToken()
    if (rToken) {
      setRefreshToken(rToken)
    }
    const token = window.localStorage.getItem('token')
    if (token) {
      setAccessToken(token)
    }
    bootstrap()
  }, [])

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === AUTH_USER_KEY || event.key === 'edudev.auth.logout_trigger') {
        const storedUser = readStoredUser()
        if (!storedUser) {
          setAccessToken(null)
          setRefreshToken(null)
          setUser(null)
          setFeedback('Session fermée depuis un autre onglet.')
          window.history.replaceState(null, '', '/login')
        } else {
          setUser(storedUser)
          const rToken = getRefreshToken()
          if (rToken) setRefreshToken(rToken)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    loadSettings()
    const interval = window.setInterval(loadSettings, 15000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    applyPlatformSettings(settings, user)
  }, [settings, user])

  useEffect(() => {
    function syncRoute() {
      if (!user && window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login')
      }

      if (user && ['/', '/login', '/register'].includes(window.location.pathname)) {
        window.history.replaceState(null, '', '/dashboard')
      }
    }

    window.addEventListener('popstate', syncRoute)
    syncRoute()
    return () => window.removeEventListener('popstate', syncRoute)
  }, [user])

  async function loadSettings() {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) return

      const data = await parseJsonResponse(response)
      if (data?.settings && typeof data.settings === 'object') {
        setSettings(data.settings)
      }
    } catch {
      // Keep local defaults
    }
  }

  function handleSettingsChange(nextSettings) {
    setSettings(nextSettings)
    applyPlatformSettings(nextSettings, user)
  }

  async function bootstrap() {
    setLoading(true)
    setError('')

    try {
      const rToken = getRefreshToken()
      const aToken = getAccessToken()

      if (!rToken && !aToken) {
        setAccessToken(null)
        setRefreshToken(null)
        clearStoredUser()
        clearWorkspaceCaches()
        setUser(null)
        setLoading(false)
        return
      }

      if (rToken && !aToken) {
        try {
          const refreshResponse = await axiosApi('/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: rToken }),
          })
          setAccessToken(refreshResponse.access_token)
          setRefreshToken(refreshResponse.refresh_token)
        } catch {
          setAccessToken(null)
          setRefreshToken(null)
          clearStoredUser()
          clearWorkspaceCaches()
          setUser(null)
          setLoading(false)
          return
        }
      }

      const meResponse = await api('/me')

      if (!meResponse.user) {
        setAccessToken(null)
        setRefreshToken(null)
        clearStoredUser()
        clearWorkspaceCaches()
        setUser(null)
        return
      }

      storeUser(meResponse.user)
      setUser(meResponse.user)
      if (['/', '/login', '/register'].includes(window.location.pathname)) {
        window.history.replaceState(null, '', '/dashboard')
      }
    } catch (requestError) {
      if ([401, 403].includes(requestError.status)) {
        setAccessToken(null)
        setRefreshToken(null)
        clearStoredUser()
        clearWorkspaceCaches()
        setUser(null)
      } else {
        setError(requestError.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function api(path, options = {}) {
    return axiosApi(path, options)
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await api('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })

      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      storeUser(data.user)
      clearWorkspaceCaches()
      setUser(data.user)
      window.history.replaceState(null, '', '/dashboard')
      setFeedback('Connexion réussie.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await api('/register', {
        method: 'POST',
        body: JSON.stringify(authForm),
      })

      setAuthForm(emptyRegister)
      setAuthMode('login')
      setFeedback(data.message || 'Inscription réussie ! Veuillez vous connecter.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      const rToken = getRefreshToken()
      if (rToken) {
        await api('/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: rToken }),
        })
      }
    } catch {
      // ignore logout failures and clear local state anyway
    }

    setAccessToken(null)
    setRefreshToken(null)
    clearStoredUser()
    clearWorkspaceCaches()
    setUser(null)
    window.localStorage.setItem('edudev.auth.logout_trigger', String(Date.now()))
    window.history.replaceState(null, '', '/login')
    setFeedback('Session fermée.')
  }

  if (!user) {
    return (
      <AuthExperience
        authMode={authMode}
        setAuthMode={setAuthMode}
        platformName={platformName}
        error={error}
        feedback={feedback}
        loading={loading}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        authForm={authForm}
        setAuthForm={setAuthForm}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        showLoginPassword={showLoginPassword}
        setShowLoginPassword={setShowLoginPassword}
        showRegisterPassword={showRegisterPassword}
        setShowRegisterPassword={setShowRegisterPassword}
        showRegisterPasswordConfirmation={showRegisterPasswordConfirmation}
        setShowRegisterPasswordConfirmation={setShowRegisterPasswordConfirmation}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    )
  }

  if (loading) {
    return <PremiumLoader message="Validation de votre session..." />
  }

  if (maintenanceEnabled && user.role !== 'admin') {
    return <MaintenanceExperience platformName={platformName} user={user} onLogout={handleLogout} />
  }

  return (
    <Suspense fallback={<PremiumLoader message="Chargement de votre espace..." />}>
      {user.role === 'trainer' && (
        <TrainerWorkspace user={user} api={api} onLogout={handleLogout} settings={settings} />
      )}
      {user.role === 'admin' && (
        <AdminWorkspace
          user={user}
          api={api}
          onLogout={handleLogout}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {user.role === 'trainee' && (
        <TraineeWorkspace user={user} api={api} onLogout={handleLogout} settings={settings} />
      )}
    </Suspense>
  )
}

function resolveApiBase() {
  return import.meta.env.VITE_API_URL || '/api'
}

async function parseJsonResponse(response) {
  const raw = await response.text()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function readStoredUser() {
  try {
    const rawUser = window.localStorage.getItem(AUTH_USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    return null
  }
}

function applyPlatformSettings(settings, user = null) {
  const safeSettings = settings || defaultSettings
  const useDark = getEffectiveDarkMode(safeSettings, user)

  document.documentElement.classList.toggle('dark', useDark)

  const color = safeSettings.appearance?.primary_color ?? '#ff7900'
  document.documentElement.style.setProperty('--primary-color', color)

  document.title = safeSettings.general?.platform_name || 'EduDev'
}

function storeUser(user) {
  if (!user) {
    clearStoredUser()
    return
  }
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  window.localStorage.removeItem(AUTH_USER_KEY)
}

function clearWorkspaceCaches() {
  window.localStorage.removeItem('edudev.admin.cache')
  window.localStorage.removeItem('edudev.trainer.cache')
  window.localStorage.removeItem('edudev.trainee.cache')
}

export default App
