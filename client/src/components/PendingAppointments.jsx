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
        const res = await axios.get('http://localhost:5000/api/appointments/appointments', {
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
        `http://localhost:5000/api/appointments/update-status/${id}`,
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
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <div className="container-fluid">
        <h2 className="mb-4 text-center">Pending Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center">No pending appointments</p>
        ) : (
          <div className="row">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm" style={{ fontSize: '0.85rem' }}>
                  <div className="card-body py-2 px-3">
                    <h6 className="mb-1 fw-bold">{appointment.patientName}</h6>
                    <div style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                      <strong>Email:</strong> {appointment.email}<br />
                      <strong>Date:</strong> {appointment.date}<br/>
                       <strong>Time:</strong> {appointment.time}<br />
                      <strong>Phone:</strong> {appointment.phone}<br />
                      <strong>Symptoms:</strong> {appointment.symptoms}<br />
                      <strong>Gender:</strong> {appointment.gender}<br />
                      <strong>Status:</strong>{' '}
                      <span className="badge bg-warning text-dark">{appointment.status}</span>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button
                        className="btn btn-success btn-sm px-2 py-1"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleUpdateStatus(appointment._id, 'Approved')}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm px-2 py-1"
                        style={{ fontSize: '0.75rem' }}
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
    </div>
  );
};

export default PendingAppointments;

