import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarPlus2, NotebookPen, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { NoteCard } from '../components/NoteCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { ProgressRing } from '../components/ProgressRing'
import { Skeleton } from '../components/Skeleton'
import { TaskCard } from '../components/TaskCard'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useNotes } from '../hooks/useNotes'
import { formatDateLabel, toDateKey } from '../lib/date'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const todayKey = toDateKey()
  const { notes, loading: notesLoading } = useNotes(user?.id)
  const { tasks, loading: tasksLoading } = useDailyTasks(user?.id, todayKey)

  const summary = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed).length
    const totalTasks = tasks.length

    return {
      completedTasks,
      totalTasks,
      pinnedNotes: notes.filter((note) => note.pinned).length,
    }
  }, [notes, tasks])

  const recentNotes = notes.slice(0, 2)
  const todayTasks = tasks.slice(0, 3)
  const goToNotes = () => navigate('/notes')
  const goToTasks = () => navigate('/daily-tasks')

  return (
    <div className="space-y-5 animate-enter">
      <PageHeader
        eyebrow="Home"
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user?.displayName ?? 'there'}`}
        description={formatDateLabel(todayKey)}
      />

      <ProgressRing value={summary.completedTasks} max={Math.max(summary.totalTasks, 1)} label="Today's progress" />

      <Panel className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/notes">
            <Button type="button" className="min-h-12 w-full justify-start">
              <Plus size={16} />
              New Note
            </Button>
          </Link>
          <Link to="/daily-tasks">
            <Button type="button" className="min-h-12 w-full justify-start" variant="secondary">
              <CalendarPlus2 size={16} />
              Add Task
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Notes</p>
            <p className="mt-2 text-2xl font-semibold text-(--text)">{notes.length}</p>
          </div>
          <div className="rounded-[18px] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Pinned</p>
            <p className="mt-2 text-2xl font-semibold text-(--text)">{summary.pinnedNotes}</p>
          </div>
          <div className="rounded-[18px] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Tasks</p>
            <p className="mt-2 text-2xl font-semibold text-(--text)">{summary.totalTasks}</p>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Recent notes</p>
            <h2 className="mt-1 text-xl font-semibold text-(--text)">Quick glance</h2>
          </div>
          <NotebookPen size={18} className="text-(--text-soft)" />
        </div>

        {notesLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : recentNotes.length > 0 ? (
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} onOpen={goToNotes} onDelete={goToNotes} onTogglePin={goToNotes} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No notes yet"
            description="Create your first note."
            action={
              <Link to="/notes">
                <Button type="button">
                  <Plus size={16} />
                  New note
                </Button>
              </Link>
            }
          />
        )}
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Today's tasks</p>
          <h2 className="mt-1 text-xl font-semibold text-(--text)">Preview</h2>
        </div>

        {tasksLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={goToTasks} onEdit={goToTasks} onDelete={goToTasks} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks for today"
            description="Plan your day."
            action={
              <Link to="/daily-tasks">
                <Button type="button">
                  <Plus size={16} />
                  Add task
                </Button>
              </Link>
            }
          />
        )}
      </Panel>
    </div>
  )
}
