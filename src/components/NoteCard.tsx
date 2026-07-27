import { Pin, PinOff, PencilLine, Trash2 } from 'lucide-react'
import type { Note } from '../types'
import { Button } from './Button'
import { Panel } from './Panel'
import { SwipeableCard } from './SwipeableCard'
import { formatUpdatedTime } from '../lib/date'

interface NoteCardProps {
  note: Note
  onOpen: (note: Note) => void
  onDelete: (note: Note) => void
  onTogglePin: (note: Note) => void
}

export function NoteCard({ note, onOpen, onDelete, onTogglePin }: NoteCardProps) {
  return (
    <SwipeableCard
      onSwipeLeft={() => onDelete(note)}
      onSwipeRight={() => onTogglePin(note)}
      className="rounded-[20px]"
    >
      <Panel className="group relative overflow-hidden p-4 transition duration-200 active:scale-[0.96]">
        <div className="w-full text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-(--text-soft)">
                {note.pinned ? <Pin size={12} className="text-(--accent)" /> : null}
                <span>{note.pinned ? 'Pinned' : 'Note'}</span>
              </div>
              <h3 className="mt-2 line-clamp-1 text-base font-semibold text-(--text)">{note.title || 'Untitled note'}</h3>
            </div>
            <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--accent)">
              {formatUpdatedTime(note.updatedAt)}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-(--text-soft)">{note.content || 'Tap to start writing.'}</p>
          <button type="button" className="mt-3 w-full text-left" onClick={() => onOpen(note)}>
            <span className="text-sm font-medium text-(--accent)">Open editor</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" className="min-h-12 px-3" onClick={() => onTogglePin(note)}>
            {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="min-h-12 px-3" onClick={() => onOpen(note)}>
              <PencilLine size={16} />
            </Button>
            <Button type="button" variant="danger" className="min-h-12 px-3" onClick={() => onDelete(note)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </Panel>
    </SwipeableCard>
  )
}
