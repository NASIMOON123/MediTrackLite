import React from 'react';
import '../css/DoctorCard.css';
import { FaUserMd, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card grey-card">
      <div className="image-container">
        {doctor.imageUrl ? (
          <img src={doctor.imageUrl} alt={doctor.name} className="doctor-img" />
        ) : (
          <FaUserMd size={100} className="default-icon" />
        )}
      </div>
      <div className="card-content">
        <h3  className="text-adaptive">Dr. {doctor.name}</h3>
        <p className="specialization text-adaptive"><FaStethoscope /> {doctor.specialization}</p>
        <p  className="text-adaptive">{doctor.title}</p>
        <p className="text-adaptive"><strong className='text-adaptive'>Experience:</strong> {doctor.experience} years</p>
        <Link to={`/appointment/${doctor._id}`} className="view-button">Book Appointment</Link>
      </div>
    </div>
  );
};

export default DoctorCard;
