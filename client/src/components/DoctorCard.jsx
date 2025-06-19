
// export default DoctorCard;
import React from 'react';
import './DoctorCard.css';
import { FaUserMd, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-container">
    <div className="doctor-card">
      <div className="image-container">
        {doctor.imageUrl ? (
          <img src={doctor.imageUrl} alt={doctor.name} className="doctor-img" />
        ) : (
          <FaUserMd size={80} className="default-icon" />
        )}
      </div>
      <div className="card-content">
        <h3>Dr. {doctor.name}</h3>
        <p className="specialization"><FaStethoscope /> {doctor.specialization}</p>
        <p>{doctor.title}</p>
        <p><strong>Experience:</strong> {doctor.experience} years</p>
        <Link to={`/appointment/${doctor._id}`} className="view-button">View Profile</Link>
      </div>
    </div>
    </div>
  );
};

export default DoctorCard;
