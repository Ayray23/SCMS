import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/client'

const departmentsRef = collection(db, 'departments')
const facultiesRef = collection(db, 'faculties')

export async function fetchDepartments() {
  const q = query(departmentsRef, orderBy('name', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createDepartment(data) {
  const docRef = await addDoc(departmentsRef, { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

export async function updateDepartment(id, data) {
  await updateDoc(doc(db, 'departments', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteDepartment(id) {
  await deleteDoc(doc(db, 'departments', id))
}

export async function fetchFaculties() {
  const q = query(facultiesRef, orderBy('name', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createFaculty(data) {
  const docRef = await addDoc(facultiesRef, { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

export async function updateFaculty(id, data) {
  await updateDoc(doc(db, 'faculties', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteFaculty(id) {
  await deleteDoc(doc(db, 'faculties', id))
}
