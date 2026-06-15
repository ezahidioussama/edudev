import {
  Panel,
  SectionHeader,
  DashboardHero,
  ResourceToolbar,
  ResourceGrid,
} from './traineeShared'
import { classNames } from '../../utils/helpers'

function StatCard({ label, value, accent, icon: Icon }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/45 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={classNames('h-1.5 flex-1 rounded-full bg-gradient-to-r', accent)}></div>
        <div className={classNames('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105', accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold text-slate-950 dark:text-white">{value}</strong>
    </article>
  )
}

export default function DashboardOverview({
  stats,
  user,
  modules,
  resources,
  filteredResources,
  filters,
  moduleOptions,
  trainerOptions,
  updateFilter,
  openPdf,
  downloadPdf,
}) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <DashboardHero user={user} modules={modules} resources={resources} />

      <Panel>
        <SectionHeader
          eyebrow="Bibliothèque"
          title="Ressources récentes"
          description="Les derniers contenus PDF disponibles dans vos modules."
        />
        <ResourceToolbar
          filters={filters}
          moduleOptions={moduleOptions}
          trainerOptions={trainerOptions}
          onFilter={updateFilter}
        />
        <ResourceGrid
          resources={filteredResources.slice(0, 6)}
          emptyTitle="Aucune ressource trouvée"
          emptyDescription="Ajustez votre recherche ou vos filtres pour retrouver un document."
          onPreview={openPdf}
          onDownload={downloadPdf}
        />
      </Panel>
    </section>
  )
}
