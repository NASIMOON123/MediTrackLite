import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to fetch pending appointments');
      }
    };

    fetchPendingAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/appointments/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update status');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">Pending Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center text-muted">No pending appointments</p>
      ) : (
        <div className="row justify-content-center g-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
            >
              <div
                className="card shadow-sm h-100"
                style={{ width: '340px', borderRadius: '12px' }}
              >
                <div className="card-body p-3">
                  <h6 className="fw-bold text-dark mb-2">{appointment.patientName}</h6>
                  <div className="small text-muted mb-2" style={{ lineHeight: '1.5' }}>
                    <div><strong>Email:</strong> {appointment.email}</div>
                    <div><strong>Date:</strong> {appointment.date}</div>
                    <div><strong>Time:</strong> {appointment.time}</div>
                    <div><strong>Phone:</strong> {appointment.phone}</div>
                    <div><strong>Symptoms:</strong> {appointment.symptoms}</div>
                    <div><strong>Gender:</strong> {appointment.gender}</div>
                  </div>
                  <span className="badge bg-warning text-dark">{appointment.status}</span>
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(appointment._id, 'Approved')}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(appointment._id, 'Rejected')}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAppointments;
