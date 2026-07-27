export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-(--text-soft)">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--border) border-t-(--accent)" />
      <span>{label}</span>
    </div>
  )
}
