

// // App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import React, { useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import HomePage from './components/HomePage';
// import RegisterForm from './components/RegisterForm';
// import LoginForm from './components/LoginForm';
// import DoctorProfile from './components/DoctorProfile';
// import PatientProfile from './components/PatientProfile';
// import DoctorsPage from './pages/PatientDoctors';
// import PatientDashboard from './components/PatientDashboard';
// import PendingAppointments from './components/PendingAppointments';
// import PatientPendingAppointments from './components/PatientPendingAppointments';

// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/AdminDashboard'; 
// import DoctorDashboardLayout from './components/DoctorDashboardLayout';
// import BookAppointmentPage from "./components/BookAppointmentPage";

// // Doctor Dashboard children components
// import PatientDoctors from './pages/PatientDoctors';
// import AppointmentList from './components/AppointmentList';
// import AvailabilityCalendar from './components/AvailabilityCalendar';
// import PatientHistory from './components/PatientHistory';
// import ApprovalStatus from './components/ApprovalStatus';
// import Notifications from './components/Notifications';
// import ProfileSettings from './components/ProfileSettings';
// import PatientAppointments from './components/PatientAppointments';
// import ProtectedRoute from './components/ProtectedRoute';







// function App() {
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Failed to parse user from localStorage:", error);
//       return null;
//     }
//   });
  
  

//   return (
//     <Router>
//       <ToastContainer position="top-center" autoClose={3000} />
//       <Routes>
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/login" element={<LoginForm onLogin={setUser} />} />
//         <Route path="/patient-profile" element={<PatientProfile user={user} />} />
//         <Route path="/doctors" element={<div className="min-h-screen bg-gray-50"><DoctorsPage /></div>} />
//         <Route path="/" element={<HomePage />} />
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />

//         <Route path="/patient-dashboard" element={<PatientDashboard user={user} />} />
       
//         <Route path= "/doctors/approved" element={<PatientDoctors user={user} />} />
//       <Route path="/appointments/pending/patient" element={<PatientPendingAppointments />} />
         
//       <Route path="/appointments/pending" element={<PendingAppointments />} />
//         <Route path="/appointment/:id" element={<BookAppointmentPage />} />

//         <Route path="/doctor-dashboard" element={<DoctorDashboardLayout />}>
//         <Route path="doctor-profile" element={<DoctorProfile user={user} />} />
//           <Route path="appointments/p" element={<AppointmentList />} />
//           <Route path="appointments" element={<PendingAppointments />} />
//           <Route path="availability" element={<AvailabilityCalendar />} />
//           <Route path="history" element={<PatientHistory />} />
//           <Route path="approval-status" element={<ApprovalStatus />} />
//           <Route path="appointments/status/patient" element={<PatientAppointments />} />
//           <Route path="notifications" element={<Notifications />} />
//           <Route path="settings" element={<ProfileSettings />} />


//         </Route>

//         {/* Catch-all route should be at the very bottom */}
//         <Route path="*" element={<LoginForm onLogin={setUser} />} />
      
//       </Routes>
//       <Route
//   path="/patient-dashboard"
//   element={
//     <ProtectedRoute user={user}>
//       <PatientDashboard user={user} />
//     </ProtectedRoute>
//   }
// />
// <Route
//   path="/doctor-dashboard/appointments/status/patient"
//   element={
//     <ProtectedRoute user={user}>
//       <PatientAppointments />
//     </ProtectedRoute>
//   }
// />
//     </Router>
    
//   );
// }

// export default App;





// App.jsx
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // General Pages & Components
// import HomePage from './components/HomePage';
// import RegisterForm from './components/RegisterForm';
// import LoginForm from './components/LoginForm';
// import DoctorProfile from './components/DoctorProfile';
// import PatientProfile from './components/PatientProfile';
// import DoctorsPage from './pages/PatientDoctors';
// import PatientDashboard from './components/PatientDashboard';
// import PendingAppointments from './components/PendingAppointments';
// import PatientPendingAppointments from './components/PatientPendingAppointments';
// import BookAppointmentPage from './components/BookAppointmentPage';
// import DoctorDashboardLayout from './components/DoctorDashboardLayout';
// // Admin Pages
// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/AdminDashboard';

// // Doctor Dashboard Layout & Components

// import PatientDoctors from './pages/PatientDoctors';
// import AppointmentList from './components/AppointmentList';
// import AvailabilityCalendar from './components/AvailabilityCalendar';
// import PatientHistory from './components/PatientHistory';
// import ApprovalStatus from './components/ApprovalStatus';
// import Notifications from './components/Notifications';
// import ProfileSettings from './components/ProfileSettings';
// import PatientAppointments from './components/PatientAppointments';

// // Protected Route
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   const [user, setUser] = useState(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Failed to parse user from localStorage:", error);
//       return null;
//     }
//   });

//   return (
//     <Router>
//       <ToastContainer position="top-center" autoClose={3000} />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/login" element={<LoginForm onLogin={setUser} />} />
//         <Route path="/doctors" element={<div className="min-h-screen bg-gray-50"><DoctorsPage /></div>} />
//         <Route path="/appointment/:id" element={<BookAppointmentPage />} />
//         <Route path="/doctors/approved" element={<PatientDoctors user={user} />} />
        

//         {/* Admin Routes */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />

//         {/* Protected Patient Routes */}
//         <Route
//           path="/patient-dashboard"
//           element={
//             <ProtectedRoute user={user}>
//               <PatientDashboard user={user} />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/appointments/pending/patient"
//           element={
//             <ProtectedRoute user={user}>
//               <PatientPendingAppointments />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/patient-profile"
//           element={
//             <ProtectedRoute user={user}>
//               <PatientProfile user={user} />
//             </ProtectedRoute>
//           }
//         />
//          <Route
//           path="/doctor-dashboard"
//           element={
//             <ProtectedRoute user={user}>
//               <DoctorDashboardLayout user={user} />
//             </ProtectedRoute>
//           }
//         />
        

//         {/* Protected Doctor Routes with Nested Dashboard */}
       
//           <Route path="doctor-profile" element={<DoctorProfile user={user} />} />
//           <Route path="appointments/p" element={<AppointmentList />} />
//           <Route path="appointments" element={<PendingAppointments />} />
//           <Route path="availability" element={<AvailabilityCalendar />} />
//           <Route path="history" element={<PatientHistory />} />
//           <Route path="approval-status" element={<ApprovalStatus />} />
//           <Route path="doctor-dashboard" element={<DoctorDashboardLayout />}/>
//           <Route path="appointments/status/patient" element={<PatientAppointments />} />
//           <Route path="notifications" element={<Notifications />} />
//           <Route path="settings" element={<ProfileSettings />} />
     
// { <Route path="pending-appointments" element={<PatientPendingAppointments user={user} />} />
// <Route path="/appointments/pending/patient" element={<PatientPendingAppointments user={user} />} />/ 
// //         {/* Fallback Route */}
// //         <Route path="*" element={<LoginForm onLogin={setUser} />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// General Pages & Components
import HomePage from './components/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import DoctorsPage from './pages/PatientDoctors';
import PatientDashboard from './components/PatientDashboard';
import PendingAppointments from './components/PendingAppointments';

import BookAppointmentPage from './components/BookAppointmentPage';
import DoctorDashboardLayout from './components/DoctorDashboardLayout';
// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Doctor Dashboard Layout & Components

import PatientDoctors from './pages/PatientDoctors';
import AppointmentList from './components/AppointmentList';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import PatientHistory from './components/PatientHistory';
import ApprovalStatus from './components/ApprovalStatus';
import Notifications from './components/Notifications';
import ProfileSettings from './components/ProfileSettings';
import PatientAppointments from './components/PatientAppointments';
import DoctorAppointments from './components/DoctorAppointments';
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';

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

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
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
      
      </Route>

        {/* Doctor Routes */}
        {/* <Route path="/doctor-dashboard" element={<DoctorDashboardLayout user={user} />} >
        <Route path="/doctor-profile" element={<DoctorProfile user={user} />} />
        <Route path="/appointments/p" element={<AppointmentList user={user} />} />
        <Route path="/appointments" element={<PendingAppointments user={user} />} />
        <Route path="/availability" element={<AvailabilityCalendar user={user} />} />
        <Route path="/history" element={<PatientHistory user={user} />} />
        <Route path="/approval-status" element={<ApprovalStatus user={user} />} />
        <Route path="/appointments/status/patient" element={<PatientAppointments user={user} />} />
        <Route path="/notifications" element={<Notifications user={user} />} />
        <Route path="/settings" element={<ProfileSettings user={user} />} />
        </Route> */}
        <Route path="/doctor-dashboard" element={<DoctorDashboardLayout user={user} />} >
  <Route path="doctor-profile" element={<DoctorProfile user={user} />} />
  <Route path="appointments/p" element={<AppointmentList user={user} />} />
  <Route path="appointments" element={<PendingAppointments user={user} />} />
  <Route path="my-appointments" element={<DoctorAppointments user={user} />} />
  <Route path="availability" element={<AvailabilityCalendar user={user} />} />
  <Route path="history" element={<PatientHistory user={user} />} />
  <Route path="approval-status" element={<ApprovalStatus user={user} />} />
  <Route path="appointments/status/patient" element={<PatientAppointments user={user} />} />
  <Route path="notifications" element={<Notifications user={user} />} />
  <Route path="settings" element={<ProfileSettings user={user} />} />
</Route>


        {/* Fallback Route */}
        <Route path="*" element={<LoginForm onLogin={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;