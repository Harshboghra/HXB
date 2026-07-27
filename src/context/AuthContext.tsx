/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../services/authService'
import { readStorage, removeStorage, writeStorage } from '../lib/storage'
import type { AuthUser, ThemeMode } from '../types'

const SESSION_KEY = 'taskflow.session'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (input: { username: string; password: string }) => Promise<AuthUser>
  register: (input: {
    username: string
    password: string
    displayName?: string
    themeMode?: ThemeMode
  }) => Promise<AuthUser>
  logout: () => void
  updateProfile: (updates: Partial<Pick<AuthUser, 'displayName' | 'themeMode'>>) => Promise<AuthUser>
  refreshProfile: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser>(SESSION_KEY))
  const loading = false

  useEffect(() => {
    if (user) {
      writeStorage(SESSION_KEY, user)
    } else {
      removeStorage(SESSION_KEY)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (input) => {
        const authenticatedUser = await loginUser(input)
        setUser(authenticatedUser)
        return authenticatedUser
      },
      register: async (input) => {
        const authenticatedUser = await registerUser(input)
        setUser(authenticatedUser)
        return authenticatedUser
      },
      logout: () => {
        setUser(null)
      },
      updateProfile: async (updates) => {
        if (!user) {
          throw new Error('You must be signed in to update your profile.')
        }

        const updatedUser = await updateUserProfile(user.id, updates)
        setUser(updatedUser)
        return updatedUser
      },
      refreshProfile: async () => {
        if (!user) {
          return null
        }

        const latestUser = await getUserProfile(user.id)
        setUser(latestUser)
        return latestUser
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
