import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
}

export function BottomSheet({ open, title, description, children, onClose }: BottomSheetProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 px-0 sm:px-4 sm:pb-4" role="presentation" onClick={onClose}>
      <div
        className="w-full rounded-t-[28px] border border-b-0 border-(--border) bg-(--surface-strong) p-4 shadow-(--shadow) animate-sheet sm:mx-auto sm:max-w-2xl sm:rounded-[28px] sm:border-b"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300/30" />
        <div className="space-y-1 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-(--text)">{title}</h2>
          {description ? <p className="text-sm text-(--text-soft)">{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  )
}
