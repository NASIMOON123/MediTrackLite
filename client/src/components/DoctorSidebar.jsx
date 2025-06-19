import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, CalendarDays, Bell, ClipboardList, CheckCircle } from 'lucide-react';
import './DoctorSidebar.css';

const DoctorSidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Profile', icon: <User className="sidebar-icon" />, path: "/doctor-dashboard/doctor-profile" },
    { label: 'Pending Appointments', icon: <ClipboardList className="sidebar-icon" />, path: '/doctor-dashboard/appointments' },
    { label: 'My Appointments', icon: <ClipboardList className="sidebar-icon" />, path: '/doctor-dashboard/my-appointments' },
    { label: 'Availability', icon: <CalendarDays className="sidebar-icon" />, path: '/doctor-dashboard/availability' },
    { label: 'Patient History', icon: <ClipboardList className="sidebar-icon" />, path: '/doctor-dashboard/history' },
    { label: 'Approval Status', icon: <CheckCircle className="sidebar-icon" />, path: '/doctor-dashboard/approval-status' },
    { label: 'Notifications', icon: <Bell className="sidebar-icon" />, path: '/doctor-dashboard/notifications' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">MediTrackLite</div>
      <nav>
        {navItems.map(({ label, icon, path }) => (
          <NavLink
            to={path}
            key={label}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default DoctorSidebar;
