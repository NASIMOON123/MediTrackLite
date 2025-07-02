import React from 'react';

import "../css/Profile.css";



const PatientProfile = ({ user }) => {
  //const navigate = useNavigate();
  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
   <div>
  
  <div className="main-content theme-card">
  <div className="profile-container theme-card">
    <div className="image-wrapper">
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="profile"
        className="doctor-image"
      />
    </div>

    <h2 className="text-adaptive">Patient Profile</h2>
    <p className="profile-info text-adaptive">
      <span className="profile-label text-adaptive">Name:</span> {user.name || 'N/A'}
    </p>
    <p className="profile-info text-adaptive">
      <span className="profile-label text-adaptive">Email:</span> {user.email || 'N/A'}
    </p>
    <p className="profile-info text-adaptive">
      <span className="profile-label text-adaptive">Role:</span> Patient
    </p>
  </div>

  </div>
</div>

  );
};


export default PatientProfile;