import { classNames, resolveApiUrl } from '../utils/helpers'

export default function Avatar({ user, size = 'h-20 w-20' }) {
  if (user?.avatar_url) {
    return (
      <img
        src={resolveApiUrl(user.avatar_url)}
        alt={user.name ?? ''}
        className={classNames(size, 'rounded-3xl object-cover ring-4 ring-white/20')}
      />
    )
  }
  return (
    <div
      className={classNames(
        size,
        'flex items-center justify-center rounded-3xl bg-white/15 text-2xl font-bold ring-4 ring-white/20 text-white'
      )}
    >
      {(user?.name ?? user?.first_name ?? 'A').slice(0, 1).toUpperCase()}
    </div>
  )
}
