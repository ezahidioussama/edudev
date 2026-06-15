import { useState, useMemo } from 'react'
import Modal from '../../components/Modal'
import Panel from '../../components/Panel'
import Badge from '../../components/Badge'
import Empty from '../../components/Empty'
import { Input, Select, Textarea, Submit, SmallButton } from '../../components/FormControls'

const emptyModule = {
  title: '',
  description: '',
  year_level: '',
  option: '',
}

export default function ModulesManagement({
  modules,
  api,
  loadAdmin,
  showToast,
  setError,
  saving,
  setSaving,
}) {
  const [moduleYearFilter, setModuleYearFilter] = useState('all')
  const [moduleOptionFilter, setModuleOptionFilter] = useState('all')
  const [moduleModalOpen, setModuleModalOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [moduleForm, setModuleForm] = useState(emptyModule)

  const filteredModules = useMemo(() => {
    let list = modules.filter((item) => {
      let matchesYear = true
      if (moduleYearFilter === '1') {
        matchesYear = item.year_level === 1
      } else if (moduleYearFilter === '2') {
        matchesYear = item.year_level === 2
      }

      let matchesOption = true
      if (moduleOptionFilter !== 'all') {
        matchesOption = item.option && item.option.toLowerCase() === moduleOptionFilter.toLowerCase()
      }

      return matchesYear && matchesOption
    })

    return [...list].sort((a, b) => a.title.localeCompare(b.title))
  }, [modules, moduleYearFilter, moduleOptionFilter])

  function openModuleModal(nextModule = null) {
    setEditingModule(nextModule)
    setModuleForm(
      nextModule
        ? {
            title: nextModule.title ?? '',
            description: nextModule.description ?? '',
            year_level:
              nextModule.year_level !== null && nextModule.year_level !== undefined
                ? String(nextModule.year_level)
                : '',
            option: nextModule.option ?? '',
          }
        : emptyModule
    )
    setModuleModalOpen(true)
  }

  async function submitModule(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await api(editingModule ? `/modules/${editingModule.id}` : '/modules', {
        method: editingModule ? 'PUT' : 'POST',
        body: JSON.stringify({
          title: moduleForm.title,
          description: moduleForm.description,
          year_level: moduleForm.year_level ? Number(moduleForm.year_level) : null,
          option: moduleForm.year_level === '2' && moduleForm.option ? moduleForm.option : null,
        }),
      })
      setModuleModalOpen(false)
      await loadAdmin()
      showToast(editingModule ? 'Module modifié.' : 'Module créé.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeModule(moduleItem) {
    if (!window.confirm('Confirmer la suppression ?')) return
    setError('')
    try {
      await api(`/modules/${moduleItem.id}`, { method: 'DELETE' })
      await loadAdmin()
      showToast('Module supprimé.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      <Panel
        title="Modules"
        action={
          <button className="primary-admin-button" type="button" onClick={() => openModuleModal()}>
            Ajouter module
          </button>
        }
      >
        <div className="mb-5 grid gap-4 rounded-[24px] border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-3 animate-fadeIn">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filtrer par Année
            </span>
            <select
              className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1"
              value={moduleYearFilter}
              onChange={(event) => {
                setModuleYearFilter(event.target.value)
                if (event.target.value !== '2') setModuleOptionFilter('all')
              }}
            >
              <option value="all">Toutes les années</option>
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
              disabled={moduleYearFilter !== '2'}
              value={moduleOptionFilter}
              onChange={(event) => setModuleOptionFilter(event.target.value)}
            >
              <option value="all">
                {moduleYearFilter === '2' ? 'Toutes les options' : 'Non applicable'}
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
                setModuleYearFilter('all')
                setModuleOptionFilter('all')
              }}
              className="w-full h-11 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-orange-400 cursor-pointer"
            >
              Réinitialiser filtres
            </button>
          </div>
        </div>

        <CardsGrid
          items={filteredModules}
          render={(moduleItem) => (
            <AdminCard
              key={moduleItem.id}
              title={moduleItem.title}
              meta={moduleItem.description || 'Aucune description'}
              tags={[
                moduleItem.year_level === 1 ? '1ère année' : moduleItem.year_level === 2 ? '2ème année' : null,
                moduleItem.option || null,
                ...(moduleItem.trainers ?? []).map((item) => item.name),
              ].filter(Boolean)}
              onEdit={() => openModuleModal(moduleItem)}
              onDelete={() => removeModule(moduleItem)}
            />
          )}
        />
      </Panel>

      <Modal
        open={moduleModalOpen}
        title={editingModule ? 'Modifier module' : 'Ajouter module'}
        onClose={() => setModuleModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={submitModule}>
          <Input
            label="Titre"
            value={moduleForm.title}
            onChange={(value) => setModuleForm((previous) => ({ ...previous, title: value }))}
          />
          <Textarea
            label="Description"
            value={moduleForm.description}
            onChange={(value) => setModuleForm((previous) => ({ ...previous, description: value }))}
          />

          <Select
            label="Année d'études"
            value={moduleForm.year_level || ''}
            onChange={(value) =>
              setModuleForm((previous) => ({
                ...previous,
                year_level: value,
                option: value === '2' ? previous.option : '',
              }))
            }
            options={[
              ['', 'Sélectionner l\'année'],
              ['1', '1ère année'],
              ['2', '2ème année'],
            ]}
          />

          {moduleForm.year_level === '2' && (
            <Select
              label="Option (2ème année)"
              value={moduleForm.option || ''}
              onChange={(value) => setModuleForm((previous) => ({ ...previous, option: value }))}
              options={[
                ['', 'Toutes les options (Tronc commun 2ème année)'],
                ['Full Stack', 'Full Stack'],
                ['Mobile', 'Mobile'],
                ['RV/RA', 'RV/RA'],
              ]}
            />
          )}

          <Submit saving={saving} label={editingModule ? 'Enregistrer module' : 'Créer module'} />
        </form>
      </Modal>
    </>
  )
}

function CardsGrid({ items, render }) {
  if (!items.length) return <Empty label="Aucune donnée." />
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(render)}</div>
}

function AdminCard({ title, meta, tags = [], onEdit = null, onDelete = null }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <h3 className="break-words text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
        {meta}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.slice(0, 6).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        {onEdit ? <SmallButton onClick={onEdit}>Modifier</SmallButton> : null}
        {onDelete ? <SmallButton danger onClick={onDelete}>Supprimer</SmallButton> : null}
      </div>
    </article>
  )
}
