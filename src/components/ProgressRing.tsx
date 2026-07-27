interface ProgressRingProps {
  value: number
  max: number
  label: string
}

export function ProgressRing({ value, max, label }: ProgressRingProps) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const dashOffset = circumference - progress * circumference

  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-4 shadow-(--shadow)">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
          <circle cx="48" cy="48" r={radius} className="fill-none stroke-slate-200/30" strokeWidth="10" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="fill-none stroke-(--accent) transition-all duration-200"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-semibold text-(--text)">{value}</p>
            <p className="text-xs text-(--text-soft)">/{max}</p>
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-(--text-soft)">{label}</p>
        <p className="mt-1 text-base font-semibold text-(--text)">{Math.round(progress * 100)}% done</p>
      </div>
    </div>
  )
}
