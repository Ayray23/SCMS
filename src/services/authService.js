import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/client'

const isFirebasePlaceholder = () => auth?.app?.options?.apiKey?.startsWith('REPLACE')

function dispatchAuthChange() {
  window.dispatchEvent(new Event('scms-auth-change'))
}

export async function registerStudent(userData) {
  const { fullName, email, password, matricNumber, department, faculty, level, role } = userData

  if (isFirebasePlaceholder()) {
    const localUser = {
      uid: 'local-user',
      email,
      displayName: fullName,
      emailVerified: true,
    }
    const localProfile = {
      uid: 'local-user',
      email,
      fullName,
      matricNumber,
      department,
      faculty,
      level,
      role,
      profileImage: null,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('scms-user', JSON.stringify(localUser))
    localStorage.setItem('scms-profile', JSON.stringify(localProfile))
    dispatchAuthChange()
    return localUser
  }

  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName: fullName })
  // Send verification email so users confirm their address before using the system
  try {
    await sendEmailVerification(result.user)
  } catch (err) {
    // non-fatal: continue registration even if email sending fails
    console.warn('Failed to send verification email', err)
  }
  await setDoc(doc(db, 'users', result.user.uid), {
    uid: result.user.uid,
    fullName,
    matricNumber,
    email,
    department,
    faculty,
    level,
    role,
    profileImage: null,
    status: 'active',
    createdAt: serverTimestamp()
  })
  return result.user
}

export async function loginStudent(email, password) {
  if (isFirebasePlaceholder()) {
    const localUser = {
      uid: 'local-user',
      email,
      displayName: 'Local User',
      emailVerified: true,
    }
    const localProfile = {
      uid: 'local-user',
      email,
      fullName: 'Local User',
      role: 'student',
      profileImage: null,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('scms-user', JSON.stringify(localUser))
    localStorage.setItem('scms-profile', JSON.stringify(localProfile))
    dispatchAuthChange()
    return localUser
  }

  const result = await signInWithEmailAndPassword(auth, email, password)
  // Require verified email before allowing full access
  if (!result.user.emailVerified) {
    throw new Error('Please verify your email address before logging in')
  }
  return result.user
}

export async function logoutStudent() {
  if (isFirebasePlaceholder()) {
    localStorage.removeItem('scms-user')
    localStorage.removeItem('scms-profile')
    dispatchAuthChange()
    return
  }

  await signOut(auth)
}

export async function sendPasswordReset(email) {
  if (isFirebasePlaceholder()) {
    return
  }
  await sendPasswordResetEmail(auth, email)
}

export async function updateUserPassword(newPassword) {
  if (isFirebasePlaceholder()) {
    return
  }
  if (!auth.currentUser) throw new Error('No authenticated user')
  await updatePassword(auth.currentUser, newPassword)
}

export async function updateUserProfile(updates) {
  if (isFirebasePlaceholder()) {
    const storedProfile = localStorage.getItem('scms-profile')
    if (!storedProfile) throw new Error('No local user profile')
    const profile = JSON.parse(storedProfile)
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('scms-profile', JSON.stringify(updatedProfile))
    dispatchAuthChange()
    return
  }

  if (!auth.currentUser) throw new Error('No authenticated user')
  const userRef = doc(db, 'users', auth.currentUser.uid)
  if (updates.fullName || updates.profileImage) {
    await updateProfile(auth.currentUser, {
      displayName: updates.fullName ?? auth.currentUser.displayName,
      photoURL: updates.profileImage ?? auth.currentUser.photoURL
    })
  }
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}
