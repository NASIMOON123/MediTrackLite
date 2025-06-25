import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, CalendarDays, HeartPulse, LogOut, Menu } from 'lucide-react';
import '../css/navbar.css';

const PatientNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Profile', icon: <User className="sidebar-icon" />, path: "/patient-dashboard/profile" },
    { label: 'Appointments', icon: <CalendarDays className="sidebar-icon" />, path: '/patient-dashboard/appointments' },
    { label: 'My Doctors', icon: <HeartPulse className="sidebar-icon" />, path: '/patient-dashboard/doctors' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`patient-sidebar ${menuOpen ? 'expanded' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">MediTrack<span>Lite</span></div>
        <button className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>
      </div>

      <nav className={`sidebar-nav ${menuOpen ? 'show' : ''}`}>
        {navItems.map(({ label, icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default PatientNavbar;
