import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/client'

const AuthContext = createContext(null)

function readLocalAuth() {
  try {
    const storedUser = localStorage.getItem('scms-user')
    const storedProfile = localStorage.getItem('scms-profile')
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      profile: storedProfile ? JSON.parse(storedProfile) : null,
    }
  } catch (error) {
    return { user: null, profile: null }
  }
}

function isFirebasePlaceholder() {
  return auth?.app?.options?.apiKey?.startsWith('REPLACE')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAuthChange = async () => {
      setLoading(true)

      if (isFirebasePlaceholder()) {
        const { user: storedUser, profile: storedProfile } = readLocalAuth()
        setUser(storedUser)
        setProfile(storedProfile)
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, async currentUser => {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          const profileData = userDoc.exists() ? { uid: currentUser.uid, email: currentUser.email, ...userDoc.data() } : null
          setUser(currentUser)
          setProfile(profileData)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      })

      return unsubscribe
    }

    handleAuthChange()

    const syncAuth = () => {
      const { user: storedUser, profile: storedProfile } = readLocalAuth()
      setUser(storedUser)
      setProfile(storedProfile)
      setLoading(false)
    }

    window.addEventListener('scms-auth-change', syncAuth)
    return () => window.removeEventListener('scms-auth-change', syncAuth)
  }, [])

  const value = useMemo(() => ({ user, profile, loading }), [user, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
