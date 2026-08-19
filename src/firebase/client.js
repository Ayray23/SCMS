import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebaseConfig from './config'

// Sanity check: catch a PARTIALLY-configured .env early. Each field in
// config.js falls back to its own "REPLACE_..." placeholder independently,
// so it's possible for e.g. apiKey/authDomain to be real (auth works) while
// storageBucket is still a placeholder (storage silently breaks with a
// confusing CORS-looking error). Warn loudly instead of failing silently.
const placeholderFields = Object.entries(firebaseConfig)
  .filter(([, value]) => typeof value === 'string' && value.startsWith('REPLACE_'))
  .map(([key]) => key)

if (placeholderFields.length > 0 && placeholderFields.length < Object.keys(firebaseConfig).length) {
  console.error(
    `[firebase] .env is missing or has an incorrect value for: ${placeholderFields.join(', ')}. ` +
    'Some Firebase services will work while these will fail. Check .env against .env.example, ' +
    'copy the exact values from Firebase Console > Project settings > General, and restart the dev server.'
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
