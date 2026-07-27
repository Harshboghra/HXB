export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

export function validateUsername(username: string): string | null {
  const value = username.trim()
  if (value.length < 3) {
    return 'Username must be at least 3 characters.'
  }

  if (value.length > 24) {
    return 'Username must be 24 characters or fewer.'
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    return 'Use letters, numbers, dots, underscores, or dashes.'
  }

  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include letters and a number.'
  }

  return null
}

export function validateDisplayName(displayName: string): string | null {
  const value = displayName.trim()
  if (value.length < 2) {
    return 'Display name must be at least 2 characters.'
  }

  return null
}

export function validateNoteTitle(title: string): string | null {
  if (title.trim().length < 2) {
    return 'Title must be at least 2 characters.'
  }

  return null
}

export function validateNoteContent(): string | null {
  return null
}

export function validateTaskTitle(title: string): string | null {
  if (title.trim().length < 2) {
    return 'Task title must be at least 2 characters.'
  }

  return null
}
