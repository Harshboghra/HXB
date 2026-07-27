import { LogOut } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { firebaseConfigured } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'
import { BottomNav } from '../components/BottomNav'

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 lg:pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_24%)]" />
      <header className="sticky top-0 z-30 border-b border-(--border) bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--accent)">Task & Notes</p>
            <p className="text-sm text-(--text-soft)">{user?.displayName ?? 'Workspace'}</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle />
            <Button variant="secondary" onClick={logout} className="min-h-12 px-4">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <Button variant="secondary" onClick={logout} className="min-h-12 px-3">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>

      <BottomNav />

      {!firebaseConfigured ? (
        <div className="pointer-events-none fixed left-1/2 top-[4.5rem] z-20 w-[min(92vw,26rem)] -translate-x-1/2">
          <Panel className="border-amber-400/30 bg-amber-500/10 text-amber-100">
            <p className="text-sm font-semibold text-amber-100">Firebase configuration needed</p>
            <p className="mt-1 text-sm text-amber-50/80">
              Add the VITE_FIREBASE_* environment variables to enable live Firestore data.
            </p>
          </Panel>
        </div>
      ) : null}
    </div>
  )
}
