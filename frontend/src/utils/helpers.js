export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function resolveApiUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const apiBase = import.meta.env.VITE_API_URL || '/api'
  const base = apiBase.replace('/api', '')
  return base + (url.startsWith('/') ? url : '/' + url)
}

export function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function roleLabel(role) {
  return role === 'trainer' ? 'Formateur' : role === 'trainee' ? 'Stagiaire' : 'Admin'
}
