import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../css/DoctorAppointments.css';
import { FaTimes } from 'react-icons/fa';
import '../css/themes.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Approved');
  const [editId, setEditId] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', timing: '' }]);
  const [visiblePrescriptions, setVisiblePrescriptions] = useState({});
  const [counts, setCounts] = useState({ Approved: 0, 'In Progress': 0, Completed: 0 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointmentsByStatus(statusFilter);
    fetchAllCounts();
  }, [statusFilter]);

  const fetchAppointmentsByStatus = async (status) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/appointments/status/${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch {
      setError('Failed to fetch appointments.');
      setAppointments([]);
    }
  };

  const fetchAllCounts = async () => {
    try {
      const statuses = ['Approved', 'In Progress', 'Completed'];
      const newCounts = {};
      for (const status of statuses) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/appointments/status/${status}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        newCounts[status] = res.data.length;
      }
      setCounts(newCounts);
    } catch {
      setCounts({ Approved: 0, 'In Progress': 0, Completed: 0 });
    }
  };

  const getTimingOptions = (frequency) => {
    switch (frequency) {
      case 'Once daily (OD)': return ['Morning', 'Afternoon', 'Evening'];
      case 'Twice daily (BD)': return ['Morning & Evening'];
      case 'Three times daily (TID)': return ['Morning, Afternoon & Evening'];
      default: return [];
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    if (field === 'frequency') updated[index].timing = '';
    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', timing: '' }]);
  };

  const removeMedicineRow = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const togglePrescriptionVisibility = (id) => {
    setVisiblePrescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const updateData = newStatus === 'Completed'
        ? { status: newStatus, prescription, medicines }
        : { status: newStatus };

      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/appointments/status/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAppointmentsByStatus(statusFilter);
      fetchAllCounts();
      setEditId(null);
      setPrescription('');
      setMedicines([{ name: '', dosage: '', frequency: '', timing: '' }]);

      toast.success(newStatus === 'Completed' ? "Prescription added!" : "Status updated!");
    } catch (err) {
  const msg = err.response?.data?.message || 'Failed to update appointment.';
  toast.error(msg);


    } finally {
      setLoading(false);
    }
  };

  const requestDelete = async (feedbackId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/feedback/request-delete/${feedbackId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Deletion request sent');
    } catch {
      toast.error('Failed to request deletion');
    }
  };

  return (
    <div className="appointment-card">

    <div className="doctor-container appointment-card">
      <h1 className="title appointment-card">My Appointments</h1>
      <div className="filters appointment-card">
        {['Approved', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            className={`filter-btn  ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          
          >
            {status} <span className="badge">{counts[status]}</span>
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="appointments ">
        {appointments.length === 0 ? (
          <p className="no-appointments">No {statusFilter.toLowerCase()} appointments.</p>
        ) : (
          appointments.map((app) => (
            <div key={app._id} className="card theme-card">
              <p className="text-adaptive"><strong>Patient:</strong> {app.patientName}</p>
              <p className="text-adaptive"><strong>Symptoms:</strong> {app.symptoms}</p>
              <p className="text-adaptive"><strong>Date:</strong> {app.date}</p>
              <p className="text-adaptive"><strong>Date:</strong> {app.date}</p>
              <p className="text-adaptive"><strong>Time:</strong> {app.time}</p>
              <p className="text-adaptive"><strong>Status:</strong> <span className={`status ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span></p>

              {statusFilter === 'Approved' && (() => {
                const appointmentDateTime = new Date(`${app.date} ${app.time}`);
                const currentTime = new Date();

                const canStart = currentTime >= appointmentDateTime;

                return (
                  <button
                    onClick={() => updateStatus(app._id, 'In Progress')}
                    disabled={!canStart || loading}
                    title={!canStart ? 'You can only start treatment at or after the appointment time' : ''}
                  >
                    Start Treatment
                  </button>
                );
              })()}


              {statusFilter === 'In Progress' && editId !== app._id && (
                <button onClick={() => setEditId(app._id)}>Add Prescription</button>
              )}

              {editId === app._id && (
                <div className="prescription-box theme-card">
                  <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} className="theme-card" placeholder="Write prescription..." rows={3} />
                  {medicines.map((med, i) => (
                    <div key={i} className="med-block theme-card">
                      <input
                        type="text"
                        placeholder="Name"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(i, 'name', e.target.value)}
                        className="med-input"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(i, 'dosage', e.target.value)}
                        className="med-input"
                      />
                      <div className="med-row">
                        <select
                          value={med.frequency}
                          className="theme-card"
                          onChange={(e) => handleMedicineChange(i, 'frequency', e.target.value)}
                        >
                          <option value="">Freq</option>
                          <option>Once daily (OD)</option>
                          <option>Twice daily (BD)</option>
                          <option>Three times daily (TID)</option>
                        </select>
                        <select
                          value={med.timing}
                          className="theme-card"
                          onChange={(e) => handleMedicineChange(i, 'timing', e.target.value)}
                        >
                          <option value="">Timing</option>
                          {getTimingOptions(med.frequency).map((opt, idx) => (
                            <option key={idx}>{opt}</option>
                          ))}
                        </select>
                        {medicines.length > 1 && (
                          <button onClick={() => removeMedicineRow(i)} className="remove-med" title="Remove medicine">
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="add-med" onClick={addMedicineRow}>+ Add Medicine</button>
                  <button className="submit-btn" onClick={() => updateStatus(app._id, 'Completed')} disabled={!prescription.trim()}>Complete</button>
                  <button className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              )}

              {statusFilter === 'Completed' && (
                <>
                  <button className="toggle-prescription" onClick={() => togglePrescriptionVisibility(app._id)}>
                    {visiblePrescriptions[app._id] ? 'Hide Prescription' : 'Show Prescription'}
                  </button>
                  {visiblePrescriptions[app._id] && (
                    <div className="prescription-show theme-card">
                      <p className="text-adaptive"><strong className="text-adaptive">Prescription:</strong> {app.prescription}</p>
                      <ul>
                        {app.medicines?.map((m, i) => (
                          <li key={i}>{m.name} - {m.dosage} ({m.frequency}, {m.timing})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default DoctorAppointments;
