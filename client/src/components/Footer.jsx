// Footer.jsx
import React from 'react';
import './footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section brand">
          <h2>
            <span className="meditrack">MediTrack</span><span className="lite">Lite</span>
          </h2>
          <p>Empowering better healthcare through easy access and real-time appointments.</p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="/appointments">Appointments</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p><FaEnvelope /> info@meditracklite.com</p>
          <p><FaPhone /> +91 98765 43210</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 MediTrackLite. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

