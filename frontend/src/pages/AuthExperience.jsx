import logo from '../assets/logo.jpeg'

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 6.5 5.75v5.38c0 4.06 2.36 7.56 5.5 9.37 3.14-1.81 5.5-5.31 5.5-9.37V5.75L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.7 1.7L14.8 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.75 12s3.4-5.75 9.25-5.75S21.25 12 21.25 12s-3.4 5.75-9.25 5.75S2.75 12 2.75 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4.5 21 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M10.58 6.42A10.4 10.4 0 0 1 12 6.25c5.85 0 9.25 5.75 9.25 5.75a16.8 16.8 0 0 1-2.73 3.41M6.27 8.59C4.13 10.24 2.75 12 2.75 12s3.4 5.75 9.25 5.75c1.4 0 2.68-.33 3.84-.87"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.39 10.39A2.25 2.25 0 0 0 13.61 13.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AuthField({ label, type, placeholder, value, onChange, autoComplete }) {
  return (
    <label className="field auth-field">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  )
}

function PasswordField({ label, placeholder, value, onChange, visible, onToggle, autoComplete }) {
  return (
    <label className="field auth-field">
      <span>{label}</span>
      <div className="password-field">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={onToggle}
          aria-label="Afficher ou masquer le mot de passe"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  )
}

function SubmitButton({ loading, label, loadingLabel }) {
  return (
    <button className="auth-submit" disabled={loading} type="submit">
      {loading ? (
        <span className="button-loading">
          <span className="button-spinner"></span>
          <span>{loadingLabel}</span>
        </span>
      ) : (
        label
      )}
    </button>
  )
}

export default function AuthExperience({
  authMode,
  setAuthMode,
  platformName,
  error,
  feedback,
  loading,
  loginForm,
  setLoginForm,
  authForm,
  setAuthForm,
  rememberMe,
  setRememberMe,
  showLoginPassword,
  setShowLoginPassword,
  showRegisterPassword,
  setShowRegisterPassword,
  showRegisterPasswordConfirmation,
  setShowRegisterPasswordConfirmation,
  handleLogin,
  handleRegister,
}) {
  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <section className="auth-hero-panel">
          <div className="auth-hero-glow auth-hero-glow-one"></div>
          <div className="auth-hero-glow auth-hero-glow-two"></div>

          <div className="auth-hero-content">
            <div className="auth-badge-pill">
              <ShieldIcon />
              <span>Accès sécurisé</span>
            </div>

            <div className="auth-logo-row">
              <div className="auth-logo-icon" style={{ background: '#fff', padding: 0 }}>
                <img src={logo} alt="EduDev Logo" className="w-full h-full object-cover rounded-[inherit]" />
              </div>
              <p className="auth-hero-logo">{platformName}</p>
            </div>

            <h1 className="auth-hero-title">Bienvenue</h1>
            <p className="auth-hero-subtitle">Accédez à votre espace de formation en toute sécurité.</p>

            <div className="auth-hero-cards">
              <article className="auth-mini-card">
                <span className="auth-mini-label">Parcours de formation</span>
                <strong>Modules structurés</strong>
                <p>Suivez les cours, les contrôles et la progression depuis un seul espace.</p>
              </article>
              <article className="auth-mini-card auth-mini-card-offset">
                <span className="auth-mini-label">Accès protégé</span>
                <strong>Espace sécurisé</strong>
                <p>Une plateforme claire et sécurisée pour les équipes de formation.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="auth-card premium-auth-card">
          <div className="auth-card-header">
            <div className="auth-card-logo">
              <div className="auth-card-logo-icon" style={{ background: '#fff', padding: 0 }}>
                <img src={logo} alt="EduDev Logo" className="w-full h-full object-cover rounded-[inherit]" />
              </div>
              <span>{platformName}</span>
            </div>
          </div>

          <div className="auth-card-copy">
            <h2>{authMode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte stagiaire'}</h2>
            <p>
              {authMode === 'login'
                ? 'Entrez vos identifiants pour continuer.'
                : 'Inscrivez-vous comme stagiaire pour accéder à la plateforme.'}
            </p>
          </div>

          <div className="auth-tabs premium-tabs">
            <span
              className="auth-tab-indicator"
              style={{ transform: authMode === 'login' ? 'translateX(0%)' : 'translateX(100%)' }}
            ></span>
            <button
              type="button"
              className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('login')}
            >
              Connexion
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('register')}
            >
              Inscription
            </button>
          </div>

          {error ? <p className="auth-message auth-error">{error}</p> : null}
          {feedback ? <p className="auth-message auth-success">{feedback}</p> : null}

          <div key={authMode} className="auth-form-stage">
            {authMode === 'login' ? (
              <form className="auth-form premium-auth-form" onSubmit={handleLogin}>
                <AuthField
                  label="E-mail"
                  type="email"
                  placeholder="email@exemple.com"
                  value={loginForm.email}
                  autoComplete="email"
                  onChange={(value) => setLoginForm({ ...loginForm, email: value })}
                />

                <PasswordField
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  value={loginForm.password}
                  autoComplete="current-password"
                  visible={showLoginPassword}
                  onToggle={() => setShowLoginPassword((value) => !value)}
                  onChange={(value) => setLoginForm({ ...loginForm, password: value })}
                />

                <div className="auth-meta-row">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>Se souvenir de moi</span>
                  </label>

                  <a href="#" className="auth-link" onClick={(event) => event.preventDefault()}>
                    Mot de passe oublié ?
                  </a>
                </div>

                <SubmitButton loading={loading} label="Se connecter" loadingLabel="Connexion..." />
              </form>
            ) : (
              <form className="auth-form premium-auth-form" onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <AuthField
                    label="Prénom"
                    type="text"
                    placeholder="Entrez votre prénom"
                    value={authForm.first_name || ''}
                    autoComplete="given-name"
                    onChange={(value) => setAuthForm({ ...authForm, first_name: value })}
                  />
                  <AuthField
                    label="Nom"
                    type="text"
                    placeholder="Entrez votre nom"
                    value={authForm.last_name || ''}
                    autoComplete="family-name"
                    onChange={(value) => setAuthForm({ ...authForm, last_name: value })}
                  />
                </div>

                <AuthField
                  label="E-mail"
                  type="email"
                  placeholder="email@exemple.com"
                  value={authForm.email}
                  autoComplete="email"
                  onChange={(value) => setAuthForm({ ...authForm, email: value })}
                />

                <AuthField
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={authForm.phone}
                  autoComplete="tel"
                  onChange={(value) => setAuthForm({ ...authForm, phone: value })}
                />

                <label className="field auth-field">
                  <span>Filière</span>
                  <select
                    value={authForm.filiere}
                    onChange={(event) => setAuthForm({ ...authForm, filiere: event.target.value })}
                    required
                  >
                    <option value="Développement Digital">Développement Digital</option>
                  </select>
                </label>

                <label className="field auth-field">
                  <span>Année d'études</span>
                  <select
                    value={authForm.year_level}
                    onChange={(event) => setAuthForm({ ...authForm, year_level: event.target.value })}
                    required
                  >
                    <option value="1">1ère année</option>
                    <option value="2">2ème année</option>
                  </select>
                </label>

                {authForm.year_level === '2' && (
                  <label className="field auth-field">
                    <span>Option (2ème année)</span>
                    <select
                      value={authForm.option}
                      onChange={(event) => setAuthForm({ ...authForm, option: event.target.value })}
                      required
                    >
                      <option value="Full Stack">Full Stack</option>
                      <option value="Mobile">Mobile</option>
                      <option value="RV/RA">RV/RA (Réalité Virtuelle & Réalité Augmentée)</option>
                    </select>
                  </label>
                )}

                <PasswordField
                  label="Mot de passe"
                  placeholder="Créez votre mot de passe"
                  value={authForm.password}
                  autoComplete="new-password"
                  visible={showRegisterPassword}
                  onToggle={() => setShowRegisterPassword((value) => !value)}
                  onChange={(value) => setAuthForm({ ...authForm, password: value })}
                />

                <PasswordField
                  label="Confirmez le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  value={authForm.password_confirmation}
                  autoComplete="new-password"
                  visible={showRegisterPasswordConfirmation}
                  onToggle={() => setShowRegisterPasswordConfirmation((value) => !value)}
                  onChange={(value) =>
                    setAuthForm({ ...authForm, password_confirmation: value })
                  }
                />

                <SubmitButton
                  loading={loading}
                  label="Créer le compte stagiaire"
                  loadingLabel="Création du compte..."
                />
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
