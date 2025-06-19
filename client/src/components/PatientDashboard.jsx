// PatientDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientDashboard.css';
import PatientSidebar from "./PatientSidebar";
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();



  return (
    <div className="dashboard-container">
      <PatientSidebar/>

      <div className="dashboard-content"  style={{ paddingBottom: "50px" }}>
        <Outlet>Welcome to your Patient Dashboard</Outlet>
        <p>You can now browse doctors, book appointments, and manage your medical profile.</p>
      </div>
      <Footer/>
    </div>
    
  );
};

export default PatientDashboard;

