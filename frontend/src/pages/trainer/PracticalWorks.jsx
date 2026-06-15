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
import { formatDate, classNames } from '../../utils/helpers'

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

function isEcheanceNear(date) {
  if (!date) {
    return false
  }
  const diff = new Date(date).getTime() - Date.now()
  return diff > 0 && diff < 1000 * 60 * 60 * 48
}

const emptyPracticalForm = {
  course_id: '',
  title: '',
  instructions: '',
  due_at: '',
}

export default function PracticalWorks({
  courses,
  practicalWorks,
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
  const [practicalModalOpen, setPracticalModalOpen] = useState(false)
  const [editingPractical, setEditingPractical] = useState(null)
  const [practicalForm, setPracticalForm] = useState(emptyPracticalForm)
  const [practicalFile, setPracticalFile] = useState(null)

  const courseOptions = useMemo(
    () =>
      courses.map((cours) => ({
        value: String(cours.id),
        label: `${cours.title} - ${cours.module?.title ?? 'Aucun module'}`,
      })),
    [courses]
  )

  function resetPracticalForm() {
    setEditingPractical(null)
    setPracticalFile(null)
    setPracticalForm({
      ...emptyPracticalForm,
      course_id: courses[0]?.id ? String(courses[0].id) : '',
    })
  }

  function beginEditPractical(practicalWork) {
    setEditingPractical(practicalWork)
    setPracticalFile(null)
    setPracticalForm({
      course_id: String(practicalWork.course_id),
      title: practicalWork.title,
      instructions: practicalWork.instructions,
      due_at: practicalWork.due_at ? practicalWork.due_at.slice(0, 16) : '',
    })
    setPracticalModalOpen(true)
  }

  async function submitPractical(event) {
    event.preventDefault()

    if (!editingPractical && !practicalFile) {
      pushToast('error', 'Veuillez sélectionner un document PDF pour le TP.')
      return
    }

    setSaving(true)

    try {
      const body = new FormData()
      body.append('course_id', practicalForm.course_id)
      body.append('title', practicalForm.title)
      body.append('instructions', practicalForm.instructions || '')
      body.append('due_at', practicalForm.due_at || '')
      if (practicalFile) body.append('file', practicalFile)
      if (editingPractical) body.append('_method', 'PUT')

      await api(editingPractical ? `/practical-works/${editingPractical.id}` : '/practical-works', {
        method: 'POST',
        body,
      })

      pushToast('success', editingPractical ? 'TP modifié avec succès.' : 'TP créé avec succès.')
      setPracticalModalOpen(false)
      resetPracticalForm()
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  async function destroyPractical(id) {
    if (!window.confirm('Supprimer TP?')) {
      return
    }

    try {
      await api(`/practical-works/${id}`, { method: 'DELETE' })
      pushToast('success', 'TP supprimé avec succès.')
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    }
  }

  return (
    <>
      <Panel>
        <SectionHeader
          eyebrow="Travaux pratiques"
          title="Gestion des TP"
          description="Ajoutez des TP PDF, associez-les à vos cours et organisez vos ressources pédagogiques."
          action={
            <button
              type="button"
              onClick={() => {
                resetPracticalForm()
                setPracticalModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Nouveau TP
            </button>
          }
        />

        {practicalWorks.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {practicalWorks.map((practicalWork) => (
              <article
                key={practicalWork.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                      {practicalWork.module?.title ?? practicalWork.course?.module?.title ?? 'Module'}
                    </p>
                    <h3 className="mt-2 break-words text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                      {practicalWork.title}
                    </h3>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {practicalWork.instructions}
                    </p>
                  </div>
                  <StatusBadge tone={isEcheanceNear(practicalWork.due_at) ? 'warning' : 'neutral'}>
                    {practicalWork.due_at ? formatDate(practicalWork.due_at) : 'Aucune échéance'}
                  </StatusBadge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <MiniPill label={practicalWork.course?.title ?? 'Aucun cours'} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() =>
                      practicalWork.document &&
                      openPreview(practicalWork.document.preview_url, practicalWork.title)
                    }
                    disabled={!practicalWork.document}
                  >
                    Prévisualiser le PDF
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      practicalWork.document &&
                      downloadProtectedFile(practicalWork.document.download_url, practicalWork.document.name)
                    }
                    disabled={!practicalWork.document}
                  >
                    Télécharger
                  </ActionButton>
                  <ActionButton onClick={() => beginEditPractical(practicalWork)}>
                    Modifier
                  </ActionButton>
                  <ActionButton tone="danger" onClick={() => destroyPractical(practicalWork.id)}>
                    Supprimer
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun TP créé"
            description="Ajoutez votre premier TP PDF pour le rendre disponible dans votre espace de formation."
          />
        )}
      </Panel>

      <Modal
        open={practicalModalOpen}
        onClose={() => {
          setPracticalModalOpen(false)
          resetPracticalForm()
        }}
        title={editingPractical ? 'Modifier TP' : 'Créer un TP'}
      >
        <form className="space-y-4" onSubmit={submitPractical}>
          <SelectField
            label="Cours"
            value={practicalForm.course_id}
            onChange={(value) => setPracticalForm((previous) => ({ ...previous, course_id: value }))}
            options={courseOptions}
          />
          <InputField
            label="Titre"
            value={practicalForm.title}
            onChange={(value) => setPracticalForm((previous) => ({ ...previous, title: value }))}
            placeholder="Ressources du TP API"
          />
          <TextAreaField
            label="Description"
            value={practicalForm.instructions}
            onChange={(value) =>
              setPracticalForm((previous) => ({ ...previous, instructions: value }))
            }
            placeholder="Décrivez clairement le contenu du TP PDF et les attentes pédagogiques."
          />
          <InputField
            label="Échéance (optionnelle)"
            type="datetime-local"
            value={practicalForm.due_at}
            onChange={(value) => setPracticalForm((previous) => ({ ...previous, due_at: value }))}
          />
          <FileField
            label={editingPractical ? 'Remplacer le PDF (optionnel)' : 'Document PDF du TP'}
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
              setPracticalFile(file)
              return true
            }}
          />
          <ModalActions
            saving={saving}
            submitLabel={editingPractical ? 'Enregistrer le TP' : 'Ajouter le TP'}
            onAnnuler={() => {
              setPracticalModalOpen(false)
              resetPracticalForm()
            }}
          />
        </form>
      </Modal>
    </>
  )
}
