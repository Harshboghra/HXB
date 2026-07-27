import { getApps, initializeApp } from 'firebase/app'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean)

export const firebaseApp = firebaseConfigured
  ? getApps().length > 0
    ? getApps()[0] ?? initializeApp(firebaseConfig)
    : initializeApp(firebaseConfig)
  : null

export const db = firebaseApp ? getFirestore(firebaseApp) : null

if (db) {
  void enableIndexedDbPersistence(db).catch(() => {
    // Persistence can fail in private browsing or when another tab already owns the cache.
  })
}

export function requireDatabase() {
  if (!db) {
    throw new Error(
      'Firebase is not configured. Set the VITE_FIREBASE_* environment variables to enable Firestore.',
    )
  }

  return db
}
