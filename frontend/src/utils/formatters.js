export function formatRelativeTime(dateString) {
  if (!dateString) return 'Aucun'
  try {
    let cleanDate = dateString.replace(' ', 'T')
    if (!cleanDate.endsWith('Z')) {
      cleanDate += 'Z'
    }
    const date = new Date(cleanDate)
    const now = new Date()
    const diffMs = now - date
    if (isNaN(diffMs) || diffMs < 0) return 'il y a quelques secondes'
    
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'il y a quelques secondes'
    if (diffMins < 60) return `il y a ${diffMins} min`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `il y a ${diffHours} h`
    
    const diffDays = Math.floor(diffHours / 24)
    return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  } catch {
    return 'Non disponible'
  }
}
