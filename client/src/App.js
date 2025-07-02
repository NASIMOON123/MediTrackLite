import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeToggle from './components/ThemeToggle';
// General Pages & Components
import HomePage from './components/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import DoctorsPage from './components/PatientDoctors';
import PatientDashboard from './components/PatientDashboard';
import PendingAppointments from './components/PendingAppointments';
import { useLocation } from 'react-router-dom';

import BookAppointmentPage from './components/BookAppointmentPage';
import DoctorDashboardLayout from './components/DoctorDashboardLayout';
// Admin Pages
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import DoctorAnalytics from './components/DoctorAnalytics';
// Doctor Dashboard Layout & Components

import PatientDoctors from './components/PatientDoctors';

import ApprovalStatus from './components/ApprovalStatus';
import DoctorFeedbackSummary from './components/DoctorFeedbackSummary';
import PatientAppointments from './components/PatientAppointments';
import DoctorAppointments from './components/DoctorAppointments';
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import Chatbot from './components/Chatbot'; 

import PaymentPage from './components/PaymentPage';


// Removed ProtectedRoute import

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const pathname = window.location.pathname;
  const isDashboard = pathname.includes('/admin/dashboard') || pathname.includes('/doctor-dashboard/doctor-profile')  || pathname.includes('/doctor-dashboard/doctor-feedback') || pathname.includes('/doctor-dashboard/appointments') || pathname.includes('/doctor-dashboard/my-appointments') || pathname.includes('/doctor-dashboard/analytics') || pathname.includes('/doctor-dashboard/approval-status')|| pathname.includes('/doctor-dashboard') || pathname.includes('/patient-dashboard/doctors')|| pathname.includes('/patient-dashboard/appointments')|| pathname.includes('/patient-dashboard');
  

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />

    {!isDashboard && <ThemeToggle />}

  

      <Chatbot />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm onLogin={setUser} />} />
        <Route path="/doctors" element={<div className="min-h-screen bg-gray-50"><DoctorsPage /></div>} />
        <Route path="/appointment/:id" element={<BookAppointmentPage />} />
        <Route path="/doctors/approved" element={<PatientDoctors user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />


        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Patient Routes */}
        <Route path="/patient-dashboard" element={<PatientDashboard user={user} />} />
        
        <Route path="/patient-profile" element={<PatientProfile user={user} />} />


        <Route path="/patient-dashboard" element={<PatientDashboard user={user} />}>
        <Route index element={<PatientProfile user={user} />} />
        <Route path="profile" element={<PatientProfile user={user} />} />
        <Route path="appointments" element={<PatientAppointments user={user} />} />
        <Route path="doctors" element={<PatientDoctors user={user} />} />

        <Route path="payment" element={<PaymentPage />} />
      

      </Route>

        {/* Doctor Routes */}
        
        <Route path="/doctor-dashboard" element={<DoctorDashboardLayout user={user} />} >
  <Route path="doctor-profile" element={<DoctorProfile user={user} />} />
  <Route path="appointments" element={<PendingAppointments user={user} />} />
  <Route path="my-appointments" element={<DoctorAppointments user={user} />} />
 <Route path="doctor-feedback" element={<DoctorFeedbackSummary/>}/>
  <Route path="approval-status" element={<ApprovalStatus user={user} />} />
  <Route path="appointments/status/patient" element={<PatientAppointments user={user} />} />
     <Route path="/doctor-dashboard/analytics" element={<DoctorAnalytics />} />
</Route>


        {/* Fallback Route */}
        <Route path="*" element={<LoginForm onLogin={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
