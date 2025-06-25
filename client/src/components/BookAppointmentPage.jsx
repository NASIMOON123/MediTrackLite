import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/BookAppointmentPage.css';
import { toast } from 'react-toastify';


const timeSlots = [
  '09:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '01:30 pm', '03:00 pm',
  '04:30 pm'
];


const BookAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    symptoms: '',
    phone: '',
    gender: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await axios.get(`/api/doctors/${id}`);
      setDoctor(res.data);
    };
    const fetchBookedSlots = async () => {
      const res = await axios.get(`/api/appointments/booked-slots/${id}`);
      setBookedSlots(res.data);
    };
    fetchDoctor();
    fetchBookedSlots();
  }, [id]);

  const handleSlotSelect = (slot) => setSelectedTime(slot);

  const isSlotBooked = (slot) =>
    selectedDate && bookedSlots.includes(`${selectedDate}|${slot}`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!selectedDate){
      toast.error('Please select a date for the appointment.');
      return;
    }
    if(!selectedTime){
      toast.error('Please select a Time slot.');
      return;
    }
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const payload = {
        doctorId: doctor._id,
        doctorName: doctor.name,
        patientId: storedUser._id,
        patientName: storedUser.name,
        email: storedUser.email,
        date: selectedDate,
        time: selectedTime,
        ...formData
      };
      await axios.post('/api/appointments', payload, {
        headers: { Authorization: `Bearer ${storedUser}` }
      });
      toast.success("Appointment booked!");
      navigate('/patient-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || "Booking failed");
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-appointment-page">
      <div className="appointment-layout">
        <div className="left-panel">
          <button onClick={() => navigate('/patient-dashboard/doctors')} className="back-to-doctors-btn">
            ← Back to Doctors
          </button>
          {doctor && (
            <div className="doctor-profile-section">
              <img src={doctor.imageUrl} alt="Doctor" className="doctor-profile-image" />
              <div className="doctor-info">
                <h2>Dr. {doctor.name} <span className="verified">✔</span></h2>
                <p>{doctor.degree} • {doctor.specialization}</p>
                <p><strong>About:</strong> {doctor.bio}</p>
                <p className="fee">Fee: ₹400-₹700</p>
              </div>
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="booking-section">
            <h3>Select Date</h3>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />

            <h3>Select Time Slot</h3>
            <div className="slots-container">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={isSlotBooked(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="appointment-form">
              <h3>Appointment Details</h3>

              <label>Symptoms / Reason</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                required
              />

              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="">-- Select --</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>

              <button type="submit" className="submit-btn">Book Appointment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;