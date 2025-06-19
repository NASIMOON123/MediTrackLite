

// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminLogin.css'
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      
      // ✅ Save token to localStorage
      localStorage.setItem('adminToken', response.data.token);

      // Optionally save role if you need it later
      localStorage.setItem('role', response.data.role);
      toast.success('Login successful!');
      // ✅ Navigate to Admin Dashboard
      navigate('/admin/dashboard');
    } 
    
    catch (err) {
      setError('Invalid credentials');
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
       <div className="password-field">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Admin Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword(prev => !prev)}
  >
    {showPassword ? <FaEye /> : <FaEyeSlash />}
  </span>
</div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>

        <div className="back-home-link">
    <a href="/">Back to Home</a>
  </div>
      </form>
    </div>
  );
};

export default AdminLogin;

