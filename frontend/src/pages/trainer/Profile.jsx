/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import {
  ProfileHero,
  ProfileCard,
  CompactMetric,
  resolveApiUrl,
} from './trainerShared'
import { classNames } from '../../utils/helpers'

function InputField({ label, value, onChange, type = 'text', placeholder = '', error = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={classNames(
          'h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15',
          error ? 'border-rose-300 dark:border-rose-500/60' : 'border-slate-300 dark:border-slate-600'
        )}
      />
      {error ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </label>
  )
}

function TextAreaField({ label, value, onChange, placeholder = '', rows = 5 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15"
      ></textarea>
    </label>
  )
}

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
            <span>{(user?.name ?? 'F').slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition group-hover:-translate-y-0.5">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M12 15V4.5M8 8.5l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9A2.5 2.5 0 0 0 19 17.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
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
      {error ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
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
            'h-12 w-full rounded-2xl border bg-white px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15',
            error ? 'border-rose-300 dark:border-rose-500/60' : 'border-slate-300 dark:border-slate-600'
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M3 4.5 21 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10.6 6.4c.45-.1.92-.15 1.4-.15 5.85 0 9.25 5.75 9.25 5.75a17 17 0 0 1-2.7 3.4M6.3 8.6C4.15 10.25 2.75 12 2.75 12s3.4 5.75 9.25 5.75c1.4 0 2.68-.33 3.84-.88" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.4 10.4a2.25 2.25 0 0 0 3.2 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M2.75 12s3.4-5.75 9.25-5.75S21.25 12 21.25 12s-3.4 5.75-9.25 5.75S2.75 12 2.75 12Z" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          )}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
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
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        {saving ? 'Enregistrement...' : submitLabel}
      </button>
    </div>
  )
}

const emptyProfileForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  bio: '',
}

const emptyPasswordForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
}

function validateProfileForm(form) {
  const errors = {}
  if (!form.first_name || !form.first_name.trim()) {
    errors.first_name = 'Le prénom est obligatoire.'
  }
  if (!form.last_name || !form.last_name.trim()) {
    errors.last_name = 'Le nom est obligatoire.'
  }
  if (!form.email || !form.email.trim()) {
    errors.email = "L'adresse email est obligatoire."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.'
  }
  return errors
}

function validatePasswordForm(form) {
  const errors = {}
  if (!form.current_password) {
    errors.current_password = 'Le mot de passe actuel est obligatoire.'
  }
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

export default function Profile({
  user,
  profileUser,
  setProfileUser,
  modulesCount,
  coursesCount,
  api,
  pushToast,
  saving,
  setSaving,
}) {
  const currentUser = profileUser ?? user

  const [profileForm, setProfileForm] = useState({
    ...emptyProfileForm,
    first_name: currentUser?.first_name ?? '',
    last_name: currentUser?.last_name ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    bio: currentUser?.bio ?? '',
  })

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarDragging, setAvatarDragging] = useState(false)
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    next: false,
    confirmation: false,
  })

  // Sync profile details when parent user reloads
  useEffect(() => {
    setProfileForm({
      ...emptyProfileForm,
      first_name: currentUser?.first_name ?? '',
      last_name: currentUser?.last_name ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      bio: currentUser?.bio ?? '',
    })
  }, [currentUser])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  function handleAvatarFile(file) {
    if (!file) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarFile(null)
      setAvatarPreview('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setProfileErrors((previous) => ({
        ...previous,
        avatar: 'Veuillez sélectionner une image valide.',
      }))
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setProfileErrors((previous) => ({
        ...previous,
        avatar: 'La photo ne doit pas dépasser 4 Mo.',
      }))
      return
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setProfileErrors((previous) => {
      const next = { ...previous }
      delete next.avatar
      return next
    })
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function resetProfileForm() {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(null)
    setAvatarPreview('')
    setProfileErrors({})
    setProfileForm({
      ...emptyProfileForm,
      first_name: currentUser?.first_name ?? '',
      last_name: currentUser?.last_name ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      bio: currentUser?.bio ?? '',
    })
  }

  async function submitProfile(event) {
    event.preventDefault()
    const errors = validateProfileForm(profileForm)

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
      if (profileForm.phone) body.append('phone', profileForm.phone)
      if (profileForm.bio) body.append('bio', profileForm.bio)
      if (avatarFile) {
        body.append('avatar', avatarFile)
      }

      const response = await api('/profile', {
        method: 'POST',
        body,
      })

      if (response?.user) {
        window.localStorage.setItem('edudev.avatar.buster', String(Date.now()))
        setProfileUser(response.user)
      }

      setAvatarFile(null)
      setAvatarPreview('')
      pushToast('success', 'Profil mis à jour avec succès.')
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitPassword(event) {
    event.preventDefault()
    const errors = validatePasswordForm(passwordForm)

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
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <ProfileHero
        user={currentUser}
        modulesCount={modulesCount}
        coursesCount={coursesCount}
        avatarPreview={avatarPreview}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <ProfileCard
          title="Informations du profil"
          eyebrow="Identité formateur"
          description="Gardez vos coordonnées publiques propres et cohérentes avec le reste du tableau de bord."
        >
          <form className="space-y-5" onSubmit={submitProfile}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Prénom"
                value={profileForm.first_name}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, first_name: value }))
                  setProfileErrors((previous) => ({ ...previous, first_name: '' }))
                }}
                placeholder="Votre prénom"
                error={profileErrors.first_name}
              />
              <InputField
                label="Nom"
                value={profileForm.last_name}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, last_name: value }))
                  setProfileErrors((previous) => ({ ...previous, last_name: '' }))
                }}
                placeholder="Votre nom"
                error={profileErrors.last_name}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Adresse email"
                type="email"
                value={profileForm.email}
                onChange={(value) => {
                  setProfileForm((previous) => ({ ...previous, email: value }))
                  setProfileErrors((previous) => ({ ...previous, email: '' }))
                }}
                placeholder="email@exemple.com"
                error={profileErrors.email}
              />
              <InputField
                label="Téléphone"
                type="tel"
                value={profileForm.phone}
                onChange={(value) => setProfileForm((previous) => ({ ...previous, phone: value }))}
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            <TextAreaField
              label="Bio / Présentation"
              value={profileForm.bio}
              onChange={(value) => setProfileForm((previous) => ({ ...previous, bio: value }))}
              placeholder="Décrivez votre parcours, vos spécialités ou votre expérience..."
              rows={3}
            />

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

            <div className="grid gap-3 sm:grid-cols-3">
              <CompactMetric label="Rôle" value="Formateur" />
              <CompactMetric label="Modules assignés" value={modulesCount} />
              <CompactMetric label="Cours publiés" value={coursesCount} />
            </div>

            <ProfileActions
              saving={saving}
              submitLabel="Enregistrer le profil"
              onReset={resetProfileForm}
            />
          </form>
        </ProfileCard>

        <ProfileCard
          title="Sécurité du compte"
          eyebrow="Mot de passe"
          description="Mettez à jour vos accès avec une confirmation claire et des champs protégés."
          icon={({ className }) => (
            <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
              <path
                d="m12 3.5 6 2.5V11c0 4-2.35 7.44-6 9-3.65-1.56-6-5-6-9V6l6-2.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="m9.4 11.8 1.7 1.7 3.6-3.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        >
          <form className="space-y-5" onSubmit={submitPassword}>
            <PasswordField
              label="Mot de passe actuel"
              value={passwordForm.current_password}
              visible={passwordVisibility.current}
              autoComplete="current-password"
              error={passwordErrors.current_password}
              onToggle={() =>
                setPasswordVisibility((previous) => ({ ...previous, current: !previous.current }))
              }
              onChange={(value) => {
                setPasswordForm((previous) => ({ ...previous, current_password: value }))
                setPasswordErrors((previous) => ({ ...previous, current_password: '' }))
              }}
            />
            <PasswordField
              label="Nouveau mot de passe"
              value={passwordForm.password}
              visible={passwordVisibility.next}
              autoComplete="new-password"
              error={passwordErrors.password}
              onToggle={() =>
                setPasswordVisibility((previous) => ({ ...previous, next: !previous.next }))
              }
              onChange={(value) => {
                setPasswordForm((previous) => ({ ...previous, password: value }))
                setPasswordErrors((previous) => ({ ...previous, password: '' }))
              }}
            />
            <PasswordField
              label="Confirmation du mot de passe"
              value={passwordForm.password_confirmation}
              visible={passwordVisibility.confirmation}
              autoComplete="new-password"
              error={passwordErrors.password_confirmation}
              onToggle={() =>
                setPasswordVisibility((previous) => ({
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
              Utilisez au moins 8 caractères. La mise à jour reste gérée par l'API sécurisée
              existante.
            </div>

            <ProfileActions
              saving={saving}
              submitLabel="Mettre à jour le mot de passe"
              onReset={() => {
                setPasswordForm(emptyPasswordForm)
                setPasswordErrors({})
              }}
            />
          </form>
        </ProfileCard>
      </div>
    </section>
  )
}
