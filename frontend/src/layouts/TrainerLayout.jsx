import { classNames } from '../utils/helpers'
import ToastStack from '../components/ToastStack'

export default function TrainerLayout({
  user,
  platformName,
  activeSection,
  setActiveSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  toggleDarkMode,
  refreshing,
  toasts,
  onRefresh,
  onLogout,
  sections,
  SidebarLink,
  MenuIcon,
  RefreshIcon,
  LogoutIcon,
  children,
}) {
  const currentUserName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || '';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        <ToastStack toasts={toasts} />

        <div className="flex min-h-screen">
          <aside
            className={classNames(
              'fixed inset-y-0 left-0 z-40 w-72 h-screen max-h-screen overflow-y-scroll lg:h-auto lg:max-h-none border-r border-white/50 bg-white/90 p-5 pb-28 lg:pb-5 shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20 lg:static lg:translate-x-0',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="mb-8 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/25">
                <span className="h-6 w-6 block relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">{platformName}</p>
                <h1 className="text-sm font-bold leading-snug text-slate-900 dark:text-white">Espace<br /><span className="whitespace-nowrap">formateur</span></h1>
              </div>
            </div>

            <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-500 p-5 text-white shadow-xl shadow-slate-900/20">
              <h2 className="text-2xl font-semibold">{currentUserName}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Gérez vos modules, publiez vos ressources PDF et pilotez votre espace pédagogique depuis une interface claire.
              </p>
            </div>

            <nav className="space-y-2">
              {sections.map((item) => (
                <SidebarLink
                  key={item.key}
                  active={activeSection === item.key}
                  label={item.label}
                  onClick={() => {
                    setActiveSection(item.key)
                    setMobileMenuOpen(false)
                  }}
                  icon={item.icon}
                />
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Mode sombre</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confortable pour les longues sessions de correction.</p>
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

          <div className="flex-1 lg:pl-0">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">{platformName}</p>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {sections.find((item) => item.key === activeSection)?.label}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onRefresh}
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

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
