import React from 'react';

import "./Profile.css";
import PatientSidebar from "./PatientSidebar";


const PatientProfile = ({ user }) => {
  //const navigate = useNavigate();
  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
   <div>
  <PatientSidebar />
  <div className="main-content">
  <div className="profile-container">
    <div className="image-wrapper">
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="profile"
        className="doctor-image"
      />
    </div>

    <h2>Patient Profile</h2>
    <p className="profile-info">
      <span className="profile-label">Name:</span> {user.name || 'N/A'}
    </p>
    <p className="profile-info">
      <span className="profile-label">Email:</span> {user.email || 'N/A'}
    </p>
    <p className="profile-info">
      <span className="profile-label">Role:</span> Patient
    </p>
  </div>

  </div>
</div>

  );
};


export default PatientProfile;