import { useMemo, useState } from 'react'
import { LogOut, MoonStar, SunMedium, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/Button'
import { InputField } from '../components/FormField'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { StatCard } from '../components/StatCard'
import { useNotes } from '../hooks/useNotes'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { toDateKey } from '../lib/date'
import { validateDisplayName } from '../lib/validation'

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const todayKey = toDateKey()
  const { notes } = useNotes(user?.id)
  const { tasks } = useDailyTasks(user?.id, todayKey)

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const joinedOn = new Date(user?.createdAt ?? 0)

  const stats = useMemo(() => {
    const pinnedNotes = notes.filter((note) => note.pinned).length
    const completedTasks = tasks.filter((task) => task.completed).length

    return { pinnedNotes, completedTasks }
  }, [notes, tasks])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const displayNameError = validateDisplayName(displayName)
    if (displayNameError) {
      setError(displayNameError)
      return
    }

    setSaving(true)
    setError(null)

    try {
      await updateProfile({ displayName })
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to update the profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-[fade-up_420ms_ease-out]">
      <PageHeader
        eyebrow="Profile"
        title="Manage your identity and workspace preferences."
        description="Review account details, update your display name, switch themes, and sign out when you're done."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Notes" value={String(notes.length)} detail="Your saved note cards" />
        <StatCard label="Pinned" value={String(stats.pinnedNotes)} detail="Important notes at the top" />
        <StatCard label="Today complete" value={String(stats.completedTasks)} detail="Tasks checked off today" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-(--accent)">
              <UserRound size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Account</p>
              <h2 className="text-xl font-semibold text-(--text)">{user?.displayName}</h2>
              <p className="text-sm text-(--text-soft)">@{user?.username}</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSave}>
            <InputField
              label="Display name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="How the workspace should greet you"
            />
            {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
            <Button type="submit" loading={saving} className="w-full">
              Save profile
            </Button>
          </form>

          <div className="rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-4 text-sm text-(--text-soft)">
            Joined on {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(joinedOn)}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Preferences</p>
            <h2 className="mt-1 text-xl font-semibold text-(--text)">Theme and session controls</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => void setTheme('dark')}
              className="justify-start"
            >
              <MoonStar size={16} />
              Dark mode
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => void setTheme('light')}
              className="justify-start"
            >
              <SunMedium size={16} />
              Light mode
            </Button>
          </div>

          <div className="rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-4 text-sm text-(--text-soft)">
            Current view is using {theme} mode. Task lists and note cards are optimized for both themes.
          </div>

          <Button variant="danger" onClick={logout} className="w-full justify-start">
            <LogOut size={16} />
            Sign out
          </Button>
        </Panel>
      </div>
    </div>
  )
}
