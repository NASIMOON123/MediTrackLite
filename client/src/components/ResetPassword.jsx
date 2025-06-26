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

  const phone = location.state?.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
        phone,
        email,
        role,
        newPassword,
      });
      toast.success('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Reset failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
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
        maxWidth: '450px',
        boxSizing: 'border-box',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#2c3e50'
        }}>
          🔐 Reset User Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                paddingRight: '40px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#555',
                paddingBottom: '18px',
                fontSize: '18px'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
