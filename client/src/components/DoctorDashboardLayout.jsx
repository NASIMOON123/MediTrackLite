import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import '../css/DoctorDashboardLayout.css';

const DoctorDashboardLayout = () => {
  const location = useLocation();
  const isDashboardRoot = location.pathname === '/doctor-dashboard';

  return (
    <div className="doctor-dashboard-layout">
     <DoctorSidebar />

      <main className="doctor-main">
        {isDashboardRoot ? (
          <div className="welcome-box">
            <h2>Welcome to your Doctor Dashboard</h2>
            <p>
              You can now manage your profile, appointments, availability, and review patient history.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default DoctorDashboardLayout;
