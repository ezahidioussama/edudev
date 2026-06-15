/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from 'react'
import Modal from '../../components/Modal'
import Panel from '../../components/Panel'
import Badge from '../../components/Badge'
import Empty from '../../components/Empty'
import { Input, Select, Textarea, Submit, SmallButton } from '../../components/FormControls'
import { roleLabel, classNames } from '../../utils/helpers'

const emptyUser = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'trainee',
  is_active: true,
  phone: '',
  specialty: '',
  bio: '',
  module_ids: [],
}

export default function UsersManagement({
  users,
  api,
  loadAdmin,
  showToast,
  setError,
  saving,
  setSaving,
}) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [optionFilter, setOptionFilter] = useState('all')
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState(emptyUser)

  useEffect(() => {
    if (roleFilter !== 'trainee') {
      setGroupFilter('all')
      setOptionFilter('all')
    }
  }, [roleFilter])

  const handleGroupFilterChange = (value) => {
    setGroupFilter(value)
    if (value !== '2') {
      setOptionFilter('all')
    }
  }

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase()
    let list = users.filter((item) => {
      const matchesRole = roleFilter === 'all' || item.role === roleFilter
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search)

      if (item.role === 'trainee') {
        let matchesGroup = true
        if (groupFilter === '1') {
          matchesGroup = item.specialty && (item.specialty.includes('1') || item.specialty.includes('1ère'))
        } else if (groupFilter === '2') {
          matchesGroup = item.specialty && (item.specialty.includes('2') || item.specialty.includes('2ème'))
        }

        let matchesOption = true
        if (optionFilter !== 'all') {
          matchesOption = item.specialty && item.specialty.toLowerCase().includes(optionFilter.toLowerCase())
        }

        return matchesRole && matchesSearch && matchesGroup && matchesOption
      }

      return matchesRole && matchesSearch
    })

    return [...list].sort((a, b) => a.name.localeCompare(b.name))
  }, [users, query, roleFilter, groupFilter, optionFilter])

  function openUserModal(nextUser = null) {
    setEditingUser(nextUser)
    setUserForm(
      nextUser
        ? {
            first_name: nextUser.first_name ?? '',
            last_name: nextUser.last_name ?? '',
            email: nextUser.email ?? '',
            password: '',
            role: nextUser.role ?? 'trainee',
            is_active: nextUser.is_active !== false,
            phone: nextUser.phone ?? '',
            specialty: nextUser.specialty ?? '',
            bio: nextUser.bio ?? '',
            module_ids: (nextUser.modules ?? []).map((item) => String(item.id)),
          }
        : emptyUser
    )
    setUserModalOpen(true)
  }

  async function submitUser(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = { ...userForm }
      delete payload.module_ids
      if (payload.role === 'trainer') {
        payload.specialty = ''
        payload.bio = ''
      }
      if (editingUser && !payload.password) delete payload.password

      await api(editingUser ? `/admin/users/${editingUser.id}` : '/admin/users', {
        method: editingUser ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })
      setUserModalOpen(false)
      await loadAdmin()
      showToast(editingUser ? 'Utilisateur modifié.' : 'Utilisateur créé.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleUser(nextUser) {
    setError('')
    try {
      await api(`/admin/users/${nextUser.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !nextUser.is_active }),
      })
      await loadAdmin()
      showToast(nextUser.is_active ? 'Compte desactive.' : 'Compte active.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function removeUser(nextUser) {
    if (!window.confirm('Confirmer la suppression ?')) return
    setError('')
    try {
      await api(`/admin/users/${nextUser.id}`, { method: 'DELETE' })
      await loadAdmin()
      showToast('Utilisateur supprimé.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      <Panel
        title="Gestion des utilisateurs"
        action={
          <button className="primary-admin-button" type="button" onClick={() => openUserModal()}>
            Ajouter utilisateur
          </button>
        }
      >
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr,220px]">
          <input
            className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par nom ou email..."
          />
          <select
            className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admins</option>
            <option value="trainer">Formateurs</option>
            <option value="trainee">Stagiaires</option>
          </select>
        </div>

        {roleFilter === 'trainee' && (
          <div className="mb-5 grid gap-4 rounded-[24px] border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-3 animate-fadeIn">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Filtrer par Groupe
              </span>
              <select
                className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1"
                value={groupFilter}
                onChange={(event) => handleGroupFilterChange(event.target.value)}
              >
                <option value="all">Tous les groupes</option>
                <option value="1">1ère année</option>
                <option value="2">2ème année</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Filtrer par Option
              </span>
              <select
                className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={groupFilter !== '2'}
                value={optionFilter}
                onChange={(event) => setOptionFilter(event.target.value)}
              >
                <option value="all">
                  {groupFilter === '2' ? 'Toutes les options' : 'Non applicable'}
                </option>
                <option value="Full Stack">Full Stack</option>
                <option value="Mobile">Mobile</option>
                <option value="RV/RA">RV/RA</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setGroupFilter('all')
                  setOptionFilter('all')
                }}
                className="w-full h-11 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-orange-400 cursor-pointer"
              >
                Réinitialiser filtres
              </button>
            </div>
          </div>
        )}

        <UsersTable
          users={filteredUsers}
          onEdit={openUserModal}
          onToggle={toggleUser}
          onDelete={removeUser}
        />
      </Panel>

      <Modal
        open={userModalOpen}
        title={editingUser ? 'Modifier utilisateur' : 'Ajouter utilisateur'}
        onClose={() => setUserModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={submitUser}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Prénom"
              value={userForm.first_name || ''}
              onChange={(value) => setUserForm((previous) => ({ ...previous, first_name: value }))}
            />
            <Input
              label="Nom"
              value={userForm.last_name || ''}
              onChange={(value) => setUserForm((previous) => ({ ...previous, last_name: value }))}
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(value) => setUserForm((previous) => ({ ...previous, email: value }))}
          />
          <Input
            label={editingUser ? 'Mot de passe (optionnel)' : 'Mot de passe'}
            type="password"
            value={userForm.password}
            onChange={(value) => setUserForm((previous) => ({ ...previous, password: value }))}
          />
          <Select
            label="Rôle"
            value={userForm.role}
            onChange={(value) => setUserForm((previous) => ({ ...previous, role: value }))}
            options={[
              ['admin', 'Admin'],
              ['trainer', 'Formateur'],
              ['trainee', 'Stagiaire'],
            ]}
          />
          <Input
            label="Téléphone"
            value={userForm.phone}
            onChange={(value) => setUserForm((previous) => ({ ...previous, phone: value }))}
          />
          {userForm.role !== 'trainer' ? (
            <>
              <Input
                label="Groupe"
                value={userForm.specialty}
                onChange={(value) => setUserForm((previous) => ({ ...previous, specialty: value }))}
              />
              <Textarea
                label="Bio"
                value={userForm.bio}
                onChange={(value) => setUserForm((previous) => ({ ...previous, bio: value }))}
              />
            </>
          ) : null}
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={userForm.is_active}
              onChange={(event) =>
                setUserForm((previous) => ({ ...previous, is_active: event.target.checked }))
              }
            />{' '}
            Compte actif
          </label>
          <Submit saving={saving} label={editingUser ? 'Enregistrer' : 'Créer utilisateur'} />
        </form>
      </Modal>
    </>
  )
}

function UsersTable({ users, onEdit, onToggle, onDelete }) {
  if (!users.length) return <Empty label="Aucun utilisateur trouvé." />

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Groupe / Spécialité</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Modules</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {users.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/70">
                <td className="px-4 py-4">
                  <strong>{item.name}</strong>
                  <p className="text-slate-500">{item.email}</p>
                </td>
                <td className="px-4 py-4">{roleLabel(item.role)}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-semibold">
                  {item.specialty || '-'}
                </td>
                <td className="px-4 py-4">
                  <Badge tone={item.is_active ? 'success' : 'danger'}>
                    {item.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </td>
                <td className="max-w-sm px-4 py-4 text-slate-600 dark:text-slate-300">
                  {(item.modules ?? []).map((module) => module.title).join(', ') || '-'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <SmallButton onClick={() => onEdit(item)}>Modifier</SmallButton>
                    <SmallButton onClick={() => onToggle(item)}>
                      {item.is_active ? 'Désactiver' : 'Activer'}
                    </SmallButton>
                    <SmallButton danger onClick={() => onDelete(item)}>
                      Supprimer
                    </SmallButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
