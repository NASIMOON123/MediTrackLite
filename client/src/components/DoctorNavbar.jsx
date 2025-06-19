import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const DoctorNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="meditrack">MediTrack</span>
        <span className="lite">Lite</span>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
        <Link to="/appointments" onClick={() => setMenuOpen(false)}>Appointments</Link>
        <Link to="/availability" onClick={() => setMenuOpen(false)}>Availability</Link>
        <Link to="/patient-history" onClick={() => setMenuOpen(false)}>Patient History</Link>
        <Link to="/approvals" onClick={() => setMenuOpen(false)}>Approval Status</Link>
        <Link to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
        <button className="logout" onClick={() => {/* logout */}}>Logout</button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
