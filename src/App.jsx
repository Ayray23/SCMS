import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DarkModeProvider } from './context/DarkModeContext'
import RequireAuth from './routes/RequireAuth'
import AppShell from './components/layout/AppShell'

import AuthLogin from './pages/auth/Login'
import AuthRegister from './pages/auth/Register'
import AuthForgot from './pages/auth/Forgot'
import StudentDashboard from './pages/student/Dashboard'
import StudentNew from './pages/student/NewComplaint'
import StudentComplaints from './pages/student/Complaints'
import StudentComplaintDetail from './pages/student/ComplaintDetail'
import StudentProfile from './pages/Profile'
import StudentSettings from './pages/Settings'
import AdminProfile from './pages/Profile'
import AdminSettings from './pages/Settings'
import AdminDashboard from './pages/admin/Dashboard'
import AdminComplaints from './pages/admin/Complaints'
import AdminReports from './pages/admin/Reports'
import AdminDepartments from './pages/admin/Departments'
import AdminFaculties from './pages/admin/Faculties'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/forgot" element={<AuthForgot />} />

          <Route
            path="/student/*"
            element={
              <RequireAuth allowedRoles={["student"]}>
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="new" element={<StudentNew />} />
                    <Route path="complaints" element={<StudentComplaints />} />
                    <Route path="complaints/:id" element={<StudentComplaintDetail />} />
                     <Route path="profile" element={<StudentProfile />} />
                     <Route path="settings" element={<StudentSettings />} />
                  </Routes>
                </AppShell>
              </RequireAuth>
            }
          />

          <Route
            path="/admin/*"
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <AppShell>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="complaints" element={<AdminComplaints />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="departments" element={<AdminDepartments />} />
                    <Route path="faculties" element={<AdminFaculties />} />
                     <Route path="profile" element={<AdminProfile />} />
                     <Route path="settings" element={<AdminSettings />} />
                  </Routes>
                </AppShell>
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  )
}
