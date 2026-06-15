/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Panel from '../../components/Panel'
import { Select, Multi } from '../../components/FormControls'
import { formatDate } from '../../utils/helpers'

export default function AssignmentsManagement({
  users,
  modules,
  assignmentHistory,
  api,
  loadAdmin,
  showToast,
  setError,
  saving,
  setSaving,
}) {
  const trainers = users.filter((item) => item.role === 'trainer')
  const [form, setForm] = useState({ trainer_id: '', module_ids: [] })

  // Keep form selection in sync if users data reloads
  useEffect(() => {
    if (form.trainer_id) {
      const trainer = trainers.find((item) => String(item.id) === String(form.trainer_id))
      if (trainer) {
        setForm((prev) => ({
          ...prev,
          module_ids: (trainer.modules ?? []).map((module) => String(module.id)),
        }))
      }
    }
  }, [users])

  function selectAssignmentTrainer(trainerId) {
    const trainer = trainers.find((item) => String(item.id) === String(trainerId))
    setForm({
      trainer_id: trainerId,
      module_ids: trainer ? (trainer.modules ?? []).map((module) => String(module.id)) : [],
    })
  }

  async function submitAssignment(event) {
    event.preventDefault()
    if (!form.trainer_id) {
      setError('Veuillez sélectionner un formateur.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await api('/admin/module-assignments', {
        method: 'POST',
        body: JSON.stringify({
          trainer_id: Number(form.trainer_id),
          module_ids: form.module_ids.map(Number),
        }),
      })
      await loadAdmin()
      showToast('Modules affectés sans remplacer les affectations existantes.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeAssignment(trainerId, moduleId) {
    setSaving(true)
    setError('')
    try {
      await api(`/admin/module-assignments/${trainerId}/${moduleId}`, { method: 'DELETE' })
      await loadAdmin()
      showToast('Affectation retirée.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedTrainer = trainers.find((trainer) => String(trainer.id) === String(form.trainer_id))
  const selectedHistory = form.trainer_id
    ? assignmentHistory.filter((item) => String(item.trainer_id) === String(form.trainer_id))
    : assignmentHistory

  return (
    <Panel title="Affectation des modules">
      <form className="grid gap-5" onSubmit={submitAssignment}>
        <Select
          label="Formateur"
          value={form.trainer_id}
          onChange={selectAssignmentTrainer}
          options={[
            ['', 'Sélectionner un formateur'],
            ...trainers.map((trainer) => [String(trainer.id), trainer.name]),
          ]}
        />
        <Multi
          label="Modules à affecter"
          value={form.module_ids}
          onChange={onModules => setForm(prev => ({ ...prev, module_ids: onModules }))}
          options={modules.map((module) => [String(module.id), module.title])}
        />
        <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/70">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Modules actuellement affectés
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTrainer?.modules?.length ? (
              selectedTrainer.modules.map((module) => (
                <span
                  key={module.id}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {module.title}
                  <button
                    type="button"
                    className="cursor-pointer rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 transition-all duration-200 hover:scale-105 hover:bg-rose-100 hover:text-rose-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                    onClick={() => removeAssignment(selectedTrainer.id, module.id)}
                    disabled={saving}
                  >
                    Retirer
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">Aucun module affecté.</span>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="primary-admin-button min-w-56"
            type="submit"
            disabled={saving || !form.trainer_id}
          >
            {saving ? 'Enregistrement...' : 'Ajouter les modules sélectionnés'}
          </button>
        </div>
      </form>
      <div className="mt-6 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/70">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Historique des affectations
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-4">Formateur</th>
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedHistory.length ? (
                selectedHistory.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2 pr-4">{item.trainer?.name ?? '-'}</td>
                    <td className="py-2 pr-4">{item.module?.title ?? '-'}</td>
                    <td className="py-2 pr-4">
                      {item.action === 'removed' ? 'Retiré' : 'Affecté'}
                    </td>
                    <td className="py-2 pr-4">
                      {formatDate(item.assigned_at ?? item.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 text-slate-500" colSpan="4">
                    Aucun historique.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  )
}
