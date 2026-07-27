/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { readStorage, writeStorage } from '../lib/storage'
import type { ThemeMode } from '../types'

const THEME_KEY = 'taskflow.theme'

interface ThemeContextValue {
  theme: ThemeMode
  isDark: boolean
  setTheme: (theme: ThemeMode) => Promise<void>
  toggleTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth()
  const [themePreference, setThemePreference] = useState<ThemeMode>(() => {
    const storedTheme = readStorage<ThemeMode>(THEME_KEY)
    return storedTheme ?? 'dark'
  })

  const theme = user?.themeMode ?? themePreference

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStorage(THEME_KEY, themePreference)
  }, [theme, themePreference])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme: async (nextTheme) => {
        setThemePreference(nextTheme)
        if (user && user.themeMode !== nextTheme) {
          await updateProfile({ themeMode: nextTheme })
        }
      },
      toggleTheme: async () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        setThemePreference(nextTheme)
        if (user && user.themeMode !== nextTheme) {
          await updateProfile({ themeMode: nextTheme })
        }
      },
    }),
    [theme, updateProfile, user],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.')
  }

  return context
}
