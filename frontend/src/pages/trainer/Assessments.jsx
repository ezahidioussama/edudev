import { useState, useMemo } from 'react'
import {
  Panel,
  SectionHeader,
  EmptyState,
  ActionButton,
  StatusBadge,
  CompactMetric,
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

const emptyAssessmentForm = {
  module_id: '',
  course_id: '',
  title: '',
  format: 'exam',
  scheduled_at: '',
  duration_minutes: 60,
  total_points: 20,
}

export default function Assessments({
  modules,
  courses,
  assessments,
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
  const [assessmentModuleFilter, setAssessmentModuleFilter] = useState('all')
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [assessmentForm, setAssessmentForm] = useState(emptyAssessmentForm)
  const [assessmentFile, setAssessmentFile] = useState(null)

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      return (
        assessmentModuleFilter === 'all' ||
        String(assessment.module_id) === String(assessmentModuleFilter)
      )
    })
  }, [assessments, assessmentModuleFilter])

  const courseOptionsForAssessment = useMemo(() => {
    return courses
      .filter(
        (cours) =>
          !assessmentForm.module_id || String(cours.module_id) === String(assessmentForm.module_id)
      )
      .map((cours) => ({
        value: String(cours.id),
        label: cours.title,
      }))
  }, [courses, assessmentForm.module_id])

  function resetAssessmentForm() {
    setEditingAssessment(null)
    setAssessmentFile(null)
    setAssessmentForm({
      ...emptyAssessmentForm,
      module_id: modules[0]?.id ? String(modules[0].id) : '',
    })
  }

  function beginEditAssessment(assessment) {
    setEditingAssessment(assessment)
    setAssessmentFile(null)
    setAssessmentForm({
      module_id: assessment.module_id ? String(assessment.module_id) : '',
      course_id: assessment.course_id ? String(assessment.course_id) : '',
      title: assessment.title,
      format: assessment.format,
      scheduled_at: assessment.scheduled_at ? assessment.scheduled_at.slice(0, 16) : '',
      duration_minutes: assessment.duration_minutes,
      total_points: assessment.total_points,
    })
    setAssessmentModalOpen(true)
  }

  async function submitAssessment(event) {
    event.preventDefault()

    if (!editingAssessment && !assessmentFile) {
      pushToast('error', 'Veuillez sélectionner un document PDF pour le contrôle.')
      return
    }

    setSaving(true)

    try {
      const body = new FormData()
      if (assessmentForm.module_id) body.append('module_id', assessmentForm.module_id)
      if (assessmentForm.course_id) body.append('course_id', assessmentForm.course_id)
      body.append('title', assessmentForm.title)
      body.append('format', assessmentForm.format)
      body.append('scheduled_at', assessmentForm.scheduled_at || '')
      body.append('duration_minutes', String(assessmentForm.duration_minutes))
      body.append('total_points', String(assessmentForm.total_points))
      if (assessmentFile) body.append('file', assessmentFile)
      if (editingAssessment) body.append('_method', 'PUT')

      await api(editingAssessment ? `/assessments/${editingAssessment.id}` : '/assessments', {
        method: 'POST',
        body,
      })

      pushToast(
        'success',
        editingAssessment ? 'Contrôle modifié avec succès.' : 'Contrôle créé avec succès.'
      )
      setAssessmentModalOpen(false)
      resetAssessmentForm()
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  async function destroyAssessment(id) {
    if (!window.confirm('Supprimer contrôle?')) {
      return
    }

    try {
      await api(`/assessments/${id}`, { method: 'DELETE' })
      pushToast('success', 'contrôle supprimé avec succès.')
      await loadWorkspace({ silent: true })
    } catch (error) {
      pushToast('error', error.message)
    }
  }

  return (
    <>
      <Panel>
        <SectionHeader
          eyebrow="Documents d'évaluation"
          title="Contrôles"
          description="Publiez des contrôles PDF par module, avec aperçu et téléchargement, sans examen en ligne."
          action={
            <button
              type="button"
              onClick={() => {
                resetAssessmentForm()
                setAssessmentModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Nouveau contrôle
            </button>
          }
        />

        <div className="mb-6">
          <SelectBox
            value={assessmentModuleFilter}
            onChange={setAssessmentModuleFilter}
            options={[
              { value: 'all', label: 'Tous les modules' },
              ...modules.map((moduleItem) => ({
                value: String(moduleItem.id),
                label: moduleItem.title,
              })),
            ]}
          />
        </div>

        {filteredAssessments.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredAssessments.map((assessment) => (
              <article
                key={assessment.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                      {assessment.module?.title ?? 'Module'}
                    </p>
                    <h3 className="mt-2 break-words text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                      {assessment.title}
                    </h3>
                    <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
                      {assessment.course?.title ?? 'Contrôle général du module'}
                    </p>
                  </div>
                  <StatusBadge tone={assessment.document ? 'success' : 'warning'}>
                    {assessment.document ? 'PDF prêt' : 'PDF manquant'}
                  </StatusBadge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <CompactMetric
                    label="Date du document"
                    value={assessment.scheduled_at ? formatDate(assessment.scheduled_at) : 'Non planifiée'}
                  />
                  <CompactMetric
                    label="Cours associé"
                    value={assessment.course?.title ?? 'Module uniquement'}
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() =>
                      assessment.document &&
                      openPreview(assessment.document.preview_url, assessment.title)
                    }
                    disabled={!assessment.document}
                  >
                    Prévisualiser le PDF
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      assessment.document &&
                      downloadProtectedFile(assessment.document.download_url, assessment.document.name)
                    }
                    disabled={!assessment.document}
                  >
                    Télécharger
                  </ActionButton>
                  <ActionButton onClick={() => beginEditAssessment(assessment)}>
                    Modifier
                  </ActionButton>
                  <ActionButton tone="danger" onClick={() => destroyAssessment(assessment.id)}>
                    Supprimer
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun contrôle"
            description="Créez un contrôle et associez-le à l'un de vos modules."
          />
        )}
      </Panel>

      <Modal
        open={assessmentModalOpen}
        onClose={() => {
          setAssessmentModalOpen(false)
          resetAssessmentForm()
        }}
        title={editingAssessment ? 'Modifier le contrôle' : 'Créer un contrôle'}
      >
        <form className="space-y-4" onSubmit={submitAssessment}>
          <SelectField
            label="Module"
            value={assessmentForm.module_id}
            onChange={(value) =>
              setAssessmentForm((previous) => ({
                ...previous,
                module_id: value,
                course_id:
                  previous.course_id &&
                  courses.some(
                    (cours) =>
                      String(cours.id) === String(previous.course_id) &&
                      String(cours.module_id) === value
                  )
                    ? previous.course_id
                    : '',
              }))
            }
            options={modules.map((moduleItem) => ({
              value: String(moduleItem.id),
              label: moduleItem.title,
            }))}
          />
          <SelectField
            label="Cours (optionnel)"
            value={assessmentForm.course_id}
            onChange={(value) => setAssessmentForm((previous) => ({ ...previous, course_id: value }))}
            options={[{ value: '', label: 'Contrôle général du module' }, ...courseOptionsForAssessment]}
          />
          <InputField
            label="Titre"
            value={assessmentForm.title}
            onChange={(value) => setAssessmentForm((previous) => ({ ...previous, title: value }))}
          />
          <InputField
            label="Date du contrôle (optionnelle)"
            type="datetime-local"
            value={assessmentForm.scheduled_at}
            onChange={(value) =>
              setAssessmentForm((previous) => ({ ...previous, scheduled_at: value }))
            }
          />
          <FileField
            label={editingAssessment ? 'Remplacer le PDF (optionnel)' : 'Document PDF du contrôle'}
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
              setAssessmentFile(file)
              return true
            }}
          />
          <ModalActions
            saving={saving}
            submitLabel={editingAssessment ? 'Enregistrer le contrôle' : 'Ajouter le contrôle'}
            onAnnuler={() => {
              setAssessmentModalOpen(false)
              resetAssessmentForm()
            }}
          />
        </form>
      </Modal>
    </>
  )
}
