import { classNames } from '../../utils/helpers'
import {
  ProfileHero,
  ProfileCard,
  UploadIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  UserIcon,
  ShieldIcon,
  resolveApiUrl
} from './traineeShared'

function AvatarDropzone({ user, previewUrl, file, dragging, error, onDragging, onFile, onClear }) {
  const displayUrl = resolveApiUrl(previewUrl || user?.avatar_url)

  function handleDrop(event) {
    event.preventDefault()
    onDragging(false)
    onFile(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Photo de profil
      </span>
      <label
        onDragOver={(event) => {
          event.preventDefault()
          onDragging(true)
        }}
        onDragLeave={() => onDragging(false)}
        onDrop={handleDrop}
        className={classNames(
          'group flex cursor-pointer flex-col gap-4 rounded-[28px] border-2 border-dashed p-4 transition sm:flex-row sm:items-center',
          dragging
            ? 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-100 dark:border-orange-400 dark:bg-orange-500/10 dark:shadow-none'
            : 'border-slate-300 bg-slate-50/80 hover:border-orange-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-orange-500/60 dark:hover:bg-slate-900'
        )}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => onFile(event.target.files?.[0] ?? null)}
        />
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-white text-2xl font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800">
          {displayUrl ? (
            <img src={displayUrl} alt={user?.name ?? 'Avatar'} className="h-full w-full object-cover" />
          ) : (
            <span>{(user?.name ?? 'S').slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition group-hover:-translate-y-0.5">
              <UploadIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-950 dark:text-white">Glissez votre image ici</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG ou WEBP, jusqu'à 4 Mo.</p>
            </div>
          </div>
          {file ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="max-w-full truncate rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                {file.name}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  onClear()
                }}
                className="cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-all duration-200 hover:scale-105 hover:border-rose-200 hover:text-rose-600 active:scale-95 dark:border-slate-700 dark:text-slate-300"
              >
                Retirer
              </button>
            </div>
          ) : null}
        </div>
      </label>
      {error ? (
        <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p>
      ) : null}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', error = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={classNames(
          'h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15',
          error ? 'border-rose-300 dark:border-rose-500/60' : 'border-slate-300 dark:border-slate-600'
        )}
      />
      {error ? (
        <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p>
      ) : null}
    </label>
  )
}

function PasswordField({ label, value, onChange, visible, onToggle, error, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={classNames(
            'h-12 w-full rounded-2xl border bg-white px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15',
            error ? 'border-rose-300 dark:border-rose-500/60' : 'border-slate-300 dark:border-slate-600'
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p>
      ) : null}
    </label>
  )
}

function ProfileActions({ saving, submitLabel, onReset }) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-200"
      >
        Réinitialiser
      </button>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-w-[210px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
        ) : (
          <CheckIcon className="h-4 w-4" />
        )}
        {saving ? 'Enregistrement...' : submitLabel}
      </button>
    </div>
  )
}

export default function Profile({
  currentUser,
  avatarPreview,
  stats,
  profileForm,
  profileErrors,
  avatarFile,
  avatarDragging,
  saving,
  passwordForm,
  passwordErrors,
  passwordVisible,
  setProfileForm,
  setProfileErrors,
  setPasswordForm,
  setPasswordErrors,
  setPasswordVisible,
  setAvatarDragging,
  handleAvatarFile,
  submitProfile,
  submitPassword
}) {
  return (
    <section className="space-y-6">
      <ProfileHero user={currentUser} avatarPreview={avatarPreview} stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <ProfileCard title="Informations personnelles" eyebrow="Profil stagiaire" icon={UserIcon}>
          <form className="space-y-5" onSubmit={submitProfile}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Prénom"
                value={profileForm.first_name}
                error={profileErrors.first_name}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, first_name: value }))
                  setProfileErrors((previous) => ({ ...previous, first_name: '' }))
                }}
              />
              <InputField
                label="Nom"
                value={profileForm.last_name}
                error={profileErrors.last_name}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, last_name: value }))
                  setProfileErrors((previous) => ({ ...previous, last_name: '' }))
                }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Adresse email"
                type="email"
                value={profileForm.email}
                error={profileErrors.email}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, email: value }))
                  setProfileErrors((previous) => ({ ...previous, email: '' }))
                }}
              />
              <InputField
                label="Téléphone"
                type="tel"
                value={profileForm.phone}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, phone: value }))
                }}
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Année d'études
              </span>
              <select
                value={profileForm.year_level}
                onChange={(event) => {
                  setProfileForm((previous) => ({ ...previous, year_level: event.target.value }))
                }}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15"
              >
                <option value="1">1ère année</option>
                <option value="2">2ème année</option>
              </select>
            </label>

            {profileForm.year_level === '2' && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Option (2ème année)
                </span>
                <select
                  value={profileForm.option}
                  onChange={(event) => {
                    setProfileForm((previous) => ({ ...previous, option: event.target.value }))
                  }}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Mobile">Mobile</option>
                  <option value="RV/RA">RV/RA (Réalité Virtuelle & Réalité Augmentée)</option>
                </select>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Biographie
              </span>
              <textarea
                value={profileForm.bio}
                onChange={(event) => {
                  setProfileForm((previous) => ({ ...previous, bio: event.target.value }))
                }}
                rows="3"
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/15"
                placeholder="Décrivez votre parcours..."
              ></textarea>
            </label>

            <AvatarDropzone
              user={currentUser}
              previewUrl={avatarPreview}
              file={avatarFile}
              dragging={avatarDragging}
              error={profileErrors.avatar}
              onDragging={setAvatarDragging}
              onFile={handleAvatarFile}
              onClear={() => handleAvatarFile(null)}
            />

            <ProfileActions
              saving={saving}
              submitLabel="Enregistrer le profil"
              onReset={() => {
                const specialty = currentUser?.specialty || ''
                const yr = specialty.includes('2') ? '2' : '1'
                let opt = 'Full Stack'
                if (specialty.includes('Mobile')) opt = 'Mobile'
                if (specialty.includes('RV/RA')) opt = 'RV/RA'
                setProfileForm({
                  first_name: currentUser?.first_name ?? '',
                  last_name: currentUser?.last_name ?? '',
                  email: currentUser?.email ?? '',
                  phone: currentUser?.phone ?? '',
                  bio: currentUser?.bio ?? '',
                  year_level: yr,
                  option: opt,
                })
                setProfileErrors({})
                handleAvatarFile(null)
              }}
            />
          </form>
        </ProfileCard>

        <ProfileCard title="Sécurité du compte" eyebrow="Mot de passe" icon={ShieldIcon}>
          <form className="space-y-5" onSubmit={submitPassword}>
            <PasswordField
              label="Mot de passe actuel"
              value={passwordForm.current_password}
              visible={passwordVisible.current}
              error={passwordErrors.current_password}
              autoComplete="current-password"
              onToggle={() =>
                setPasswordVisible((previous) => ({ ...previous, current: !previous.current }))
              }
              onChange={(value) => {
                setPasswordForm((previous) => ({ ...previous, current_password: value }))
                setPasswordErrors((previous) => ({ ...previous, current_password: '' }))
              }}
            />
            <PasswordField
              label="Nouveau mot de passe"
              value={passwordForm.password}
              visible={passwordVisible.next}
              error={passwordErrors.password}
              autoComplete="new-password"
              onToggle={() => setPasswordVisible((previous) => ({ ...previous, next: !previous.next }))}
              onChange={(value) => {
                setPasswordForm((previous) => ({ ...previous, password: value }))
                setPasswordErrors((previous) => ({ ...previous, password: '' }))
              }}
            />
            <PasswordField
              label="Confirmation du mot de passe"
              value={passwordForm.password_confirmation}
              visible={passwordVisible.confirmation}
              error={passwordErrors.password_confirmation}
              autoComplete="new-password"
              onToggle={() =>
                setPasswordVisible((previous) => ({
                  ...previous,
                  confirmation: !previous.confirmation,
                }))
              }
              onChange={(value) => {
                setPasswordForm((previous) => ({ ...previous, password_confirmation: value }))
                setPasswordErrors((previous) => ({ ...previous, password_confirmation: '' }))
              }}
            />
            <div className="rounded-[24px] border border-orange-200/80 bg-orange-50/80 p-4 text-sm leading-6 text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
              Le mot de passe doit contenir au moins 8 caractères. La mise à jour reste sécurisée par
              l'API existante.
            </div>
            <ProfileActions
              saving={saving}
              submitLabel="Mettre à jour le mot de passe"
              onReset={() => {
                setPasswordForm({
                  current_password: '',
                  password: '',
                  password_confirmation: '',
                })
                setPasswordErrors({})
              }}
            />
          </form>
        </ProfileCard>
      </div>
    </section>
  )
}
