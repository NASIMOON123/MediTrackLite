// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/login`, { email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('role', response.data.role);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="admin-login-outer">
      <div className="admin-login-wrapper">
        <div className="admin-login-image">
          <img src="https://static.vecteezy.com/system/resources/previews/020/101/791/non_2x/admin-login-blue-gradient-concept-icon-administrator-account-learning-management-system-access-abstract-idea-thin-line-illustration-isolated-outline-drawing-vector.jpg" alt="Admin Login" />
        </div>
        <div className="admin-login-form-wrapper">
          <form onSubmit={handleLogin} className="f-container">
            <h2>Admin Login</h2>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {error && <p className="message error">{error}</p>}

            <button type="submit">Login</button>

            <div className="back-home-link">
              <a href="/">Back to Home</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
