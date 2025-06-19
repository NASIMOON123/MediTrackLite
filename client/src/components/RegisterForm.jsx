import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Form.css";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // default role
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
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
       // setMessage('Registration successful! You can now login.');
        //setMessageType('success');
        toast.success('Registration successful! You can now login.');
        setFormData({ name: '', email: '', password: '', role: 'patient' });
      } else {
       // setMessage(data.message || 'Registration failed');
       // setMessageType('error');
       toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      //setMessage('Error: ' + error.message);
     // setMessageType('error');
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  <span
    className="toggle-password"
    onClick={() => setShowPassword(prev => !prev)}
  >
    {showPassword ? <FaEye /> :<FaEyeSlash />}
  </span>
</div>


      <label>Role:</label>
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <button type="submit">Register</button>

      {message && <p className={messageType}>{message}</p>}


      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default RegisterForm;