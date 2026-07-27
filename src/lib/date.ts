export function toDateKey(date = new Date()): string {
  const timezoneOffset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

export function formatDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatShortDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatUpdatedTime(timestamp: number): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

