import Panel from '../../components/Panel'
import { Input } from '../../components/FormControls'

export default function Settings({
  settings,
  saving,
  darkMode,
  onChange,
  onSubmit,
  onAction,
  onDarkMode,
}) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <Panel title="Général">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nom de la plateforme"
            value={settings.general.platform_name ?? ''}
            onChange={(value) => onChange('general', 'platform_name', value)}
          />
          <Input
            label="Email support"
            type="email"
            value={settings.general.support_email ?? ''}
            onChange={(value) => onChange('general', 'support_email', value)}
          />
        </div>
      </Panel>

      <Panel title="Apparence">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
            Mode sombre
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) => {
                onDarkMode(event.target.checked)
                onChange('appearance', 'mode', event.target.checked ? 'dark' : 'light')
              }}
            />
          </label>
          <Input
            label="Couleur principale"
            type="color"
            value={settings.appearance.primary_color ?? '#ff7900'}
            onChange={(value) => onChange('appearance', 'primary_color', value)}
          />
        </div>
      </Panel>

      <Panel title="Système">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Taille maximale upload PDF (Mo)"
            type="number"
            value={settings.files.pdf_max_size ?? 20}
            onChange={(value) => onChange('files', 'pdf_max_size', Number(value))}
          />
          <label className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
            Mode maintenance
            <input
              type="checkbox"
              checked={Boolean(settings.maintenance.enabled)}
              onChange={(event) => {
                onChange('maintenance', 'enabled', event.target.checked)
                onAction(event.target.checked ? 'maintenance_on' : 'maintenance_off')
              }}
            />
          </label>
        </div>
      </Panel>

      <div className="flex justify-end">
        <button className="primary-admin-button min-w-56" type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
