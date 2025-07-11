
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
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/doctors/${id}`);
      setDoctor(res.data);
    };
    const fetchBookedSlots = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/booked-slots/${id}`);
      setBookedSlots(res.data);
    };
    fetchDoctor();
    fetchBookedSlots();
  }, [id]);

  const handleSlotSelect = (slot) => setSelectedTime(slot);

  const isSlotBooked = (slot) =>
    selectedDate && bookedSlots.includes(`${selectedDate}|${slot}`);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!selectedDate || !selectedTime) {
    toast.error('Please select date and time');
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!storedUser || !storedUser._id) {
    toast.error("User not logged in. Please log in again.");
    return;
  }

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

  navigate('/patient-dashboard/payment', { state: { payload, doctor } });
};


  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-appointment-page theme-card">
      <div className="appointment-layout theme-card">
        <div className="left-panel theme-card">
          <button onClick={() => navigate('/patient-dashboard/doctors')} className="back-to-doctors-btn">
            ← Back to Doctors
          </button>
          {doctor && (
            <div className="doctor-profile-section theme-card">
              <img src={doctor.imageUrl} alt="Doctor" className="doctor-profile-image" />
              <div className="doctor-info ">
                <h2 >Dr. {doctor.name} <span className="verified">✔</span></h2>
                <p className="text-adaptive">{doctor.degree} • {doctor.specialization}</p>
                <p className="text-adaptive"><strong className='text-adaptive'>About:</strong> {doctor.bio}</p>
                <p className="fee text-adaptive">Fee: ₹400-₹700</p>
              </div>
            </div>
          )}
        </div>

        <div className="right-panel theme-card">
          <div className="booking-section theme-card">
            <h3 className='text-adaptive'>Select Date</h3>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />

            <h3 className='text-adaptive'>Select Time Slot</h3>
            <div className="slots-container">
             
              {timeSlots.map(slot => {
              const [hourStr, minuteStr] = slot.split(/[: ]/);
              let slotHour = parseInt(hourStr);
              let slotMin = parseInt(minuteStr);
              const isPM = slot.includes('pm');
              if (isPM && slotHour !== 12) slotHour += 12;
              if (!isPM && slotHour === 12) slotHour = 0;

              const slotTime = new Date(selectedDate + 'T' + `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}:00`);
              const now = new Date();

              const isToday = selectedDate === today;
              const isPastSlot = isToday && slotTime < now;

              return (
                <button
                  key={slot}
                  className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={isSlotBooked(slot) || isPastSlot}
                >
                  {slot}
                </button>
              );
            })}

            </div>

            <form onSubmit={handleSubmit} className="appointment-form">
              <h3 className='text-adaptive'>Appointment Details</h3>

              <label className="text-adaptive">Symptoms / Reason</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                required
              />

              <label className="text-adaptive">Phone</label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <label className="text-adaptive">Gender</label>
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

              <button type="submit" className="submit-btn">Pay & Book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;