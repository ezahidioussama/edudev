/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import Panel from '../../components/Panel'
import { Input, FileInput, Submit } from '../../components/FormControls'
import Avatar from '../../components/Avatar'

export default function Profile({
  profile,
  api,
  loadAdmin,
  showToast,
  setError,
  saving,
  setSaving,
}) {
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    avatar: null,
  })

  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  // Sync profile details when reloaded
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        avatar: null,
      })
    }
  }, [profile])

  async function submitProfile(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const form = new FormData()
      form.append('first_name', profileForm.first_name)
      form.append('last_name', profileForm.last_name)
      form.append('email', profileForm.email)
      if (profileForm.avatar) form.append('avatar', profileForm.avatar)
      await api('/profile', { method: 'POST', body: form })
      window.localStorage.setItem('edudev.avatar.buster', String(Date.now()))
      await loadAdmin()
      showToast('Profil mis à jour.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function submitPassword(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await api('/profile/password', { method: 'PUT', body: JSON.stringify(passwordForm) })
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
      setPasswordModalOpen(false)
      showToast('Mot de passe mis à jour.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Panel title="Profil administrateur">
        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-800 to-orange-500 p-6 text-white shadow-xl shadow-slate-950/20">
            <div className="flex items-center gap-4">
              <Avatar user={profile} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-100">
                  Administrateur
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white" style={{ color: '#fdba74' }}>{profile?.name}</h3>
                <p className="mt-1 text-sm text-orange-50">{profile?.email}</p>
              </div>
            </div>
          </div>
          <form
            className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70"
            onSubmit={submitProfile}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Prénom"
                value={profileForm.first_name}
                onChange={(value) =>
                  setProfileForm((previous) => ({ ...previous, first_name: value }))
                }
              />
              <Input
                label="Nom"
                value={profileForm.last_name}
                onChange={(value) =>
                  setProfileForm((previous) => ({ ...previous, last_name: value }))
                }
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(value) => setProfileForm((previous) => ({ ...previous, email: value }))}
            />
            <FileInput
              label="Avatar"
              accept="image/png,image/jpeg,image/webp"
              onChange={(file) => setProfileForm((previous) => ({ ...previous, avatar: file }))}
            />
            <div className="flex flex-wrap gap-3">
              <button className="primary-admin-button" type="submit" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
              </button>
              <button
                className="secondary-admin-button"
                type="button"
                onClick={() => setPasswordModalOpen(true)}
              >
                Changer mot de passe
              </button>
            </div>
          </form>
        </div>
      </Panel>

      <Modal
        open={passwordModalOpen}
        title="Changer mot de passe"
        onClose={() => setPasswordModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={submitPassword}>
          <Input
            label="Mot de passe actuel"
            type="password"
            value={passwordForm.current_password}
            onChange={(value) =>
              setPasswordForm((previous) => ({ ...previous, current_password: value }))
            }
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={passwordForm.password}
            onChange={(value) => setPasswordForm((previous) => ({ ...previous, password: value }))}
          />
          <Input
            label="Confirmation"
            type="password"
            value={passwordForm.password_confirmation}
            onChange={(value) =>
              setPasswordForm((previous) => ({ ...previous, password_confirmation: value }))
            }
          />
          <Submit saving={saving} label="Mettre à jour" />
        </form>
      </Modal>
    </>
  )
}
