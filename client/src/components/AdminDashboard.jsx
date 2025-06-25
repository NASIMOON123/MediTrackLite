import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaBars, FaUserCircle, FaBell } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import '../css/AdminDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF5'];

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [stats, setStats] = useState(null);
  const [appointmentsOverTime, setAppointmentsOverTime] = useState([]);
  const [doctorSpecializations, setDoctorSpecializations] = useState([]);

  const backendURL = 'http://localhost:5000';

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [statsRes, appointmentsRes, specializationsRes] = await Promise.all([
        axios.get(`${backendURL}/api/admin/analytics/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendURL}/api/admin/analytics/appointments-over-time`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendURL}/api/admin/analytics/doctor-specializations`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setAppointmentsOverTime(appointmentsRes.data);
      setDoctorSpecializations(specializationsRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    }
  };
  
  

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
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

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
  <div className="responsive-table">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Specialization</th>
          <th>Email</th>
          <th>Status</th>
          {!doctorList.every(doc => doc.isApproved) && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {doctorList.map((doctor) => (
          <tr key={doctor._id}>
            <td data-label="Name">{doctor.name}</td>
            <td data-label="Specialization">{doctor.specialization || 'N/A'}</td>
            <td data-label="Email">{doctor.email}</td>
            <td data-label="Status">
              {doctor.isApproved ? (
                <span className="approved">✅ Approved</span>
              ) : (
                <span className="not-approved">❌ Pending</span>
              )}
            </td>
            {!doctor.isApproved && (
              <td data-label="Action">
                <button className="approve-btn" onClick={() => handleApprove(doctor._id)}>
                  Approve
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>

    </table>
  </div>
);


  const renderAnalytics = () => {
    if (!stats) return <p>Loading analytics...</p>;

    return (
      <div className="analytics-container">
        <div className="stats-cards">
          <div className="card">
            <h3>Total Patients</h3>
            <p>{stats.totalPatients}</p>
          </div>
          <div className="card">
            <h3>Total Doctors</h3>
            <p>{stats.totalDoctors}</p>
          </div>
          <div className="card">
            <h3>Total Appointments</h3>
            <p>{stats.totalAppointments}</p>
          </div>
          <div className="card">
  <h3>Approved Doctors</h3>
  <p>{stats.approvedDoctors}</p>
</div>
<div className="card">
  <h3>Not Approved Doctors</h3>
  <p>{stats.notApprovedDoctors}</p>
</div>
          <div className="card">
            <h3>Average Rating</h3>
            <p>{stats.avgRating.toFixed(1)} ★</p>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-container">
            <h4>Appointments Over Time</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={appointmentsOverTime}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Doctor Specializations</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={doctorSpecializations}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {doctorSpecializations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
const [allFeedbacks, setAllFeedbacks] = useState([]);

const fetchAllFeedbacks = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get('http://localhost:5000/api/admin/analytics/all-feedbacks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAllFeedbacks(res.data);
  } catch (err) {
    toast.error('Failed to fetch feedbacks');
  }
};

useEffect(() => {
  if (activeTab === 'feedback') {
    fetchAllFeedbacks();
  }
}, [activeTab]);

const renderStars = (count) => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`me-1`}
          style={{
            color: i < count ? '#FFD700' : '#dee2e6',
            fontSize: '18px'
          }}
        >
          ★
        </span>
      ))}
    </>
  );
};

const renderFeedback = () => {
  if (!allFeedbacks || allFeedbacks.length === 0) {
    return <p className="text-muted text-center">No feedbacks available</p>;
  }

  return (
    <div className="container mt-3">
      <h3 className="mb-4">All Feedbacks </h3>
      <div className="row">
        {allFeedbacks.map((fb, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                {/* Doctor Info */}
                <h5 className="card-title mb-2 text-primary">
                  {fb.doctorName} <small className="text-muted">({fb.specialization})</small>
                </h5>

                {/* Patient Info */}
                <h6 className="card-subtitle mb-2 text-muted">Patient: {fb.patientName}</h6>

                {/* Rating Stars */}
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < fb.rating ? '#FFD700' : '#ddd',
                        fontSize: '18px',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Comment only if exists */}
                {fb.comment && fb.comment.trim() !== '' && (
                  <p
                    className="card-text fst-italic text-dark"
                    style={{ fontSize: '0.95rem' }}
                  >
                    "{fb.comment}"
                  </p>
                )}

                {/* Date */}
                <p
                  className="text-muted mt-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




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
        <button
          className={activeTab === 'analytics' ? 'active-tab' : ''}
          onClick={() => {
            setActiveTab('analytics');
            setIsSidebarOpen(false);
          }}
        >
          Analytics
        </button>
      <button
       className={activeTab === 'feedback' ? 'active-tab' : ''} 
       onClick={() => { 
        setActiveTab('feedback');
         setIsSidebarOpen(false);
         }}>Feedback & Ratings
         </button>

       {/* <FaBell className="nav-icon" title="Notifications" />
       <FaUserCircle className="nav-icon" title="Admin Profile" /> */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
       </div>

      <div className="admin-dashboard-content">
        {activeTab === 'pending' && renderTable(pendingDoctors)}
         {activeTab === 'approved' && renderTable(approvedDoctors)}
        {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'feedback' && renderFeedback()}
      </div>

       <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;
