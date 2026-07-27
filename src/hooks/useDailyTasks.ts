/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { subscribeToDailyTasks } from '../services/dailyTasksService'
import type { DailyTask } from '../types'

export function useDailyTasks(userId: string | null | undefined, dateKey: string) {
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      setError(null)
      return undefined
    }

    setLoading(true)
    const unsubscribe = subscribeToDailyTasks(
      userId,
      dateKey,
      (nextTasks) => {
        setTasks(nextTasks)
        setError(null)
        setLoading(false)
      },
      (nextError) => {
        setError(nextError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [dateKey, userId])

  return { tasks, loading, error }
}
