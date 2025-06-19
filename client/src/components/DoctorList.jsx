import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="doctor-list-page">
      <h2>Our Doctors</h2>
      <div className="doctor-grid">
        {doctors.map(doctor => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
