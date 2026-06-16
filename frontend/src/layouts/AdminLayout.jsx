import { classNames } from '../utils/helpers'
import logo from '../assets/logo.jpeg'
import Alert from '../components/Alert'
import LoadingGrid from '../components/LoadingGrid'

const sections = [
  ['dashboard', 'Tableau de bord'],
  ['users', 'Utilisateurs'],
  ['modules', 'Modules'],
  ['assignments', 'Affectation des modules'],
  ['content', 'Gestion du contenu'],
  ['settings', 'Paramètres'],
  ['profile', 'Profil'],
]

function NavIcon() {
  return <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70"></span>
}

function sectionTitle(key) {
  return sections.find(([section]) => section === key)?.[1] ?? 'Tableau de bord'
}

export default function AdminLayout({
  user,
  profileName,
  platformName,
  active,
  setActive,
  darkMode,
  setDarkMode,
  loading,
  error,
  setError,
  toast,
  setToast,
  onRefresh,
  onLogout,
  children,
}) {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-80 flex-shrink-0 max-h-screen overflow-y-auto overflow-x-hidden border-r border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20 lg:block lg:h-auto lg:max-h-none">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 dark:border-slate-800">
                <img src={logo} alt="EduDev Logo" className="h-full w-full object-cover rounded-2xl" />
              </div>
              <div className="flex-1 min-w-max">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">{platformName}</p>
                <span className="block whitespace-nowrap text-2xl font-semibold leading-tight text-slate-900 dark:text-white">Espace Admin</span>
              </div>
            </div>

            <div className="mb-8 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-800 to-orange-500 p-5 text-white shadow-xl shadow-slate-950/20">
              <h2 className="truncate text-lg font-semibold whitespace-normal" style={{ color: '#fdba74' }}>{profileName || user.name}</h2>
              <p className="truncate text-xs text-orange-50 mt-1">{user?.email}</p>
              <p className="mt-3 text-xs leading-5 text-orange-50">
                Pilotez la plateforme, gérez les comptes utilisateurs, les modules et les paramètres généraux.
              </p>
            </div>
            <nav className="space-y-2">
              {sections.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={classNames(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition',
                    active === key
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <NavIcon />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/45 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
                  Administration
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                  {sectionTitle(active)}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="admin-input max-w-xs lg:hidden dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  value={active}
                  onChange={(event) => setActive(event.target.value)}
                >
                  {sections.map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setDarkMode((value) => !value)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-orange-400"
                  title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.364-6.364l-.707.707M7.05 16.95l-.707.707m11.314 0l-.707-.707M7.757 7.757l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  type="button"
                  onClick={onRefresh}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Actualiser
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
                  type="button"
                  onClick={onLogout}
                >
                  Déconnexion
                </button>
              </div>
            </header>

            {error ? <Alert tone="error" message={error} onClose={() => setError('')} /> : null}
            {toast ? <Alert tone="success" message={toast} onClose={() => setToast('')} /> : null}
            {loading ? <LoadingGrid /> : null}

            {!loading && children}
          </main>
        </div>
      </div>
    </div>
  )
}
