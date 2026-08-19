import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../firebase/client'

const complaintsRef = collection(db, 'complaints')

export async function uploadAttachment(file, studentId) {
  if (!studentId) throw new Error('uploadAttachment requires the current user\'s uid')
  const storageRef = ref(storage, `complaint-attachments/${studentId}/${Date.now()}-${file.name}`)
  const snapshot = await uploadBytesResumable(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export async function createComplaint(data) {
  const complaintDoc = await addDoc(complaintsRef, {
    ...data,
    status: 'Pending',
    resolutionNote: null,
    assignedDepartment: data.department,
    attachmentName: data.attachmentName ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return complaintDoc.id
}

export async function getComplaintById(complaintId) {
  const docRef = doc(db, 'complaints', complaintId)
  const complaintSnap = await getDoc(docRef)
  return complaintSnap.exists() ? { id: complaintSnap.id, ...complaintSnap.data() } : null
}

export async function addComplaintEvent(complaintId, event) {
  const eventsRef = collection(doc(db, 'complaints', complaintId), 'events')
  const evt = await addDoc(eventsRef, {
    ...event,
    createdAt: serverTimestamp()
  })
  return evt.id
}

export async function fetchComplaintEvents(complaintId) {
  const eventsRef = collection(doc(db, 'complaints', complaintId), 'events')
  const q = query(eventsRef, orderBy('createdAt', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateComplaint(complaintId, updates) {
  const docRef = doc(db, 'complaints', complaintId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

export async function fetchComplaintsByStudent(studentId) {
  const q = query(complaintsRef, where('studentId', '==', studentId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function fetchAllComplaints() {
  const q = query(complaintsRef, orderBy('createdAt', 'desc'), limit(200))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function withdrawComplaint(complaintId) {
  const docRef = doc(db, 'complaints', complaintId)
  await updateDoc(docRef, {
    status: 'Withdrawn',
    updatedAt: serverTimestamp()
  })
}
