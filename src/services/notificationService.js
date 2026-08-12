import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/client'

const notificationsRef = collection(db, 'notifications')

export async function addNotification(notification) {
  await addDoc(notificationsRef, {
    ...notification,
    read: false,
    createdAt: serverTimestamp()
  })
}

export async function fetchUserNotifications(userId) {
  const q = query(notificationsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function markNotificationRead(notificationId) {
  const ref = doc(db, 'notifications', notificationId)
  await updateDoc(ref, { read: true })
}
