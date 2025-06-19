import React, { useState } from 'react';
import "./Form.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin && onLogin(data.user);

        const userRole = data.role || data.user.role || formData.role || '';
        setTimeout(() => {
          if (userRole === 'doctor') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/patient-dashboard');
          }
        }, 1000);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <div className='login-container'>
    <h2>Login</h2>
    <form onSubmit={handleSubmit} className="f-container">

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label>Password:</label>
      <div className="password-field">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <label>Role:</label>
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <button type="submit">Login</button>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <div className="back-home-link">
    <a href="/">Back to Home</a>
  </div>
    </form>
    </div>
  );
};

export default LoginForm;