import type { ReactNode } from 'react'
import { ShieldCheck, Sparkles, NotebookPen, CalendarCheck2 } from 'lucide-react'
import { Panel } from '../components/Panel'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

const highlights = [
  {
    icon: Sparkles,
    title: 'Username-based access',
    text: 'No email address required. Users authenticate with a custom username and hashed password flow.',
  },
  {
    icon: NotebookPen,
    title: 'Notes and tasks',
    text: 'Create, pin, search, and manage notes plus daily tasks tied to any date.',
  },
  {
    icon: CalendarCheck2,
    title: 'Polished experience',
    text: 'A responsive interface with loading states, validation, dark mode, and subtle motion.',
  },
]

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-screen w-full max-w-5xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden lg:block">
          <div className="space-y-4 pr-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-[color-mix(in_srgb,var(--surface)_75%,transparent)] px-4 py-2 text-sm font-medium text-(--text) shadow-(--shadow)">
              <ShieldCheck size={16} className="text-(--accent)" />
              Username only. No email.
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-(--text)">{title}</h1>
            <p className="max-w-md text-base leading-7 text-(--text-soft)">{description}</p>
            <div className="grid gap-3 pt-2">
              {highlights.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-[20px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] p-4 shadow-(--shadow)">
                    <div className="mt-0.5 rounded-2xl bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] p-3 text-(--accent)">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-(--text)">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-(--text-soft)">{item.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <Panel className="space-y-5 p-5 sm:p-6 md:p-8 animate-enter">
            <div className="space-y-2 lg:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-(--accent)">Taskflow</p>
              <h1 className="text-[28px] font-semibold tracking-tight text-(--text)">{title}</h1>
              <p className="text-sm leading-6 text-(--text-soft)">{description}</p>
            </div>
            {children}
          </Panel>
          <div className="mt-4 text-sm text-(--text-soft)">{footer}</div>
        </section>
      </div>
    </div>
  )
}
