/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { subscribeToNotes } from '../services/notesService'
import type { Note } from '../types'

export function useNotes(userId: string | null | undefined) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setNotes([])
      setLoading(false)
      setError(null)
      return undefined
    }

    setLoading(true)
    const unsubscribe = subscribeToNotes(
      userId,
      (nextNotes) => {
        setNotes(nextNotes)
        setError(null)
        setLoading(false)
      },
      (nextError) => {
        setError(nextError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId])

  return { notes, loading, error }
}
