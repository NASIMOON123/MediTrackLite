

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/PatientAppointment.css';
import FeedbackModal from './FeedbackModal';
import { toast } from 'react-toastify';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPrescriptions, setOpenPrescriptions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});


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
          `${process.env.REACT_APP_API_BASE_URL}/api/appointments/status/patient/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(res.data);
        const completed = res.data.filter((a) => a.status === 'Completed');
        const feedbackMap = {};

        await Promise.all(
          completed.map(async (appt) => {
            try {
              const fbRes = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/feedback/appointment/${appt._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (fbRes.data?.comment || fbRes.data?.rating) {
                feedbackMap[appt._id] = {
                  _id: fbRes.data._id,
                  comment: fbRes.data.comment,
                  rating: fbRes.data.rating,
                  deleteRequested: fbRes.data.deleteRequested || false,
                };
              }
            } catch {
              feedbackMap[appt._id] = null;
            }
          })
        );

        setSubmittedFeedbacks(feedbackMap);
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
    timings.forEach((time) => {
      grouped[time] = medicines.filter(
        (m) => m.timing?.toLowerCase() === time.toLowerCase()
      );
    });
    return grouped;
  };

  const requestDelete = async (feedbackId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/feedback/request-delete/${feedbackId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success('Deletion request sent');
    setSubmittedFeedbacks((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        if (updated[key]?._id === feedbackId) {
          updated[key].deleteRequested = true;
        }
      }
      return updated;
    });
  } catch (err) {
    toast.error('Failed to request deletion');
  }
};


  const handlePrint = (appointment) => {
    let medicineHTML = '';
    if (appointment.medicines?.length > 0) {
      const grouped = groupMedicinesByTiming(appointment.medicines);
      medicineHTML += '<strong>Medicines:</strong>';
      Object.entries(grouped).forEach(([timing, meds]) => {
        if (meds.length > 0) {
          const medListHTML = meds
            .map(
              (med) =>
                `<li><strong>${med.name}</strong> - ${med.dosage} (${med.frequency})</li>`
            )
            .join('');
          medicineHTML += `<p><u>${timing}:</u></p><ul>${medListHTML}</ul>`;
        }
      });
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
    newWindow.document.write(
      `<html><head><title>Prescription</title></head><body>${printContent}</body></html>`
    );
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="patient-appointment-wrapper theme-card">
      <div className="container-fluid theme-card">
        <h2 className="mb-4 text-center text-adaptive">My Appointments</h2>

        <div className="mb-4 d-flex justify-content-center">
          <ul className="nav nav-tabs flex-wrap justify-content-center">
            {['All', 'Pending', 'Approved', 'In Progress', 'Rejected', 'Completed'].map(
              (status) => (
                <li className="nav-item" key={status}>
                  <button
                    className={`nav-link ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                </li>
              )
            )}
          </ul>
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
                <div className="card h-100 shadow-sm grey-card" style={{ fontSize: '1rem' }}>
                  <div className="card-body py-2 px-3 grey-card">
                    <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      <strong className='text-adaptive'>Date:</strong> {appointment.date}<br />
                      <strong className='text-adaptive'>Time:</strong> {appointment.time}<br />
                      <strong className='text-adaptive'>Doctor:</strong> {appointment.doctorId.name || appointment.doctorId}<br />
                      <strong className='text-adaptive'>Symptom:</strong> {appointment.symptoms || 'N/A'}<br />
                      <span className={`status-label ${appointment.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {appointment.status}
                      </span><br />

                      {appointment.status === 'Completed' && (
                        <div className="mt-3">
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => togglePrescription(appointment._id)}
                          >
                            {openPrescriptions[appointment._id]
                              ? 'Hide Prescription'
                              : 'View Prescription'}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handlePrint(appointment)}
                          >
                            Download Prescription
                          </button>

                          {!submittedFeedbacks[appointment._id] ? (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowModal(true);
                              }}
                            >
                              📝 Leave Feedback
                            </button>
                          ) : (
                            <span className="text-success small">
                              <br />You have already submitted feedback.
                            </span>
                          )}

                          {openPrescriptions[appointment._id] && (
                            <div className="border rounded p-3 mt-3 bg-light theme-card">
                              <p className="text-adaptive"><strong className="text-adaptive">Doctor's Notes:</strong> {appointment.prescription || 'N/A'}</p>
                              {appointment.medicines?.length > 0 && (
                                <>
                                  <strong className='text-adaptive'>Medicines:</strong>
                                  {Object.entries(groupMedicinesByTiming(appointment.medicines)).map(([timing, meds]) =>
                                    meds.length > 0 ? (
                                      <div key={timing}>
                                        <u>{timing}:</u>
                                        <ul>
                                          {meds.map((med, idx) => (
                                            <li key={idx}>
                                              <strong className='text-adaptive'>{med.name}</strong> - {med.dosage} ({med.frequency})
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

                          {submittedFeedbacks[appointment._id] && (
                          <div className="feedback-box mt-3 theme-card">
                            <strong className='text-adaptive'>Feedback:</strong>
                            <p className="fst-italic mb-1 text-adaptive">
                              {submittedFeedbacks[appointment._id].comment
                                ? submittedFeedbacks[appointment._id].comment
                                : <span className="text-muted">No feedback submitted</span>}
                            </p>

                            <div className="stars mb-0">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < submittedFeedbacks[appointment._id].rating ? 'star filled' : 'star'
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>

                            {!submittedFeedbacks[appointment._id].deleteRequested ? (
                              <button
                                className="btn btn-sm btn-outline-danger mt-2"
                                onClick={() =>
                                  requestDelete(submittedFeedbacks[appointment._id]._id)
                                }
                              >
                                Request Feedback Deletion
                              </button>
                            ) : (
                              <p className="text-danger small mt-2">Deletion Requested</p>
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

      {showModal && selectedAppointment && (
        <FeedbackModal
          show={showModal}
          onClose={() => setShowModal(false)}
          appointment={selectedAppointment}
          onFeedbackSubmitted={(id) => {
            setSubmittedFeedbacks((prev) => ({ ...prev, [id]: true }));
          }}
        />
      )}
    </div>
  );
};

export default PatientAppointments;
