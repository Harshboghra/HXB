import { Home, NotebookPen, CalendarCheck2, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/daily-tasks', label: 'Daily', icon: CalendarCheck2 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-(--border) bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex min-h-12 flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-3 text-[11px] font-medium transition duration-200 ${
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-(--accent)'
                    : 'text-(--text-soft) active:scale-[0.96]'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
