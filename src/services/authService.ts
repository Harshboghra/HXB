import { doc, getDoc, getDocFromCache, setDoc, updateDoc } from 'firebase/firestore'
import { db, requireDatabase } from '../lib/firebase'
import { hashPassword, verifyPassword } from '../lib/password'
import { normalizeUsername } from '../lib/validation'
import type { AuthUser, ThemeMode, UserRecord } from '../types'

const USERS_COLLECTION = 'users'

function toAuthUser(record: UserRecord): AuthUser {
  return {
    id: record.usernameLower,
    username: record.username,
    displayName: record.displayName,
    themeMode: record.themeMode,
    createdAt: record.createdAt,
  }
}

function userDocumentId(username: string): string {
  return normalizeUsername(username)
}

function getUserRef(usernameLower: string) {
  return doc(requireDatabase(), USERS_COLLECTION, usernameLower)
}

async function getUserSnapshot(usernameLower: string) {
  const userRef = getUserRef(usernameLower)

  try {
    return await getDoc(userRef)
  } catch (error) {
    try {
      return await getDocFromCache(userRef)
    } catch {
      const message = error instanceof Error ? error.message : 'Unknown Firestore error.'
      throw new Error(
        `Unable to reach Firestore for user '${usernameLower}'. Check your network connection or sign in once while online so the record can be cached. ${message}`,
      )
    }
  }
}

export async function registerUser(input: {
  username: string
  password: string
  displayName?: string
  themeMode?: ThemeMode
}): Promise<AuthUser> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const usernameLower = userDocumentId(input.username)
  const existingUser = await getUserSnapshot(usernameLower)

  if (existingUser.exists()) {
    throw new Error('That username is already in use.')
  }

  const { hash, salt } = await hashPassword(input.password)
  const createdAt = Date.now()
  const userRef = getUserRef(usernameLower)
  const record: UserRecord = {
    username: input.username.trim(),
    usernameLower,
    displayName: input.displayName?.trim() || input.username.trim(),
    passwordHash: hash,
    passwordSalt: salt,
    themeMode: input.themeMode ?? 'dark',
    createdAt,
  }

  await setDoc(userRef, record)

  return toAuthUser(record)
}

export async function loginUser(input: { username: string; password: string }): Promise<AuthUser> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const usernameLower = userDocumentId(input.username)
  const snapshot = await getUserSnapshot(usernameLower)

  if (!snapshot.exists()) {
    throw new Error('Invalid username or password.')
  }

  const record = snapshot.data() as UserRecord
  const passwordMatches = await verifyPassword(input.password, record.passwordSalt, record.passwordHash)

  if (!passwordMatches) {
    throw new Error('Invalid username or password.')
  }

  return toAuthUser(record)
}

export async function getUserProfile(userId: string): Promise<AuthUser> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const snapshot = await getUserSnapshot(userId)
  if (!snapshot.exists()) {
    throw new Error('Your profile could not be found.')
  }

  return toAuthUser(snapshot.data() as UserRecord)
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, 'displayName' | 'themeMode'>>,
): Promise<AuthUser> {
  if (!db) {
    throw new Error('Firebase is not configured yet.')
  }

  const userRef = getUserRef(userId)
  await updateDoc(userRef, updates)
  return getUserProfile(userId)
}
