export type ThemeMode = 'light' | 'dark'

export interface AuthUser {
  id: string
  username: string
  displayName: string
  themeMode: ThemeMode
  createdAt: number
}

export interface UserRecord {
  username: string
  usernameLower: string
  displayName: string
  passwordHash: string
  passwordSalt: string
  themeMode: ThemeMode
  createdAt: number
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export interface DailyTask {
  id: string
  userId: string
  dateKey: string
  title: string
  details: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: number
  updatedAt: number
}
