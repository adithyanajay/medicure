import React from 'react';
import './index.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './Admin/LoginScreen';
import AdminDashboard from './Admin/AdminDashboard';
import DoctorsScreen from './Admin/DoctorsScreen';
import AppointmentsScreen from './Admin/AppointmentsScreen';
import PatientsScreen from './Admin/PatientsScreen';
import DashboardLayout from './Admin/DashboardLayout';

function App() {
 // You can add authentication logic here
  const isAuthenticated = true; // This should be managed with your auth state

  return (
    <Router>
   
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            ) : (

              <DashboardLayout>
                   <h1></h1>
              <AdminDashboard />
            </DashboardLayout>
              // <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/doctors"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <DoctorsScreen />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <AppointmentsScreen />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/patients"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <PatientsScreen />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
  // return (
  //   <div>
  //     <h1 className='bg-red color text-xl font-bold underline'>Hello World</h1>
  //   </div>
  // );
}

export default App;