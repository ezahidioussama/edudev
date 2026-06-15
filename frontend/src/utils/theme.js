export function getUserThemePreference(user) {
  const key = getUserThemePreferenceKey(user)
  if (!key) return null

  const value = window.localStorage.getItem(key)
  return value === 'dark' || value === 'light' ? value : null
}

export function setUserThemePreference(user, mode) {
  const key = getUserThemePreferenceKey(user)
  if (!key) return

  window.localStorage.setItem(key, mode === 'dark' ? 'dark' : 'light')
}

export function getEffectiveDarkMode(settings, user = null) {
  const userPreference = getUserThemePreference(user)
  if (userPreference) {
    return userPreference === 'dark'
  }

  return getPlatformDarkMode(settings)
}

export function getPlatformDarkMode(settings) {
  const mode = settings?.appearance?.mode ?? 'light'

  if (mode === 'dark') return true
  if (mode === 'system') return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false

  return false
}

function getUserThemePreferenceKey(user) {
  if (!user?.role) return null

  const identity = user.id ?? user.email
  if (!identity) return null

  return `edudev.theme.${user.role}.${identity}`
}
