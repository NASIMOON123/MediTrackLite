import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import '../css/AdminDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import ThemeToggle from "./ThemeToggle.jsx";

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
  const [feedbackRequests, setFeedbackRequests] = useState([]);


  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [statsRes, appointmentsRes, specializationsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/analytics/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/analytics/appointments-over-time`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/analytics/doctor-specializations`, { headers: { Authorization: `Bearer ${token}` } }),
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
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/doctors`, {
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
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/admin/approve-doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Doctor approved!');
      fetchDoctors();
    } catch (error) {
      toast.error('Approval failed');
    }
  };
   
  const handleDeactivate = async (doctorId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/deactivate-doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}` // if protected route
        },
      });
  
      if (response.ok) {
        toast.success("Doctor deactivated");
        fetchDoctors(); // refresh list
      } else {
        toast.error("Failed to deactivate");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
    } else if (activeTab === 'requests') {
      fetchFeedbackRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFeedbackRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/delete-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbackRequests(res.data);
    } catch (err) {
      toast.error('Failed to fetch deletion requests');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Feedback deleted');
      setFeedbackRequests(prev => prev.filter(fb => fb._id !== id));
    } catch (err) {
      toast.error('Error deleting feedback');
    }
  };

  const renderTable = (doctorList) => (
  <div className="responsive-table theme-card">
    <table>
      <thead className="text-adaptive">
        <tr>
          <th className="text-adaptive">Name</th>
          <th className="text-adaptive">Specialization</th>
          <th className="text-adaptive">Email</th>
          <th className="text-adaptive">Status</th>
          <th className="text-adaptive">Action</th>
        </tr>
      </thead>
      <tbody>
        {doctorList.map((doctor) => (
          <tr key={doctor._id}>
            <td data-label="Name" className="text-adaptive">{doctor.name}</td>
            <td data-label="Specialization">{doctor.specialization || 'N/A'}</td>
            <td data-label="Email">{doctor.email}</td>
            <td data-label="Status">
              {doctor.isApproved ? (
                <span className="approved">✅ Approved</span>
              ) : (
                <span className="not-approved">❌ Pending</span>
              )}
            </td>
            <td data-label="Action">
              {doctor.isApproved ? (
                <button className="deactivate-btn" onClick={() => handleDeactivate(doctor._id)}>
                  Deactivate
                </button>
              ) : (
                <button className="approve-btn" onClick={() => handleApprove(doctor._id)}>
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
    const renderAnalytics = () => {
    if (!stats) return <p>Loading analytics...</p>;

    return (
      <div className="analytics-container theme-card">
        <div className="stats-cards theme-adaptive">
          <div className="card grey-card">
            <h3 className="text-adaptive">Total Patients</h3>
            <p className="text-adaptive">{stats.totalPatients}</p>
          </div>
          <div className="card grey-card">
            <h3 className="text-adaptive">Total Doctors</h3>
            <p className="text-adaptive">{stats.totalDoctors}</p>
          </div>
          <div className="card grey-card">
            <h3 className="text-adaptive">Total Appointments</h3>
            <p className="text-adaptive">{stats.totalAppointments}</p>
          </div>
          <div className="card grey-card">
  <h3 className="text-adaptive">Approved Doctors</h3>
  <p className="text-adaptive" >{stats.approvedDoctors}</p>
</div>
<div className="card grey-card">
  <h3 className="text-adaptive">Not Approved Doctors</h3>
  <p className="text-adaptive">{stats.notApprovedDoctors}</p>
</div>
          <div className="card grey-card">
            <h3 className="text-adaptive">Average Rating</h3>
            <p className="text-adaptive">{stats.avgRating.toFixed(1)} ★</p>
          </div>
        </div>

        <div className="charts-row theme-card">
          <div className="chart-container grey-card">
            <h4 className="text-adaptive">Appointments Over Time</h4>
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

          <div className="chart-container grey-card">
            <h4 className="text-adaptive">Doctor Specializations</h4>
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

  const renderRequests = () => (
    <div className="container mt-3 theme-card">
      <h3 className="mb-4 text-adaptive">Requested Feedback Deletions</h3>
      {feedbackRequests.length === 0 ? (
        <p className="text-muted text-adaptive">No deletion requests.</p>
      ) : (
        <div className="row">
          {feedbackRequests.map((fb, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card shadow-sm h-100 grey-card">
                <div className="card-body grey-card">
                  <h5 className="card-title mb-2 text-primary">
                    {fb.doctorId?.name || 'Unknown Doctor'}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted text-adaptive">Patient: {fb.patientId?.name || 'Unknown'}</h6>
                  <p className="fst-italic text-adaptive">"{fb.comment}"</p>
                  <p className="text-muted text-adaptive">{new Date(fb.createdAt).toLocaleString()}</p>
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDeleteFeedback(fb._id)}
                  >
                    Delete Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  const [allFeedbacks, setAllFeedbacks] = useState([]);

const fetchAllFeedbacks = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/analytics/all-feedbacks`, {
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


const renderFeedback = () => {
  if (!allFeedbacks || allFeedbacks.length === 0) {
    return <p className="text-muted text-center">No feedbacks available</p>;
  }

  return (
    <div className="container mt-3 theme-card">
      <h3 className="mb-4 text-adaptive">All Feedbacks </h3>
      <div className="row">
        {allFeedbacks.map((fb, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card shadow-sm h-100 grey-card" >
              <div className="card-body grey-card">
                {/* Doctor Info */}
                <h5 className="card-title mb-2 text-primary">
                  {fb.doctorName} <small className="text-muted text-adaptive">({fb.specialization})</small>
                </h5>

                {/* Patient Info */}
                <h6 className="card-subtitle mb-2 text-muted text-adaptive">Patient: {fb.patientName}</h6>

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
                    className="card-text fst-italic text-dark text-adaptive"
                    style={{ fontSize: '0.95rem' }}
                  >
                    "{fb.comment}"
                  </p>
                )}

                {/* Date */}
                <p
                  className="text-muted mt-2 text-adaptive"
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
    <div className="admin-dashboard-layout ">
      <div className="mobile-header">
        <FaBars className="menu-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div ref={sidebarRef} className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>MediTrack Admin</h2>
        <button className={activeTab === 'pending' ? 'active-tab' : ''} onClick={() => { setActiveTab('pending'); setIsSidebarOpen(false); }}>Pending Doctors</button>
        <button className={activeTab === 'approved' ? 'active-tab' : ''} onClick={() => { setActiveTab('approved'); setIsSidebarOpen(false); }}>Approved Doctors</button>
        <button className={activeTab === 'analytics' ? 'active-tab' : ''} onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}>Analytics</button>
        <button className={activeTab === 'feedback' ? 'active-tab' : ''} onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }}>Feedback & Ratings</button>
        <button className={activeTab === 'requests' ? 'active-tab' : ''} onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }}>Requests for Deletion</button>
          <div className="theme-toggle-wrapper mt-3 mb-3">
          <ThemeToggle />
          </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-dashboard-content">
        {activeTab === 'pending' && renderTable(pendingDoctors)}
        {activeTab === 'approved' && renderTable(approvedDoctors)}
        {activeTab === 'analytics' && renderAnalytics()}
         {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'requests' && renderRequests()}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;
