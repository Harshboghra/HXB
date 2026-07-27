import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const controlClasses =
  'mt-2 w-full min-h-12 rounded-[18px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-(--text-soft) focus:border-(--accent) focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)]'

interface BaseFieldProps {
  label: string
  error?: string | null
  hint?: string
  className?: string
}

export function InputField({ label, error, hint, className = '', ...props }: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block text-sm font-medium text-(--text) ${className}`}>
      <span>{label}</span>
      <input className={controlClasses} {...props} />
      {hint ? <span className="mt-1 block text-xs text-(--text-soft)">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-red-400">{error}</span> : null}
    </label>
  )
}

export function TextAreaField({ label, error, hint, className = '', ...props }: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`block text-sm font-medium text-(--text) ${className}`}>
      <span>{label}</span>
      <textarea className={`${controlClasses} min-h-40 resize-y`} {...props} />
      {hint ? <span className="mt-1 block text-xs text-(--text-soft)">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-red-400">{error}</span> : null}
    </label>
  )
}

export function SelectField({ label, error, hint, className = '', children, ...props }: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`block text-sm font-medium text-(--text) ${className}`}>
      <span>{label}</span>
      <select className={controlClasses} {...props}>
        {children}
      </select>
      {hint ? <span className="mt-1 block text-xs text-(--text-soft)">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-red-400">{error}</span> : null}
    </label>
  )
}
