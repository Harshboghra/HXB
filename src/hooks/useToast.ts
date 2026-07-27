import { createContext, useContext } from 'react'

type ToastTone = 'info' | 'success' | 'warning' | 'danger'

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.')
  }

  return context
}

export type { ToastTone, ToastContextValue }