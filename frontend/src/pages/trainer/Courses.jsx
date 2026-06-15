import { useState, useMemo } from 'react'
import {
  Panel,
  SectionHeader,
  EmptyState,
  ActionButton,
  StatusBadge,
  MiniPill,
} from './trainerShared'
import Modal from '../../components/Modal'
import { classNames } from '../../utils/helpers'

// Internal fields
function SearchField({ value, onChange, placeholder }) {
  return (
    <label className="relative min-w-[240px] flex-1">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15"
      />
    </label>
  )
}

function SelectBox({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15"
    >
      {options.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/15"
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

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

function FileField({ label, helper, accept, onChange }) {
  const [fileName, setFileName] = useState('')

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null
          const success = onChange(file)
          if (success !== false) {
            setFileName(file?.name ?? '')
          } else {
            event.target.value = ''
            setFileName('')
          }
        }}
        className="block w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-orange-300 hover:file:bg-orange-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
        {fileName ? (
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            Fichier sélectionné : {fileName}
          </span>
        ) : null}
      </div>
    </label>
  )
}

function ModalActions({ saving, submitLabel, onAnnuler }) {
  return (
    <div className="sticky bottom-0 -mx-1 mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-white/95 px-1 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <button
        type="button"
        onClick={onAnnuler}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-200"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? null : (
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        {saving ? 'Enregistrement...' : submitLabel}
      </button>
    </div>
  )
}

function TogglePill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'rounded-2xl px-4 py-2 text-sm font-semibold transition',
        active
          ? 'bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white'
          : 'text-slate-500 dark:text-slate-400'
      )}
    >
      {children}
    </button>
  )
}

function CourseCard({ cours, onPreview, onDownload, onEdit, onDelete }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
            {cours.module?.title ?? 'Aucun module'}
          </p>
          <h3 className="mt-2 break-words text-lg font-semibold leading-tight text-slate-900 dark:text-white">
            {cours.title}
          </h3>
          <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
            {cours.description || 'Aucune description renseignée.'}
          </p>
        </div>
        <StatusBadge tone={cours.document ? 'success' : 'warning'}>
          {cours.document ? 'PDF prêt' : 'PDF manquant'}
        </StatusBadge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <MiniPill label={cours.level} />
        <MiniPill label={`${cours.duration_hours} heures`} />
        <MiniPill label={`${cours.practical_works_count} TP`} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <ActionButton onClick={onPreview} disabled={!cours.document}>
          Prévisualiser le PDF
        </ActionButton>
        <ActionButton onClick={onDownload} disabled={!cours.document}>
          Télécharger
        </ActionButton>
        <ActionButton onClick={onEdit}>Modifier</ActionButton>
        <ActionButton tone="danger" onClick={onDelete}>
          Supprimer
        </ActionButton>
      </div>
    </article>
  )
}

function CourseTable({ courses, onPreview, onDownload, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-950">
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Cours</th>
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium">Niveau</th>
              <th className="px-4 py-3 font-medium">PDF</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-900 dark:bg-slate-950/60">
            {courses.map((cours) => (
              <tr key={cours.id}>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{cours.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {cours.duration_hours} heures
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                  {cours.module?.title ?? '-'}
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{cours.level}</td>
                <td className="px-4 py-4">
                  <StatusBadge tone={cours.document ? 'success' : 'warning'}>
                    {cours.document ? 'Prêt' : 'Manquant'}
                  </StatusBadge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => onPreview(cours)} disabled={!cours.document}>
                      Prévisualiser
                    </ActionButton>
                    <ActionButton onClick={() => onDownload(cours)} disabled={!cours.document}>
                      Télécharger
                    </ActionButton>
                    <ActionButton onClick={() => onEdit(cours)}>Modifier</ActionButton>
                    <ActionButton tone="danger" onClick={() => onDelete(cours)}>
                      Supprimer
                    </ActionButton>
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

const emptyCourseForm = {
  module_id: '',
  title: '',
  description: '',
  level: 'beginner',
  duration_hours: 12,
}

export default function Courses({
  modules,
  courses,
  api,
  pushToast,
  loadWorkspace,
  openPreview,
  downloadProtectedFile,
  saving,
  setSaving,
  maxPdfSizeMo,
  maxPdfSizeBytes,
}) {
  const [courseSearch, setCourseSearch] = useState('')
  const [courseModuleFilter, setCourseModuleFilter] = useState('all')
  const [courseView, setCourseView] = useState('cards')
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseForm, setCourseForm] = useState(emptyCourseForm)
  const [courseFile, setCourseFile] = useState(null)

  const filteredCourses = useMemo(() => {
    return courses.filter((cours) => {
      const matchesSearch =
        !courseSearch ||
        cours.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        (cours.description ?? '').toLowerCase().includes(courseSearch.toLowerCase())
      const matchesModule =
        courseModuleFilter === 'all' || String(cours.module_id) === String(courseModuleFilter)

      return matchesSearch && matchesModule
    })
  }, [courses, courseSearch, courseModuleFilter])

  function resetCourseForm() {
    setEditingCourse(null)
    setCourseFile(null)
    setCourseForm({
      ...emptyCourseForm,
      module_id: modules[0]?.id ? String(modules[0].id) : '',
    })
  }

  function beginEditCourse(cours) {
    setEditingCourse(cours)
    setCourseFile(null)
    setCourseForm({
      module_id: String(cours.module_id),
      title: cours.title,
      description: cours.description ?? '',
      level: cours.level,
      duration_hours: cours.duration_hours,
    })
    setCourseModalOpen(true)
  }

  async function submitCourse(event) {
    event.preventDefault()

    if (!editingCourse && !courseFile) {
      pushToast('error', 'Veuillez sélectionner un document PDF pour le cours.')
      return
    }

    setSaving(true)

    try {
      const body = new FormData()
      body.append('module_id', courseForm.module_id)
      body.append('title', courseForm.title)
      body.append('description', courseForm.description)
      body.append('level', courseForm.level)
      body.append('duration_hours', String(courseForm.duration_hours))

      if (courseFile) {
        body.append('file', courseFile)
      }

      if (editingCourse) {
        body.append('_method', 'PUT')
        await api(`/courses/${editingCourse.id}`, { method: 'POST', body })
      } else {
        await api('/courses', { method: 'POST', body })
      }

      pushToast(
        'success',
        editingCourse ? 'Cours modifié avec succès.' : 'Cours PDF publié avec succès.'
      )
      setCourseModalOpen(false)
      resetCourseForm()
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  async function destroyCourse(cours) {
    if (!window.confirm('Supprimer cours?')) {
      return
    }

    try {
      await api(`/courses/${cours.id}`, { method: 'DELETE' })
      pushToast('success', 'cours supprimé avec succès.')
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    }
  }

  return (
    <>
      <Panel>
        <SectionHeader
          eyebrow="Publication des cours"
          title="Cours PDF"
          description="Publiez des documents PDF sécurisés, prévisualisez-les et organisez votre catalogue par module."
          action={
            <button
              type="button"
              onClick={() => {
                resetCourseForm()
                setCourseModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Publier un cours
            </button>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <SearchField
            value={courseSearch}
            onChange={setCourseSearch}
            placeholder="Rechercher un cours..."
          />
          <SelectBox
            value={courseModuleFilter}
            onChange={setCourseModuleFilter}
            options={[
              { value: 'all', label: 'Tous les modules' },
              ...modules.map((moduleItem) => ({
                value: String(moduleItem.id),
                label: moduleItem.title,
              })),
            ]}
          />
          <div className="ml-auto inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
            <TogglePill active={courseView === 'cards'} onClick={() => setCourseView('cards')}>
              Cartes
            </TogglePill>
            <TogglePill active={courseView === 'table'} onClick={() => setCourseView('table')}>
              Tableau
            </TogglePill>
          </div>
        </div>

        {filteredCourses.length ? (
          courseView === 'cards' ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredCourses.map((cours) => (
                <CourseCard
                  key={cours.id}
                  cours={cours}
                  onPreview={() =>
                    cours.document && openPreview(cours.document.preview_url, cours.title)
                  }
                  onDownload={() =>
                    cours.document &&
                    downloadProtectedFile(cours.document.download_url, cours.document.name)
                  }
                  onEdit={() => beginEditCourse(cours)}
                  onDelete={() => destroyCourse(cours)}
                />
              ))}
            </div>
          ) : (
            <CourseTable
              courses={filteredCourses}
              onPreview={(cours) =>
                cours.document && openPreview(cours.document.preview_url, cours.title)
              }
              onDownload={(cours) =>
                cours.document &&
                downloadProtectedFile(cours.document.download_url, cours.document.name)
              }
              onEdit={beginEditCourse}
              onDelete={destroyCourse}
            />
          )
        ) : (
          <EmptyState
            title="Aucun cours trouvé"
            description="Essayez une autre recherche, changez de module ou publiez un nouveau cours PDF."
          />
        )}
      </Panel>

      <Modal
        open={courseModalOpen}
        onClose={() => {
          setCourseModalOpen(false)
          resetCourseForm()
        }}
        title={editingCourse ? 'Modifier cours' : 'Publier un nouveau cours'}
      >
        <form className="space-y-4" onSubmit={submitCourse}>
          <SelectField
            label="Module"
            value={courseForm.module_id}
            onChange={(value) => setCourseForm((previous) => ({ ...previous, module_id: value }))}
            options={modules.map((moduleItem) => ({
              value: String(moduleItem.id),
              label: moduleItem.title,
            }))}
          />
          <InputField
            label="Titre"
            value={courseForm.title}
            onChange={(value) => setCourseForm((previous) => ({ ...previous, title: value }))}
            placeholder="Concepts avances d'API Laravel"
          />
          <TextAreaField
            label="Description"
            value={courseForm.description}
            onChange={(value) =>
              setCourseForm((previous) => ({ ...previous, description: value }))
            }
            placeholder="Ajoutez une presentation claire de cette ressource PDF."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Niveau"
              value={courseForm.level}
              onChange={(value) => setCourseForm((previous) => ({ ...previous, level: value }))}
              options={[
                { value: 'beginner', label: 'Débutant' },
                { value: 'intermediate', label: 'Intermédiaire' },
                { value: 'advanced', label: 'Avancé' },
              ]}
            />
            <InputField
              label="Durée (heures)"
              type="number"
              value={courseForm.duration_hours}
              onChange={(value) =>
                setCourseForm((previous) => ({ ...previous, duration_hours: value }))
              }
            />
          </div>
          <FileField
            label={editingCourse ? 'Remplacer le PDF (optionnel)' : 'Document PDF'}
            helper={`PDF uniquement - max ${maxPdfSizeMo} Mo`}
            accept="application/pdf"
            onChange={(file) => {
              if (file) {
                if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                  pushToast('error', 'Le fichier doit être au format PDF.')
                  return false
                }
                if (file.size > maxPdfSizeBytes) {
                  pushToast('error', `Le fichier ne doit pas dépasser ${maxPdfSizeMo} Mo.`)
                  return false
                }
              }
              setCourseFile(file)
              return true
            }}
          />
          <ModalActions
            saving={saving}
            submitLabel={
              editingCourse ? 'Enregistrer les modifications' : 'Ajouter / Publier le cours PDF'
            }
            onAnnuler={() => {
              setCourseModalOpen(false)
              resetCourseForm()
            }}
          />
        </form>
      </Modal>
    </>
  )
}
