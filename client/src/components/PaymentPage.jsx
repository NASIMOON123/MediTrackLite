import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/PaymentPage.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import jsPDF from 'jspdf';


const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({});

    const handlePayment = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("User not logged in");
      return;
    }

    // Save appointment to DB
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/appointments`, state.payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Show toast
    toast.success('Payment Successful! Appointment Booked.');

    // Generate PDF receipt
    // Generate PDF receipt
const doc = new jsPDF();

doc.setFont('times', 'normal');   // You can also try 'helvetica' or 'courier'
doc.setFontSize(16);
doc.text('MediTrackLite - Appointment Receipt', 20, 20);

doc.setFontSize(12);
doc.text(`Generated On: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);

doc.setLineWidth(0.5);
doc.line(20, 34, 190, 34); // horizontal separator

let y = 42;
doc.text(`Doctor Name: Dr. ${state.doctor.name}`, 20, y); y += 8;
doc.text(`Specialization: ${state.doctor.specialization}`, 20, y); y += 8;

doc.text(`Patient Name: ${state.payload.patientName}`, 20, y); y += 8;
doc.text(`Email: ${state.payload.email}`, 20, y); y += 8;

doc.text(`Appointment Date: ${state.payload.date}`, 20, y); y += 8;
doc.text(`Appointment Time: ${state.payload.time}`, 20, y); y += 8;

doc.text(`Payment Method: ${paymentMethod === 'upi' ? 'UPI' : 'Card'}`, 20, y); y += 8;
doc.text(`Fee Paid: ₹500`, 20, y); y += 8;

doc.setTextColor(0, 128, 0);
doc.text('Status: Confirmed', 20, y);

doc.save('Appointment_Receipt.pdf');


    // Navigate to dashboard
    setTimeout(() => navigate('/patient-dashboard/appointments'), 1000);

  } catch (err) {
    console.error(err);
    toast.error('Failed to book appointment');
  }
};


  const renderFields = () => {
  switch (paymentMethod) {
    case 'upi':
      return (
        <input
          type="text"
          placeholder="Enter UPI ID (e.g., name@bank)"
          pattern="^[\w.-]+@[\w]+$"
          title="Enter a valid UPI ID"
          onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
          required
        />
      );
    case 'card':
      return (
        <>
          <input
            type="text"
            placeholder="Card Number (16 digits)"
            pattern="^\d{16}$"
            title="Enter a valid 16-digit card number"
            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
            title="Format should be MM/YY"
            onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="CVV (3 digits)"
            pattern="^\d{3}$"
            title="Enter a 3-digit CVV"
            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
            required
          />
        </>
      );
    default:
      return null;
  }
};

  if (!state?.payload || !state?.doctor) {
    return <p>Missing appointment data</p>;
  }

  const { patientName, email, date, time } = state.payload;
  const { name, specialization } = state.doctor;

  return (
    <div className="fake-payment-page theme-card">
      <h2>Confirm Your Appointment</h2>
      <div className="summary theme-card">
        <p className="text-adaptive"><strong>Doctor:</strong> Dr. {name} ({specialization})</p>
        <p className="text-adaptive"><strong>Patient:</strong> {patientName}</p>
        <p className="text-adaptive"><strong>Email:</strong> {email}</p>
        <p className="text-adaptive"><strong>Date & Time:</strong> {date} at {time}</p>
        <p className="text-adaptive"><strong>Consultation Fee:</strong> ₹500</p>
      </div>

      <h3>Select Payment Method</h3>
      <select onChange={(e) => setPaymentMethod(e.target.value)} required>
        <option value="">-- Select Method --</option>
        <option value="upi">UPI</option>
        <option value="card">Debit/Credit Card</option>
      </select>

      <div className="payment-fields">{renderFields()}</div>

      <div className="payment-actions">
        <button onClick={() => navigate(-1)}>← Back</button>
        <button className="pay-btn" onClick={handlePayment} disabled={!paymentMethod}>
          Pay & Book
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;