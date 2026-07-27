import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { ToastContext, type ToastTone } from '../hooks/useToast'

interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, tone: ToastTone = 'info') => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2200)
  }

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-60 flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-[18px] border border-(--border) bg-(--surface-strong) px-4 py-3 text-sm shadow-(--shadow) animate-enter ${
              toast.tone === 'success'
                ? 'text-emerald-300'
                : toast.tone === 'warning'
                  ? 'text-amber-300'
                  : toast.tone === 'danger'
                    ? 'text-red-300'
                    : 'text-(--text)'
            }`}
          >
            <p>{toast.message}</p>
            <button type="button" className="rounded-full p-1 text-(--text-soft) active:scale-[0.96]" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
