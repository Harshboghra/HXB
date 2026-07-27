import type { ReactNode } from 'react'
import { Panel } from './Panel'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Panel className="flex flex-col items-start gap-4 border-dashed bg-(--surface)/70">
      <div>
        <h3 className="text-lg font-semibold text-(--text)">{title}</h3>
        <p className="mt-1 max-w-xl text-sm text-(--text-soft)">{description}</p>
      </div>
      {action}
    </Panel>
  )
}
