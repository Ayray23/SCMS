import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/client'

const isFirebasePlaceholder = () => auth?.app?.options?.apiKey?.startsWith('REPLACE')

// Default admin account baked into the codebase so a fresh deployment
// always has one admin login available with no extra setup steps. This
// account self-provisions the first time someone signs in with these
// exact credentials (see loginStudent below) - it doesn't need to be
// pre-created in Firebase Console.
// NOTE: this file ships to the browser, so these values are visible to
// anyone who inspects the built app. Change them if that's a concern.
export const DEFAULT_ADMIN_EMAIL = 'admin@scms.local'
export const DEFAULT_ADMIN_PASSWORD = 'Admin@12345'

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

  try {
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
  } catch (err) {
    // The Auth account exists but the profile write failed - don't leave an
    // orphaned account with no profile behind (that later logs in but has
    // nothing to show). Delete the just-created Auth user so the person can
    // retry cleanly, and surface a clear reason instead of a generic error.
    console.error('Failed to create user profile document', err)
    try {
      await result.user.delete()
    } catch (deleteErr) {
      console.error('Failed to roll back Auth user after profile write failure', deleteErr)
    }
    if (err.code === 'permission-denied') {
      throw new Error('Registration failed: the database rejected the write. Firestore security rules may not be deployed yet - contact the system administrator.')
    }
    if (err.code === 'unavailable' || err.message?.includes('does not exist')) {
      throw new Error('Registration failed: the database is not set up yet. Firestore may not be enabled for this project - contact the system administrator.')
    }
    throw new Error('Registration failed while saving your profile. Please try again.')
  }

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

  let result
  try {
    result = await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    // Self-provision the built-in default admin account the first time
    // someone signs in with those exact credentials, so it works out of
    // the box without a manual setup step.
    const isDefaultAdminAttempt = email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD
    const accountMissing = err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential'
    if (!isDefaultAdminAttempt || !accountMissing) {
      throw err
    }
    result = await createUserWithEmailAndPassword(auth, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD)
    await updateProfile(result.user, { displayName: 'System Administrator' })
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      fullName: 'System Administrator',
      email: DEFAULT_ADMIN_EMAIL,
      role: 'admin',
      status: 'active',
      matricNumber: null,
      department: null,
      faculty: null,
      level: null,
      profileImage: null,
      createdAt: serverTimestamp()
    })
  }

  // Require verified email before allowing full access - except for the
  // built-in admin account, which has no real inbox to verify.
  if (!result.user.emailVerified && result.user.email !== DEFAULT_ADMIN_EMAIL) {
    throw new Error('Please verify your email address before logging in')
  }

  // Guard against an Auth account that has no matching users/{uid} profile
  // document (e.g. registration's Firestore write failed previously, before
  // the rollback above existed). Logging someone in with no profile leads to
  // a confusing "welcome back" that never actually goes anywhere, since every
  // page that depends on profile data has nothing to show.
  const profileSnap = await getDoc(doc(db, 'users', result.user.uid))
  if (!profileSnap.exists()) {
    await signOut(auth)
    throw new Error('Your account has no profile on record. Please register again, or contact an administrator if this persists.')
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

// Firebase requires a recent sign-in before allowing a password change.
// Re-authenticate with the current password first so updatePassword()
// doesn't fail with auth/requires-recent-login.
export async function changePassword(currentPassword, newPassword) {
  if (isFirebasePlaceholder()) {
    return
  }
  if (!auth.currentUser || !auth.currentUser.email) throw new Error('No authenticated user')
  const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
  await reauthenticateWithCredential(auth.currentUser, credential)
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
