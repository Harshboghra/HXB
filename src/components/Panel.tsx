import type { HTMLAttributes, ReactNode } from 'react'

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Panel({ className = '', children, ...props }: PanelProps) {
  return (
    <div
      className={`rounded-[20px] border border-(--border) bg-(--surface) p-4 shadow-(--shadow) backdrop-blur-xl sm:p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
