import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-(--accent) text-white shadow-[0_12px_30px_rgba(79,70,229,0.25)] hover:bg-(--accent-strong)',
  secondary:
    'border border-(--border) bg-(--surface) text-(--text) hover:border-(--accent)',
  ghost: 'text-(--text-soft) hover:bg-white/10 hover:text-(--text)',
  danger: 'bg-(--danger) text-white hover:opacity-90',
}

export function Button({ variant = 'primary', loading = false, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96] ${variantClasses[variant]} ${className}`}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
      {children}
    </button>
  )
}
