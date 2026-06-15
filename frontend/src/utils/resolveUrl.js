export function resolveUrl(url) {
  if (!url) return ''
  if (url.startsWith('/api')) {
    return url.replace('/api', '')
  }
  return url
}
