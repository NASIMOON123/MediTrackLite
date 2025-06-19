import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorAppointments.css';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Approved');
  const [editId, setEditId] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', timing: '' }]);

  const [counts, setCounts] = useState({
    Approved: 0,
    'In Progress': 0,
    Completed: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointmentsByStatus(statusFilter);
    fetchAllCounts();
  }, [statusFilter]);

  const fetchAppointmentsByStatus = async (status) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/status/${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
      setError('');
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
          `http://localhost:5000/api/appointments/status/${status}`,
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
      case 'Twice daily (BD)': return ['Morning & Evening', 'Before Meals', 'After Meals'];
      case 'Three times daily (TID)': return ['Morning, Afternoon & Evening'];
      case 'Every 8 hours': return ['6am, 2pm, 10pm'];
      case 'As needed (PRN)': return ['When pain occurs'];
      case 'Before meals (AC)': return ['15 mins before meals'];
      case 'After meals (PC)': return ['After meals'];
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

const updateStatus = async (id, newStatus) => {
  setError('');
  setLoading(true);
  try {
    const updateData = newStatus === 'Completed'
      ? {
          status: newStatus,
          prescription,
          medicines,
        }
      : { status: newStatus };

    await axios.patch(
      `http://localhost:5000/api/appointments/status/${id}`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAppointmentsByStatus(statusFilter);
    fetchAllCounts();
    setEditId(null);
    setPrescription('');
    setMedicines([{ name: '', dosage: '', frequency: '', timing: '' }]);
    toast.success("Prescription Added!");
  } catch {
    setError('Failed to update appointment.');
  }
  setLoading(false);
};


  return (
    <div className="doctor-appointments-container">
      <h1 className="title">My Appointments</h1>
      <h2 className="appointments-title">Appointments - {statusFilter}</h2>

      <div className="filter-buttons">
        {['Approved', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? 'active' : ''}
          >
            {status} Appointments <span className="badge">{counts[status] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      {appointments.length === 0 ? (
        <p className="no-appointments-msg">No {statusFilter.toLowerCase()} appointments.</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map((app) => (
            <div key={app._id} className="appointment-card">
              <p><strong>Patient Name:</strong> {app.patientName}</p>
              <p><strong>Symptoms:</strong> {app.symptoms}</p>
              <p><strong>Date:</strong> {app.date}</p>
              <p><strong>Time:</strong> {app.time}</p>
              <p><strong>Status:</strong> <span className={`status ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span></p>

              {statusFilter === 'Approved' && (
                <button disabled={loading} onClick={() => updateStatus(app._id, 'In Progress')}>Start Treatment</button>
              )}

              {statusFilter === 'In Progress' && editId !== app._id && (
                <button onClick={() => setEditId(app._id)}>Add Prescription & Complete</button>
              )}

              {editId === app._id && (
                <div className="prescription-form">
                  <textarea
                    placeholder="Prescription"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    rows={2}
                  />

                  <h4>Medicines</h4>
                  {medicines.map((med, index) => (
                    <div key={index} className="medicine-row">
                      <input type="text" placeholder="Name" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} />
                      <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} />
                      <select value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}>
                        <option value="">Select Frequency</option>
                        <option value="Once daily (OD)">Once daily (OD)</option>
                        <option value="Twice daily (BD)">Twice daily (BD)</option>
                        <option value="Three times daily (TID)">Three times daily (TID)</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="As needed (PRN)">As needed (PRN)</option>
                        <option value="Before meals (AC)">Before meals (AC)</option>
                        <option value="After meals (PC)">After meals (PC)</option>
                      </select>
                      <select value={med.timing} onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}>
                        <option value="">Select Timing</option>
                        {getTimingOptions(med.frequency).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {medicines.length > 1 && (
                        <button onClick={() => removeMedicineRow(index)}>Remove</button>
                      )}
                    </div>
                  ))}

                  <button onClick={addMedicineRow}>+ Add New Medicine</button>
                 <button onClick={() => updateStatus(app._id, 'Completed')} disabled={!prescription.trim()}>

                    Complete Appointment
                  </button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              )}

              {statusFilter === 'Completed' && (
                <>
                  <p><strong>Prescription:</strong> {app.prescription}</p>
                  {app.medicines?.length > 0 && (
                    <div>
                      <p><strong>Medicines:</strong></p>
                      <ul>
                        {app.medicines.map((m, i) => (
                          <li key={i}>{m.name} - {m.dosage} ({m.frequency}, {m.timing})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
