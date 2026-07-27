import { useMemo, useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { InputField, SelectField, TextAreaField } from '../components/FormField'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { ProgressRing } from '../components/ProgressRing'
import { Skeleton } from '../components/Skeleton'
import { TaskCard } from '../components/TaskCard'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useToast } from '../hooks/useToast'
import { createDailyTask, deleteDailyTask, toggleDailyTask, updateDailyTask } from '../services/dailyTasksService'
import { formatDateLabel, formatShortDate, toDateKey } from '../lib/date'
import { validateTaskTitle } from '../lib/validation'
import type { DailyTask } from '../types'

type Priority = 'low' | 'medium' | 'high'

export function DailyTasksPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const todayKey = toDateKey()
  const tomorrowKey = useMemo(() => {
    const tomorrow = new Date(`${todayKey}T00:00:00`)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return toDateKey(tomorrow)
  }, [todayKey])
  const [dateKey, setDateKey] = useState(todayKey)
  const { tasks, loading, error } = useDailyTasks(user?.id, dateKey)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [selectedDateKey, setSelectedDateKey] = useState(dateKey)
  const [priority, setPriority] = useState<Priority>('medium')
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)

  const activeTask = useMemo(() => tasks.find((task) => task.id === activeTaskId) ?? null, [activeTaskId, tasks])
  const completedTasks = tasks.filter((task) => task.completed).length

  function resetSheet() {
    setActiveTaskId(null)
    setTitle('')
    setDetails('')
    setSelectedDateKey(dateKey)
    setPriority('medium')
    setTitleError(null)
  }

  function openSheet(task?: DailyTask) {
    if (task) {
      setActiveTaskId(task.id)
      setTitle(task.title)
      setDetails(task.details)
      setSelectedDateKey(task.dateKey)
      setPriority(task.priority)
    } else {
      resetSheet()
    }

    setSheetOpen(true)
  }

  function closeSheet() {
    setSheetOpen(false)
  }

  async function handleSave() {
    const validationError = validateTaskTitle(title)
    if (validationError) {
      setTitleError(validationError)
      return
    }

    if (!user) {
      showToast('Sign in to manage daily tasks.', 'danger')
      return
    }

    setSaving(true)
    setTitleError(null)

    try {
      if (activeTaskId) {
        await updateDailyTask(activeTaskId, { title, details, dateKey: selectedDateKey, priority })
        showToast('Task saved', 'success')
      } else {
        await createDailyTask({ userId: user.id, dateKey: selectedDateKey, title, details, priority })
        showToast('Task added', 'success')
      }
      setSheetOpen(false)
    } catch (nextError) {
      showToast(nextError instanceof Error ? nextError.message : 'Unable to save task.', 'danger')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task: DailyTask) {
    const shouldDelete = window.confirm('Delete this task? This cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteDailyTask(task.id)
    showToast('Task deleted', 'warning')
    if (activeTaskId === task.id) {
      closeSheet()
    }
  }

  async function handleToggle(task: DailyTask) {
    await toggleDailyTask(task.id, !task.completed)
    showToast(task.completed ? 'Marked incomplete' : 'Marked complete', 'success')
  }

  const progressMax = Math.max(tasks.length, 1)

  return (
    <div className="space-y-5 animate-enter">
      <PageHeader
        eyebrow="Daily"
        title="Plan today in a few taps."
        description="Track tasks by date, mark them complete instantly, and add new items from a bottom sheet."
        actions={
          <Button type="button" variant="secondary" className="min-h-12 px-3" onClick={() => setDateKey(todayKey)}>
            <CalendarDays size={16} />
            Today
          </Button>
        }
      />

      <Panel className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Selected date</p>
            <p className="mt-1 text-xl font-semibold text-(--text)">{formatDateLabel(dateKey)}</p>
          </div>
          <div className="rounded-[18px] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-3 py-2 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--accent)">Completed</p>
            <p className="text-lg font-semibold text-(--text)">{completedTasks}/{tasks.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <Button type="button" variant={dateKey === todayKey ? 'primary' : 'secondary'} className="min-h-12 whitespace-nowrap" onClick={() => setDateKey(todayKey)}>
            Today
          </Button>
          <Button type="button" variant={dateKey === tomorrowKey ? 'primary' : 'secondary'} className="min-h-12 whitespace-nowrap" onClick={() => setDateKey(tomorrowKey)}>
            Tomorrow
          </Button>
          <InputField
            label="Date"
            type="date"
            value={dateKey}
            onChange={(event) => setDateKey(event.target.value)}
            className="min-w-48"
          />
        </div>

        <ProgressRing value={completedTasks} max={progressMax} label="Today's progress" />
      </Panel>

      {error ? (
        <Panel className="border-amber-400/30 bg-amber-500/10 text-amber-100">
          <p className="text-sm font-semibold">Daily tasks status</p>
          <p className="mt-1 text-sm text-amber-50/80">{error}</p>
        </Panel>
      ) : null}

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">Task list</p>
            <h2 className="mt-1 text-xl font-semibold text-(--text)">{formatShortDate(dateKey)}</h2>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} onEdit={openSheet} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No daily tasks"
            description="Plan your day in a bottom sheet."
            action={
              <Button type="button" onClick={() => openSheet()}>
                <Plus size={16} />
                Add task
              </Button>
            }
          />
        )}
      </Panel>

      <FloatingActionButton type="button" aria-label="Add task" onClick={() => openSheet()}>
        <Plus size={20} />
      </FloatingActionButton>

      <BottomSheet
        open={sheetOpen}
        title={activeTask ? 'Edit task' : 'Add daily task'}
        description={activeTask ? 'Swipe cards later to manage tasks faster.' : 'Pick a date and priority, then save.'}
        onClose={closeSheet}
      >
        <div className="space-y-4">
          <InputField
            label="Task name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Finish weekly review"
            error={titleError}
          />
          <SelectField label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </SelectField>
          <InputField label="Date" type="date" value={selectedDateKey} onChange={(event) => setSelectedDateKey(event.target.value)} />
          <TextAreaField label="Details" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Add a small note, link, or next step." />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeSheet}>
              Cancel
            </Button>
            <Button type="button" className="flex-1" loading={saving} onClick={() => void handleSave()}>
              Save
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
