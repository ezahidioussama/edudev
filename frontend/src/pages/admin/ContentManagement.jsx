/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from 'react'
import Modal from '../../components/Modal'
import Panel from '../../components/Panel'
import Badge from '../../components/Badge'
import Empty from '../../components/Empty'
import { SmallButton } from '../../components/FormControls'
import { client as axiosClient } from '../../services/apiClient'
import { resolveUrl } from '../../utils/resolveUrl'
import { formatDate, classNames } from '../../utils/helpers'

export default function ContentManagement({
  courses,
  practicalWorks,
  assessments,
  modules,
  users,
  api,
  loadAdmin,
  showToast,
  setError,
}) {
  const trainers = users.filter((item) => item.role === 'trainer')
  
  const [contentType, setContentType] = useState('courses')
  const [contentQuery, setContentQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [trainerFilter, setTrainerFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    setPage(1)
  }, [contentType, contentQuery, moduleFilter, trainerFilter])

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url)
    }
  }, [preview])

  const contentItems = useMemo(() => {
    const source =
      contentType === 'courses'
        ? courses
        : contentType === 'tp'
        ? practicalWorks
        : assessments
    const search = contentQuery.trim().toLowerCase()

    return source.filter((item) => {
      const moduleId = item.module_id ?? item.module?.id ?? item.course?.module_id
      const trainerId = item.trainer_id ?? item.trainer?.id
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        (item.module?.title ?? item.course?.module?.title ?? '').toLowerCase().includes(search)
      const matchesModule = moduleFilter === 'all' || String(moduleId) === String(moduleFilter)
      const matchesTrainer = trainerFilter === 'all' || String(trainerId) === String(trainerFilter)
      return matchesSearch && matchesModule && matchesTrainer
    })
  }, [contentType, contentQuery, courses, practicalWorks, assessments, moduleFilter, trainerFilter])

  const pagedContent = useMemo(
    () => contentItems.slice((page - 1) * 8, page * 8),
    [contentItems, page]
  )
  const totalPages = Math.max(1, Math.ceil(contentItems.length / 8))

  function contentDeletePath(type, item) {
    if (type === 'tp') return `/practical-works/${item.id}`
    if (type === 'controles') return `/assessments/${item.id}`
    return `/courses/${item.id}`
  }

  async function removeContent(item) {
    if (!window.confirm('Confirmer la suppression ?')) return
    setError('')
    const path = contentDeletePath(contentType, item)
    try {
      await api(path, { method: 'DELETE' })
      await loadAdmin()
      showToast('Contenu supprimé.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function openPdf(document, title) {
    if (!document) return
    setError('')
    try {
      const url = resolveUrl(document.preview_url)
      const response = await axiosClient.get(url, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf' },
      })
      const urlBlob = URL.createObjectURL(response.data)
      if (preview?.url) URL.revokeObjectURL(preview.url)
      setPreview({ title, url: urlBlob })
    } catch (requestError) {
      setError("Impossible d'ouvrir ce PDF.")
    }
  }

  async function downloadPdf(file) {
    if (!file) return
    setError('')
    try {
      const url = resolveUrl(file.download_url)
      const response = await axiosClient.get(url, {
        responseType: 'blob',
      })
      const objectUrl = URL.createObjectURL(response.data)
      const anchor = window.document.createElement('a')
      anchor.href = objectUrl
      anchor.download = file.name
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch (requestError) {
      setError('Téléchargement impossible.')
    }
  }

  return (
    <>
      <Panel title="Gestion du contenu">
        <ContentToolbar
          contentType={contentType}
          setContentType={setContentType}
          query={contentQuery}
          setQuery={setContentQuery}
          moduleFilter={moduleFilter}
          setModuleFilter={setModuleFilter}
          trainerFilter={trainerFilter}
          setTrainerFilter={setTrainerFilter}
          modules={modules}
          trainers={trainers}
        />
        <ContentTable
          type={contentType}
          items={pagedContent}
          onPreview={(item) => openPdf(item.document, item.title)}
          onDownload={(item) => downloadPdf(item.document)}
          onDelete={removeContent}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={setPage}
          total={contentItems.length}
        />
      </Panel>

      <Modal
        open={Boolean(preview)}
        title={preview?.title ?? 'PDF'}
        onClose={() => setPreview(null)}
        wide
      >
        {preview ? (
          <iframe
            title={preview.title}
            src={preview.url}
            className="h-[72vh] w-full rounded-3xl border border-slate-200 dark:border-slate-800"
          ></iframe>
        ) : null}
      </Modal>
    </>
  )
}

function ContentToolbar({
  contentType,
  setContentType,
  query,
  setQuery,
  moduleFilter,
  setModuleFilter,
  trainerFilter,
  setTrainerFilter,
  modules,
  trainers,
}) {
  return (
    <div className="mb-5 grid gap-3 xl:grid-cols-[auto,1fr,220px,220px]">
      <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-950">
        {[
          ['courses', 'Cours'],
          ['tp', 'TP'],
          ['controles', 'Contrôles'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setContentType(key)}
            className={classNames(
              'rounded-xl px-4 py-2 text-sm font-bold transition',
              contentType === key
                ? 'bg-white text-slate-950 shadow dark:bg-slate-800 dark:text-white'
                : 'text-slate-500'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher un contenu..."
      />
      <select
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={moduleFilter}
        onChange={(event) => setModuleFilter(event.target.value)}
      >
        <option value="all">Tous les modules</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.title}
          </option>
        ))}
      </select>
      <select
        className="admin-input dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={trainerFilter}
        onChange={(event) => setTrainerFilter(event.target.value)}
      >
        <option value="all">Tous les formateurs</option>
        {trainers.map((trainer) => (
          <option key={trainer.id} value={trainer.id}>
            {trainer.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function ContentTable({ type, items, onPreview, onDownload, onDelete }) {
  if (!items.length) return <Empty label="Aucun contenu." />

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Formateur</th>
              <th className="px-4 py-3">Fichier PDF</th>
              <th className="px-4 py-3">
                {type === 'tp' ? 'Échéance' : type === 'controles' ? 'Date' : "Date d'ajout"}
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/70">
                <td className="px-4 py-4 font-bold">{item.title}</td>
                <td className="px-4 py-4">
                  {item.module?.title ?? item.course?.module?.title ?? '-'}
                </td>
                <td className="px-4 py-4">{item.trainer?.name ?? '-'}</td>
                <td className="px-4 py-4">
                  {item.document ? (
                    <Badge>{item.document.name}</Badge>
                  ) : (
                    <Badge tone="danger">PDF manquant</Badge>
                  )}
                </td>
                <td className="px-4 py-4">
                  {formatDate(
                    type === 'tp' ? item.due_at : type === 'controles' ? item.scheduled_at : item.created_at
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <SmallButton onClick={() => onPreview(item)} disabled={!item.document}>
                      Prévisualiser
                    </SmallButton>
                    <SmallButton onClick={() => onDownload(item)} disabled={!item.document}>
                      Télécharger
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

function Pagination({ page, totalPages, onPage, total }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
      <p>{total} éléments</p>
      <div className="flex gap-2">
        <SmallButton onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}>
          Précédent
        </SmallButton>
        <span className="rounded-2xl bg-slate-100 px-4 py-2 font-bold dark:bg-slate-950">
          {page} / {totalPages}
        </span>
        <SmallButton onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Suivant
        </SmallButton>
      </div>
    </div>
  )
}
