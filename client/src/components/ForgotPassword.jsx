import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SMSNotification from './SMSNotification'; // 👈 import the new component
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/send-otp', { phone });
      if (res.data.otp) {
        setOtp(res.data.otp);
      }
      setTimeout(() => {
        navigate('/verify-otp', { state: { phone } });
      }, 6500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '430px',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#2c3e50'
        }}>📱 Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send OTP
          </button>
        </form>

        {otp && (
          <SMSNotification otp={otp} onClose={() => setOtp('')} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
