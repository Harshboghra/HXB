import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db, requireDatabase } from '../lib/firebase'
import type { Note } from '../types'

const NOTES_COLLECTION = 'notes'

function toNote(id: string, data: Record<string, unknown>): Note {
  return {
    id,
    userId: String(data.userId ?? ''),
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    pinned: Boolean(data.pinned),
    createdAt: Number(data.createdAt ?? Date.now()),
    updatedAt: Number(data.updatedAt ?? Date.now()),
  }
}

function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return left.pinned ? -1 : 1
    }

    return right.updatedAt - left.updatedAt
  })
}

export function subscribeToNotes(
  userId: string,
  onChange: (notes: Note[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) {
    onError?.(new Error('Firebase is not configured yet.'))
    return () => undefined
  }

  const notesQuery = query(collection(requireDatabase(), NOTES_COLLECTION), where('userId', '==', userId))

  return onSnapshot(
    notesQuery,
    (snapshot) => {
      const notes = snapshot.docs.map((item) => toNote(item.id, item.data()))
      onChange(sortNotes(notes))
    },
    (error) => onError?.(error instanceof Error ? error : new Error('Unable to load notes.')),
  )
}

export async function createNote(input: {
  userId: string
  title: string
  content: string
  pinned?: boolean
}): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const timestamp = Date.now()
  const createdDoc = await addDoc(collection(requireDatabase(), NOTES_COLLECTION), {
    userId: input.userId,
    title: input.title.trim(),
    content: input.content.trim(),
    pinned: input.pinned ?? false,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return createdDoc.id
}

export async function updateNote(
  noteId: string,
  updates: Partial<Pick<Note, 'title' | 'content' | 'pinned'>>,
): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  await updateDoc(doc(requireDatabase(), NOTES_COLLECTION, noteId), {
    ...updates,
    updatedAt: Date.now(),
  })
}

export async function deleteNote(noteId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  await deleteDoc(doc(requireDatabase(), NOTES_COLLECTION, noteId))
}
