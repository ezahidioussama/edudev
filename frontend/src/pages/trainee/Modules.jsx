import {
  Panel,
  SectionHeader,
  ResourceToolbar,
  EmptyState,
  ModulesIcon,
  MiniPill
} from './traineeShared'

function ModuleCard({ module, resources, onOpen }) {
  const moduleResources = resources.filter(
    (item) => String(item.module_id ?? item.module?.id ?? item.course?.module_id) === String(module.id)
  )
  const courses = moduleResources.filter((item) => item.resourceType === 'courses').length
  const practicalWorks = moduleResources.filter((item) => item.resourceType === 'tp').length
  const assessments = moduleResources.filter((item) => item.resourceType === 'controles').length

  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-slate-950 dark:text-white">{module.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {module.description || 'Aucune description disponible.'}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-orange-50 group-hover:text-orange-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-300">
          <ModulesIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <MiniPill label={`${courses} cours`} />
        <MiniPill label={`${practicalWorks} TP`} />
        <MiniPill label={`${assessments} contrôles`} />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
      >
        Voir les ressources
      </button>
    </article>
  )
}

export default function Modules({
  filters,
  moduleOptions,
  trainerOptions,
  onFilter,
  filteredModules,
  resources,
  updateFilter,
  setActive
}) {
  return (
    <Panel>
      <SectionHeader
        eyebrow="Modules"
        title="Modules disponibles"
        description="Consultez les modules auxquels vous avez accès et ouvrez leurs ressources pédagogiques."
      />
      <ResourceToolbar
        filters={filters}
        moduleOptions={moduleOptions}
        trainerOptions={trainerOptions}
        onFilter={onFilter}
        hideType
        hideSort
      />
      {filteredModules.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredModules.map((moduleItem) => (
            <ModuleCard
              key={moduleItem.id}
              module={moduleItem}
              resources={resources}
              onOpen={() => {
                updateFilter('module', String(moduleItem.id))
                setActive('courses')
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun module disponible"
          description="Vos modules apparaîtront ici dès qu'ils seront associés à vos cours."
          icon={ModulesIcon}
        />
      )}
    </Panel>
  )
}
