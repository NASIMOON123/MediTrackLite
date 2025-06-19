

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientAppointment.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPrescriptions, setOpenPrescriptions] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user || !user._id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const userId = user._id;

        const res = await axios.get(
          `http://localhost:5000/api/appointments/status/patient/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(res.data);
        setFilteredAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (a) => a.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setFilteredAppointments(filtered);
    }
  }, [statusFilter, appointments]);

  const togglePrescription = (id) => {
    setOpenPrescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const groupMedicinesByTiming = (medicines) => {
    const timings = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const grouped = {};
    timings.forEach(time => {
      grouped[time] = medicines.filter(
        (m) => m.timing?.toLowerCase() === time.toLowerCase()
      );
    });
    return grouped;
  };

  const handlePrint = (appointment) => {
    let medicineHTML = '';

    if (appointment.medicines?.length > 0) {
      const grouped = groupMedicinesByTiming(appointment.medicines);

      medicineHTML += '<strong>Medicines:</strong>';
      for (const timing in grouped) {
        if (grouped[timing].length > 0) {
          medicineHTML += `<p><u>${timing}:</u></p><ul>`;
          grouped[timing].forEach((med) => {
            medicineHTML += `<li><strong>${med.name}</strong> - ${med.dosage} (${med.frequency})</li>`;
          });
          medicineHTML += '</ul>';
        }
      }
    }

    const printContent = `
      <h3>Prescription Details</h3>
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Doctor:</strong> ${appointment.doctorId.name || appointment.doctorId}</p>
      <p><strong>Doctor's Notes:</strong> ${appointment.prescription || 'N/A'}</p>
      ${medicineHTML}
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<html><head><title>Prescription</title></head><body>${printContent}</body></html>`);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div style={{ marginLeft: '250px', padding: '20px' }}>
      <div className="container-fluid">
        <h2 className="mb-4 text-center">My Appointments</h2>

        {/* Status Filter */}
        <div className="mb-4 d-flex justify-content-center">
          <select
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading appointments...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-center">No appointments found.</p>
        ) : (
          <div className="row">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm" style={{ fontSize: '1rem' }}>
                  <div className="card-body py-2 px-3">
                    <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      <strong>Date:</strong> {appointment.date}<br />
                      <strong>Time:</strong> {appointment.time}<br />
                      <strong>Doctor:</strong> {appointment.doctorId.name || appointment.doctorId}<br />
                      <strong>Symptom:</strong> {appointment.symptoms || 'N/A'}<br />
                      <strong>Status:</strong>{' '}
                      <span className={
                        appointment.status === 'Approved'
                          ? 'badge bg-success'
                          : appointment.status === 'Rejected'
                          ? 'badge bg-danger'
                          : appointment.status === 'Completed'
                          ? 'badge bg-primary'
                          : 'badge bg-warning text-dark'
                      }>
                        {appointment.status}
                      </span><br />

                      {appointment.status === 'Completed' && (
                        <div className="mt-3">
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => togglePrescription(appointment._id)}
                          >
                            {openPrescriptions[appointment._id] ? 'Hide Prescription' : 'View Prescription'}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handlePrint(appointment)}
                          >
                            Download Prescription
                          </button>

                          {openPrescriptions[appointment._id] && (
                            <div className="border rounded p-3 mt-3 bg-light">
                              <p><strong>Doctor's Notes:</strong> {appointment.prescription || 'N/A'}</p>
                              {appointment.medicines?.length > 0 && (
                                <>
                                  <strong>Medicines:</strong>
                                  {Object.entries(groupMedicinesByTiming(appointment.medicines)).map(([timing, meds]) =>
                                    meds.length > 0 ? (
                                      <div key={timing}>
                                        <u>{timing}:</u>
                                        <ul>
                                          {meds.map((med, idx) => (
                                            <li key={idx}>
                                              <strong>{med.name}</strong> - {med.dosage} ({med.frequency})
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
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

export default PatientAppointments;