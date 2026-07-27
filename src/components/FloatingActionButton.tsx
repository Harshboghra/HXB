import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function FloatingActionButton({ children, className = '', ...props }: FloatingActionButtonProps) {
  return (
    <button
      className={`fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-(--accent) text-white shadow-[0_18px_40px_rgba(79,70,229,0.35)] transition duration-200 active:scale-[0.96] lg:bottom-8 lg:right-8 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
