import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaBars, FaUserCircle, FaBell } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/approve-doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Doctor approved!');
      fetchDoctors();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out!');
    setTimeout(() => navigate('/admin/login'), 1000);
  };

  const approvedDoctors = doctors.filter(doc => doc.isApproved);
  const pendingDoctors = doctors.filter(doc => !doc.isApproved);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderTable = (doctorList) => (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Specialization</th>
          <th>Email</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {doctorList.map((doctor) => (
          <tr key={doctor._id}>
            <td>{doctor.name}</td>
            <td>{doctor.specialization || 'N/A'}</td>
            <td>{doctor.email}</td>
            <td>
              {doctor.isApproved ? (
                <span className="approved">✅ Approved</span>
              ) : (
                <span className="not-approved">❌ Pending</span>
              )}
            </td>
            <td>
              {!doctor.isApproved && (
                <button className="approve-btn" onClick={() => handleApprove(doctor._id)}>
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="admin-dashboard-layout">
      {/* Hamburger icon for small screens */}
      <div className="mobile-header">
        <FaBars className="menu-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div
        ref={sidebarRef}
        className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
        <h2>MediTrack Admin</h2>
        <button
          className={activeTab === 'pending' ? 'active-tab' : ''}
          onClick={() => {
            setActiveTab('pending');
            setIsSidebarOpen(false);
          }}
        >
          Pending Doctors
        </button>
        <button
          className={activeTab === 'approved' ? 'active-tab' : ''}
          onClick={() => {
            setActiveTab('approved');
            setIsSidebarOpen(false);
          }}
        >
          Approved Doctors
        </button>
        <FaBell className="nav-icon" title="Notifications" />
        <FaUserCircle className="nav-icon" title="Admin Profile" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-dashboard-content">
        <div className="doctor-table">
          {activeTab === 'pending' ? renderTable(pendingDoctors) : renderTable(approvedDoctors)}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;
