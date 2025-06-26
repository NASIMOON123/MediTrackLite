

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import '../css/DoctorCard.css';

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/doctors/approved`)
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  const specializations = Array.from(
    new Set(doctors.map(doc => doc.specialization).filter(Boolean))
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpec === '' || doctor.specialization === selectedSpec;

    return matchesSearch && matchesSpec;
  });

  return (
    <div className="doctor-list-container">
      <h2>Available Doctors</h2>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
          className="search-bar"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))
        ) : (
          <p>No doctors found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDoctors;