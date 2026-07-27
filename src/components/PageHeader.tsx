import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-2xl space-y-2">
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-(--accent)">{eyebrow}</p> : null}
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-(--text) sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-(--text-soft) sm:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
