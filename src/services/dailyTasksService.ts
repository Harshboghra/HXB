import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db, requireDatabase } from '../lib/firebase'
import type { DailyTask } from '../types'

const DAILY_TASKS_COLLECTION = 'dailyTasks'

function toTask(id: string, data: Record<string, unknown>): DailyTask {
  return {
    id,
    userId: String(data.userId ?? ''),
    dateKey: String(data.dateKey ?? ''),
    title: String(data.title ?? ''),
    details: String(data.details ?? ''),
    priority: (data.priority === 'high' || data.priority === 'medium' ? data.priority : 'low') as
      | 'low'
      | 'medium'
      | 'high',
    completed: Boolean(data.completed),
    createdAt: Number(data.createdAt ?? Date.now()),
    updatedAt: Number(data.updatedAt ?? Date.now()),
  }
}

function sortTasks(tasks: DailyTask[]): DailyTask[] {
  return [...tasks].sort((left, right) => {
    if (left.completed !== right.completed) {
      return left.completed ? 1 : -1
    }

    return right.updatedAt - left.updatedAt
  })
}

export function subscribeToDailyTasks(
  userId: string,
  dateKey: string,
  onChange: (tasks: DailyTask[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) {
    onError?.(new Error('Firebase is not configured yet.'))
    return () => undefined
  }

  const taskQuery = query(
    collection(requireDatabase(), DAILY_TASKS_COLLECTION),
    where('userId', '==', userId),
    where('dateKey', '==', dateKey),
  )

  return onSnapshot(
    taskQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((item) => toTask(item.id, item.data()))
      onChange(sortTasks(tasks))
    },
    (error) => onError?.(error instanceof Error ? error : new Error('Unable to load tasks.')),
  )
}

export async function createDailyTask(input: {
  userId: string
  dateKey: string
  title: string
  details: string
  priority: 'low' | 'medium' | 'high'
}): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const timestamp = Date.now()
  const createdDoc = await addDoc(collection(requireDatabase(), DAILY_TASKS_COLLECTION), {
    userId: input.userId,
    dateKey: input.dateKey,
    title: input.title.trim(),
    details: input.details.trim(),
    priority: input.priority,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return createdDoc.id
}

export async function updateDailyTask(
  taskId: string,
  updates: Partial<Pick<DailyTask, 'title' | 'details' | 'dateKey' | 'completed' | 'priority'>>,
): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  await updateDoc(doc(requireDatabase(), DAILY_TASKS_COLLECTION, taskId), {
    ...updates,
    updatedAt: Date.now(),
  })
}

export async function toggleDailyTask(taskId: string, completed: boolean): Promise<void> {
  return updateDailyTask(taskId, { completed })
}

export async function deleteDailyTask(taskId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  await deleteDoc(doc(requireDatabase(), DAILY_TASKS_COLLECTION, taskId))
}
