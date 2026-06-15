import {
  Panel,
  SectionHeader,
  ResourceToolbar,
  ResourceGrid
} from './traineeShared'

export default function Resources({
  active,
  filters,
  moduleOptions,
  trainerOptions,
  onFilter,
  pageResources,
  onPreview,
  onDownload
}) {
  const title =
    active === 'courses'
      ? 'Cours disponibles'
      : active === 'tp'
      ? 'TP disponibles'
      : 'Contrôles disponibles'

  return (
    <Panel>
      <SectionHeader
        eyebrow="Ressources PDF"
        title={title}
        description="Recherchez par module, formateur ou titre, puis prévisualisez ou téléchargez les PDF."
      />
      <ResourceToolbar
        filters={{ ...filters, type: active }}
        moduleOptions={moduleOptions}
        trainerOptions={trainerOptions}
        onFilter={onFilter}
      />
      <ResourceGrid
        resources={pageResources}
        emptyTitle="Aucun PDF trouvé"
        emptyDescription="Essayez une recherche plus courte ou changez de module ou de formateur."
        onPreview={onPreview}
        onDownload={onDownload}
      />
    </Panel>
  )
}
