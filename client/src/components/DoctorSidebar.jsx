import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User, BarChart, MessageSquare, ClipboardList, CheckCircle, Menu,
} from 'lucide-react';
import '../css/DoctorSidebar.css';

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Profile', icon: <User className="ds-icon" />, path: '/doctor-dashboard/doctor-profile' },
    { label: 'Feedback', icon: <MessageSquare className="ds-icon" />, path: '/doctor-dashboard/doctor-feedback' },
    { label: 'Pending Appointments', icon: <ClipboardList className="ds-icon" />, path: '/doctor-dashboard/appointments' },
    { label: 'My Appointments', icon: <ClipboardList className="ds-icon" />, path: '/doctor-dashboard/my-appointments' },
    { label: 'Analytics', icon: <BarChart className="ds-icon" />, path: '/doctor-dashboard/analytics' },
    { label: 'Approval Status', icon: <CheckCircle className="ds-icon" />, path: '/doctor-dashboard/approval-status' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* ✅ Mobile Header */}
      <div className="ds-mobile-header">
        <button className="ds-hamburger" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>
        <div className="ds-brand-name">MediTrack Lite</div>
      </div>

      {/* ✅ Sidebar */}
      <div className={`ds-sidebar ${isOpen ? 'ds-open' : ''}`}>
        <div className="ds-sidebar-header">MediTrackLite</div>
        <nav className="ds-nav">
          {navItems.map(({ label, icon, path }) => (
            <NavLink
              to={path}
              key={label}
              className={({ isActive }) => `ds-navlink ${isActive ? 'ds-active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="ds-sidebar-footer">
          <button className="ds-logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ✅ Overlay */}
      {isOpen && <div className="ds-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default DoctorSidebar;
