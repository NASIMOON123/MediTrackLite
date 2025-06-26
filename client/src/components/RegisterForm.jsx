import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/Form.css";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registration successful! You can now login.');
        setFormData({ name: '', email: '', password: '', role: 'patient' });
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <div className="login-outer">
      <div className="login-wrapper">
        <div className="login-image">
          <img
            src="https://img.freepik.com/free-vector/online-doctor-concept_23-2148520389.jpg?uid=R204605876&ga=GA1.1.1445937076.1733657251&semt=ais_hybrid&w=740"
            alt="Register Illustration"
          />
        </div>

        <div className="login-form-wrapper">
          <form onSubmit={handleSubmit} className="f-container">
            <h2>Register</h2>

            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@meditrack.local"
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
              <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            <button type="submit">Register</button>

            {message && <p className={`message ${messageType}`}>{message}</p>}

            <p style={{ marginTop: '15px' }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
