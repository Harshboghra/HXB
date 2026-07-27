import { Check, PencilLine, Trash2 } from 'lucide-react'
import type { DailyTask } from '../types'
import { Button } from './Button'
import { Panel } from './Panel'
import { SwipeableCard } from './SwipeableCard'

interface TaskCardProps {
  task: DailyTask
  onToggle: (task: DailyTask) => void
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
}

const priorityStyles: Record<DailyTask['priority'], string> = {
  low: 'bg-emerald-500/12 text-emerald-500',
  medium: 'bg-amber-500/12 text-amber-500',
  high: 'bg-red-500/12 text-red-500',
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <SwipeableCard onSwipeLeft={() => onDelete(task)} onLongPress={() => onEdit(task)} className="rounded-[20px]">
      <Panel className="p-4 transition duration-200 active:scale-[0.96]">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggle(task)}
            className={`mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-[18px] transition duration-200 active:scale-[0.96] ${task.completed ? 'bg-(--accent) text-white' : 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-(--accent)'}`}
            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          >
            <Check size={16} />
          </button>

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </p>
                <h3 className={`mt-2 line-clamp-1 text-base font-semibold ${task.completed ? 'text-(--text-soft) line-through' : 'text-(--text)'}`}>
                  {task.title}
                </h3>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--text-soft)">{task.details || 'No details yet.'}</p>
            <button type="button" className="mt-3 text-sm font-medium text-(--accent)" onClick={() => onEdit(task)}>
              Edit task
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" className="min-h-12 px-3" onClick={() => onEdit(task)}>
              <PencilLine size={16} />
            </Button>
            <Button type="button" variant="danger" className="min-h-12 px-3" onClick={() => onDelete(task)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </Panel>
    </SwipeableCard>
  )
}
