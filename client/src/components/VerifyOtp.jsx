import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/verify-otp', { phone, otp });
      navigate('/reset-password', { state: { phone } });
    } catch (err) {
      alert(err.response.data.message || 'Invalid OTP.');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
