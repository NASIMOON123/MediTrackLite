


// DoctorDashboardLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';

const DoctorDashboardLayout = () => {
  const location = useLocation();
  const isDashboardRoot = location.pathname === '/doctor-dashboard';

  return (
    <div className="flex">
      <DoctorSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
        {isDashboardRoot ? (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to your Doctor Dashboard</h2>
            <p className="text-gray-600">
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
