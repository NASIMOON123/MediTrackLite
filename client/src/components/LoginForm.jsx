// // src/components/LoginForm.jsx
// import React, { useState } from 'react';
// import "../css/login.css";
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// const LoginForm = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success('Login successful!');
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         onLogin && onLogin(data.user);

//         const userRole = data.role || data.user.role || formData.role || '';
//         setTimeout(() => {
//           if (userRole === 'doctor') {
//             navigate('/doctor-dashboard');
//           } else {
//             navigate('/patient-dashboard');
//           }
//         }, 1000);
//       } else {
//         toast.error(data.message || 'Login failed');
//       }
//     } catch (error) {
//       toast.error('Error: ' + error.message);
//     }
//   };

//   return (
//     <div className="login-outer">
//     <div className="login-wrapper">
//       <div className="login-image">
//         <img
//           src="https://img.freepik.com/free-vector/online-doctor-concept_23-2148520389.jpg?uid=R204605876&ga=GA1.1.1445937076.1733657251&semt=ais_hybrid&w=740"
//           alt="Login Illustration"
//         />
//       </div>

//       <div className="login-form-wrapper">
//         <form onSubmit={handleSubmit} className="f-container">
//           <h2>Login</h2>

//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label>Password:</label>
//           <div className="password-field">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <span
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEye /> : <FaEyeSlash />}
//             </span>
//           </div>

//           <div className="forgot-password">
//             <Link to="/forgot-password">Forgot Password?</Link>
//           </div>

//           <button type="submit">Login</button>

//           {message && <p className={`message ${messageType}`}>{message}</p>}

//           <p style={{ marginTop: '15px' }}>
//             Don't have an account? <Link to="/register">Register</Link>
//           </p>

//           <div className="back-home-link">
//             <a href="/">Back to Home</a>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default LoginForm;



// src/components/LoginForm.jsx
import React, { useState } from 'react';
import "../css/login.css";
import "../css/themes.css"; // Make sure this is included
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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
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
    <div className="login-outer themed-section">
      <div className="login-wrapper theme-card">
        <div className="login-image theme-card">
          <img
            src="https://img.freepik.com/free-vector/online-doctor-concept_23-2148520389.jpg?uid=R204605876&ga=GA1.1.1445937076.1733657251&semt=ais_hybrid&w=740"
            alt="Login Illustration"
          />
        </div>

        <div className="login-form-wrapper theme-card">
          <form onSubmit={handleSubmit} className="f-container theme-card">
            <h2 className="text-adaptive">Login</h2>

            <label className="text-adaptive">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-adaptive"
            />

            <label className="text-adaptive">Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-adaptive"
              />
              <span
                className="toggle-password text-adaptive"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password" className="text-adaptive">Forgot Password?</Link>
            </div>

            <button type="submit" className="theme-button">Login</button>

            {message && <p className={`message ${messageType}`}>{message}</p>}

            <p style={{ marginTop: '15px' }} className="text-adaptive">
              Don't have an account? <Link to="/register" className="text-adaptive">Register</Link>
            </p>

            <div className="back-home-link">
              <a href="/" className="text-adaptive">Back to Home</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
