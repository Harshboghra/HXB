import { Panel } from './Panel'

interface StatCardProps {
  label: string
  value: string
  detail?: string
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <Panel className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">{label}</p>
      <p className="text-2xl font-semibold tracking-tight text-(--text) sm:text-3xl">{value}</p>
      {detail ? <p className="text-sm text-(--text-soft)">{detail}</p> : null}
    </Panel>
  )
}
