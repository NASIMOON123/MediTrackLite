// PatientDashboard.jsx
import React from 'react';
import '../css/PatientDashboard.css';
import PatientNavbar from "./PatientNavbar";

import { Outlet } from 'react-router-dom';

const PatientDashboard = () => {
  



  return (
    <div className="dashboard-container theme-card">
      <PatientNavbar/>

      <div className="dashboard-content"  style={{ paddingBottom: "50px" }}>
        <Outlet>Welcome to your Patient Dashboard</Outlet>
        {/* <p>You can now browse doctors, book appointments, and manage your medical profile.</p> */}
      </div>
     
    </div>
    
  );
};

export default PatientDashboard;

