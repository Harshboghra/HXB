import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid2x2, List, Plus, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { BottomSheet } from '../components/BottomSheet'
import { EmptyState } from '../components/EmptyState'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { InputField, TextAreaField } from '../components/FormField'
import { NoteCard } from '../components/NoteCard'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { Skeleton } from '../components/Skeleton'
import { StatCard } from '../components/StatCard'
import { useNotes } from '../hooks/useNotes'
import { useToast } from '../hooks/useToast'
import { createNote, deleteNote, updateNote } from '../services/notesService'
import { formatUpdatedTime } from '../lib/date'
import { validateNoteTitle } from '../lib/validation'
import type { Note } from '../types'

type ViewMode = 'grid' | 'list'

export function NotesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { notes, loading, error } = useNotes(user?.id)
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const saveTimerRef = useRef<number | null>(null)
  const lastSavedRef = useRef('')

  const activeNote = useMemo(() => notes.find((note) => note.id === activeNoteId) ?? null, [activeNoteId, notes])

  const filteredNotes = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) {
      return notes
    }

    return notes.filter((note) => [note.title, note.content].some((value) => value.toLowerCase().includes(search)))
  }, [notes, query])

  function clearSaveTimer() {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
  }

  function openEditor(note?: Note) {
    if (note) {
      setActiveNoteId(note.id)
      setTitle(note.title)
      setContent(note.content)
      setPinned(note.pinned)
      lastSavedRef.current = JSON.stringify({ title: note.title, content: note.content, pinned: note.pinned })
    } else {
      setActiveNoteId(null)
      setTitle('')
      setContent('')
      setPinned(false)
      lastSavedRef.current = ''
    }

    setTitleError(null)
    setSheetOpen(true)
  }

  function closeEditor() {
    clearSaveTimer()
    setSheetOpen(false)
    setActiveNoteId(null)
    setTitleError(null)
  }

  const persistNote = useCallback(async () => {
    if (!user) {
      return
    }

    const snapshot = JSON.stringify({ title: title.trim(), content: content.trim(), pinned })
    if (snapshot === lastSavedRef.current) {
      return
    }

    if (!title.trim() && !content.trim() && !activeNoteId) {
      return
    }

    const titleErrorMessage = validateNoteTitle(title)
    if (titleErrorMessage && title.trim().length > 0) {
      setTitleError(titleErrorMessage)
      return
    }

    setSaving(true)
    try {
      if (activeNoteId) {
        await updateNote(activeNoteId, { title, content, pinned })
        showToast('Note saved', 'success')
      } else {
        const createdId = await createNote({ userId: user.id, title, content, pinned })
        setActiveNoteId(createdId)
        showToast('Note created', 'success')
      }
      lastSavedRef.current = snapshot
      setTitleError(null)
    } catch (nextError) {
      showToast(nextError instanceof Error ? nextError.message : 'Unable to save note.', 'danger')
    } finally {
      setSaving(false)
    }
  }, [activeNoteId, content, pinned, title, user, showToast])

  useEffect(() => {
    if (!sheetOpen) {
      return undefined
    }

    clearSaveTimer()
    saveTimerRef.current = window.setTimeout(() => {
      void persistNote()
    }, 550)

    return clearSaveTimer
  }, [activeNoteId, content, persistNote, pinned, sheetOpen, title])

  async function handleDelete(note: Note) {
    const shouldDelete = window.confirm('Delete this note? This cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteNote(note.id)
    showToast('Note deleted', 'warning')
    if (activeNoteId === note.id) {
      closeEditor()
    }
  }

  async function handleTogglePin(note: Note) {
    await updateNote(note.id, { pinned: !note.pinned })
    showToast(note.pinned ? 'Note unpinned' : 'Note pinned', 'success')
  }

  const noteCount = notes.length
  const pinnedCount = notes.filter((note) => note.pinned).length

  return (
    <div className="space-y-5 animate-enter">
      <PageHeader
        eyebrow="Notes"
        title="Capture ideas fast."
        description="Search, pin, and edit notes with a sheet-based editor built for one-handed use."
        actions={
          <>
            <Button type="button" variant={viewMode === 'grid' ? 'primary' : 'secondary'} className="min-h-12 px-3" onClick={() => setViewMode('grid')}>
              <Grid2x2 size={16} />
            </Button>
            <Button type="button" variant={viewMode === 'list' ? 'primary' : 'secondary'} className="min-h-12 px-3" onClick={() => setViewMode('list')}>
              <List size={16} />
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Total notes" value={String(noteCount)} detail="All saved notes" />
        <StatCard label="Pinned" value={String(pinnedCount)} detail="Pinned for quick access" />
      </div>

      {error ? (
        <Panel className="border-amber-400/30 bg-amber-500/10 text-amber-100">
          <p className="text-sm font-semibold">Notes status</p>
          <p className="mt-1 text-sm text-amber-50/80">{error}</p>
        </Panel>
      ) : null}

      <Panel className="space-y-4">
        <div className="flex items-center gap-3 rounded-[18px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-4 py-3">
          <Search size={16} className="text-(--text-soft)" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes"
            className="w-full bg-transparent text-sm text-(--text) outline-none placeholder:text-(--text-soft)"
          />
        </div>

        {loading ? (
          <div className={viewMode === 'grid' ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} onOpen={openEditor} onDelete={handleDelete} onTogglePin={handleTogglePin} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={query ? 'No matches' : 'No notes yet'}
            description={query ? 'Try a different search.' : 'Create your first note.'}
            action={
              <Button type="button" onClick={() => openEditor()}>
                <Plus size={16} />
                New note
              </Button>
            }
          />
        )}
      </Panel>

      <FloatingActionButton type="button" aria-label="Create note" onClick={() => openEditor()}>
        <Plus size={20} />
      </FloatingActionButton>

      <BottomSheet
        open={sheetOpen}
        title={activeNote ? 'Edit note' : 'New note'}
        description={saving ? 'Saving...' : activeNote?.updatedAt ? `Updated ${formatUpdatedTime(activeNote.updatedAt)}` : 'Auto-save on every change.'}
        onClose={closeEditor}
      >
        <div className="space-y-4">
          <InputField
            label="Title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setTitleError(null)
            }}
            placeholder="Note title"
            error={titleError}
          />
          <TextAreaField
            label="Content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Start typing..."
            hint="Tap close when you are done. Changes save automatically."
          />

          <div className="flex items-center justify-between rounded-[18px] border border-(--border) bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-4 py-3">
            <span className="text-sm font-medium text-(--text)">Pinned</span>
            <button
              type="button"
              onClick={() => setPinned((current) => !current)}
              className={`flex h-12 w-20 items-center rounded-full p-1 transition duration-200 ${pinned ? 'bg-(--accent)' : 'bg-slate-300/40 dark:bg-slate-700/60'}`}
            >
              <span className={`h-10 w-10 rounded-full bg-white shadow-sm transition duration-200 ${pinned ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeEditor}>
              Close
            </Button>
            {activeNote ? (
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={async () => {
                  await handleDelete(activeNote)
                }}
              >
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
