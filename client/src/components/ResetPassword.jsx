import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('doctor');
  const [newPassword, setNewPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const phone = location.state?.phone; // Admin's phone number

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/reset-password', {
        phone,
        email,
        role,
        newPassword,
      });
      toast.success(' Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
 
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Reset failed.');
    }
  };

  return (
    <div>
      <h2>🔐 Reset User Password </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        {/* <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        /> */}
        <div style={{ position: 'relative' }}>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    style={{ paddingRight: '40px' 

    }} // leave space for icon
  />
  <span
  onClick={() => setShowPassword(!showPassword)}
  style={{
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    paddingBottom:'18px'
  }}
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</span>
</div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
