import { useState, useMemo } from 'react'
import {
  Panel,
  SectionHeader,
  EmptyState,
  SkeletonBlock,
  CompactMetric,
  ModulesIcon,
  MiniPill,
} from './trainerShared'
import { classNames } from '../../utils/helpers'

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

export default function Modules({ modules, api, pushToast, setActiveSection }) {
  const [moduleSearch, setModuleSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [selectedModuleDetail, setSelectedModuleDetail] = useState(null)
  const [moduleLoading, setModuleLoading] = useState(false)

  const filteredModules = useMemo(() => {
    return modules.filter((moduleItem) => {
      const matchesFilter =
        moduleFilter === 'all' ||
        (moduleFilter === 'with_courses' && Number(moduleItem.courses_count) > 0) ||
        (moduleFilter === 'with_tp' && Number(moduleItem.practical_works_count) > 0) ||
        (moduleFilter === 'with_assessments' && Number(moduleItem.assessments_count) > 0)

      if (!moduleSearch) {
        return matchesFilter
      }

      const needle = moduleSearch.toLowerCase()

      const matchesSearch =
        moduleItem.title.toLowerCase().includes(needle) ||
        (moduleItem.description ?? '').toLowerCase().includes(needle)

      return matchesFilter && matchesSearch
    })
  }, [modules, moduleSearch, moduleFilter])

  async function openModuleDetail(moduleId) {
    setSelectedModuleId(moduleId)
    setModuleLoading(true)

    try {
      const detail = await api(`/trainer/modules/${moduleId}`)
      setSelectedModuleDetail(detail)
    } catch (error) {
      pushToast('error', error.message)
    } finally {
      setModuleLoading(false)
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
      <Panel>
        <SectionHeader
          eyebrow="Catalogue assigné"
          title="Vos modules"
          description="Seuls les modules qui vous sont assignés apparaissent ici, avec un accès rapide aux ressources liées."
        />

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <SearchField
              value={moduleSearch}
              onChange={setModuleSearch}
              placeholder="Rechercher un module..."
            />
            <SelectBox
              value={moduleFilter}
              onChange={setModuleFilter}
              options={[
                { value: 'all', label: 'Tous les modules' },
                { value: 'with_courses', label: 'Avec cours' },
                { value: 'with_tp', label: 'Avec TP' },
                { value: 'with_assessments', label: 'Avec contrôles' },
              ]}
            />
          </div>
        </div>

        {filteredModules.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredModules.map((moduleItem) => (
              <button
                key={moduleItem.id}
                type="button"
                onClick={() => openModuleDetail(moduleItem.id)}
                className={classNames(
                  'group rounded-3xl border p-5 text-left transition',
                  selectedModuleId === moduleItem.id
                    ? 'border-orange-300 bg-orange-50/80 shadow-lg shadow-orange-100 dark:border-orange-500/40 dark:bg-orange-500/10 dark:shadow-none'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {moduleItem.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {moduleItem.description || 'Aucune description disponible pour ce module.'}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                    {moduleItem.courses_count}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <MiniPill label={`${moduleItem.practical_works_count} TP`} />
                  <MiniPill label={`${moduleItem.assessments_count} contrôles`} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title={modules.length ? 'Aucun module trouvé' : 'Aucun module assigné'}
            description={
              modules.length
                ? 'Essayez un autre mot-clé pour retrouver un module.'
                : "Quand l'administration vous assignera un module, il apparaîtra ici avec ses cours et ressources."
            }
            icon={ModulesIcon}
          />
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Détails du module"
          title={selectedModuleDetail?.title ?? 'Sélectionnez un module'}
          description={
            selectedModuleDetail?.description ??
            'Ouvrez un module pour consulter ses cours, TP et contrôles dans un panneau dédié.'
          }
        />

        {moduleLoading ? (
          <div className="space-y-3">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
          </div>
        ) : selectedModuleDetail ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <CompactMetric label="Cours" value={selectedModuleDetail.courses_count} />
              <CompactMetric label="TP" value={selectedModuleDetail.practical_works_count} />
              <CompactMetric label="Contrôles" value={selectedModuleDetail.assessments_count} />
            </div>

            <div className="space-y-4">
              {selectedModuleDetail.courses?.map((cours) => (
                <article
                  key={cours.id}
                  className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {cours.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {cours.practical_works_count} TP - {cours.assessments_count} contrôles
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection('courses')}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:text-slate-200"
                    >
                      Ouvrir le cours
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Panneau de détail du module"
            description="Cliquez sur un module pour voir ses ressources internes."
          />
        )}
      </Panel>
    </section>
  )
}
