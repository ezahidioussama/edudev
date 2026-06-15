import StatCard from '../../components/StatCard'
import Panel from '../../components/Panel'
import Empty from '../../components/Empty'

function MiniList({ title, items, field }) {
  return (
    <Panel title={title} className="flex-1">
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 text-sm font-semibold text-slate-800 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200"
            >
              {item[field]}
            </div>
          ))
        ) : (
          <Empty label="Aucune activite." />
        )}
      </div>
    </Panel>
  )
}

export default function DashboardOverview({ stats, recentUsers, recentModules, recentCourses }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Utilisateurs" value={stats.users ?? 0} accent="from-orange-500 to-amber-400" />
        <StatCard label="Formateurs" value={stats.trainers ?? 0} accent="from-cyan-500 to-blue-500" />
        <StatCard label="Stagiaires" value={stats.trainees ?? 0} accent="from-emerald-500 to-teal-500" />
        <StatCard label="Modules" value={stats.modules ?? 0} accent="from-fuchsia-500 to-rose-500" />
        <StatCard label="Cours" value={stats.courses ?? 0} accent="from-indigo-500 to-violet-500" />
        <StatCard label="Total TP" value={stats.practicalWorks ?? 0} accent="from-lime-500 to-emerald-500" />
        <StatCard label="Contrôles" value={stats.assessments ?? 0} accent="from-sky-500 to-cyan-500" />
        <StatCard label="Comptes inactifs" value={stats.inactiveUsers ?? 0} accent="from-rose-500 to-red-500" />
      </div>
      <Panel title="Activité récente">
        <div className="grid gap-4 lg:grid-cols-3">
          <MiniList title="Utilisateurs" items={recentUsers} field="name" />
          <MiniList title="Modules" items={recentModules} field="title" />
          <MiniList title="Cours" items={recentCourses} field="title" />
        </div>
      </Panel>
    </section>
  )
}
