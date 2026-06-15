import { useMemo } from 'react'
import {
  Panel,
  SectionHeader,
  TrainerStatCard,
  ModuleSummaryCard,
  EmptyState,
  ActionButton,
  StatusBadge,
  ModulesIcon,
  CourseIcon,
  ClipboardIcon,
  ShieldCheckIcon,
  DocumentIcon,
  SparkIcon,
} from './trainerShared'
import { formatDate } from '../../utils/helpers'

function RecentResourceCard({ item, onPreview }) {
  return (
    <article className="group flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 transition hover:border-orange-200 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700 dark:hover:bg-slate-900">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
          <DocumentIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-slate-950 dark:text-white">{item.title}</p>
            <StatusBadge tone="success">{item.type}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {item.module} - {item.date ? formatDate(item.date) : 'Date indisponible'}
          </p>
        </div>
      </div>
      <ActionButton onClick={onPreview}>Prévisualiser</ActionButton>
    </article>
  )
}

export default function DashboardOverview({
  stats,
  modules,
  courses,
  practicalWorks,
  assessments,
  onPreviewDocument,
}) {
  const recentResources = useMemo(() => {
    return [
      ...courses.map((item) => ({
        id: `course-${item.id}`,
        type: 'Cours PDF',
        title: item.title,
        module: item.module?.title ?? 'Aucun module',
        date: item.created_at,
        document: item.document,
      })),
      ...practicalWorks.map((item) => ({
        id: `tp-${item.id}`,
        type: 'TP PDF',
        title: item.title,
        module: item.module?.title ?? item.course?.module?.title ?? 'Aucun module',
        date: item.created_at,
        document: item.document,
      })),
      ...assessments.map((item) => ({
        id: `assessment-${item.id}`,
        type: 'Contrôle PDF',
        title: item.title,
        module: item.module?.title ?? 'Aucun module',
        date: item.created_at,
        document: item.document,
      })),
    ]
      .filter((item) => item.document)
      .sort((left, right) => new Date(right.date ?? 0).getTime() - new Date(left.date ?? 0).getTime())
      .slice(0, 6)
  }, [courses, practicalWorks, assessments])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <TrainerStatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            accent={
              index === 0
                ? 'from-orange-500 to-amber-400'
                : index === 1
                ? 'from-cyan-500 to-blue-500'
                : index === 2
                ? 'from-emerald-500 to-teal-500'
                : 'from-fuchsia-500 to-rose-500'
            }
            icon={
              index === 0
                ? ModulesIcon
                : index === 1
                ? CourseIcon
                : index === 2
                ? ClipboardIcon
                : ShieldCheckIcon
            }
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Panel>
          <SectionHeader
            eyebrow="Modules"
            title="Modules assignés"
            description="Un seul espace clair pour retrouver vos modules actifs, leurs descriptions et leur volume de contenu."
          />
          {modules.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {modules.slice(0, 6).map((moduleItem) => (
                <ModuleSummaryCard key={moduleItem.id} module={moduleItem} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun module assigné"
              description="Vos modules apparaîtront ici dès qu'une affectation sera disponible."
              icon={ModulesIcon}
            />
          )}
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Bibliothèque"
            title="Ressources récentes"
            description="Vos derniers cours, TP et contrôles PDF publiés, avec accès direct à la prévisualisation."
          />
          {recentResources.length ? (
            <div className="space-y-3">
              {recentResources.map((item) => (
                <RecentResourceCard
                  key={item.id}
                  item={item}
                  onPreview={() => onPreviewDocument(item.document, item.title)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune ressource récente"
              description="Les derniers fichiers PDF publiés s'afficheront ici avec leur module et leur date d'ajout."
              icon={SparkIcon}
            />
          )}
        </Panel>
      </div>
    </section>
  )
}
