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
  <div className="responsive-table">
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

  const renderRequests = () => (
    <div className="container mt-3">
      <h3 className="mb-4">Requested Feedback Deletions</h3>
      {feedbackRequests.length === 0 ? (
        <p className="text-muted">No deletion requests.</p>
      ) : (
        <div className="row">
          {feedbackRequests.map((fb, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title mb-2 text-primary">
                    {fb.doctorId?.name || 'Unknown Doctor'}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">Patient: {fb.patientId?.name || 'Unknown'}</h6>
                  <p className="fst-italic">"{fb.comment}"</p>
                  <p className="text-muted">{new Date(fb.createdAt).toLocaleString()}</p>
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
    <div className="container mt-4">
      <h3 className="mb-4">All Feedback & Ratings</h3>
      <div className="row">
        {allFeedbacks.map((fb, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">{fb.doctorId?.name || 'Doctor'}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Patient: {fb.patientId?.name || 'Patient'}</h6>
                <p className="card-text">"{fb.comment}"</p>
                <p className="text-warning fw-bold">Rating: {fb.rating} ★</p>
                <p className="text-muted">{new Date(fb.createdAt).toLocaleString()}</p>
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
