
function MaintenanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
      <path
        d="M12 3.75 21 19.5H3L12 3.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 9v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16.4h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default function MaintenanceExperience({ platformName, user, onLogout }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-xl shadow-orange-500/25">
          <MaintenanceIcon />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-300">{platformName}</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Application en maintenance</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          Votre espace est temporairement indisponible pendant une opération de maintenance. Les
          administrateurs peuvent continuer à accéder à la plateforme.
        </p>
        {user?.name ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
            Connecté en tant que {user.name}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onLogout}
          className="mt-8 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
        >
          Déconnexion
        </button>
      </div>
    </main>
  )
}
