

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const DoctorProfile = ({ user }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formState, setFormState] = useState({
    specialization: '',
    experience: '',
    bio: '',
    timings: '',
    isAvailable: true,
    onLeave: false,
    phone: '',
    image: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/doctors/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setProfileData(data);
      //  setFormState(data);
      setFormState((prevState) => ({
        ...prevState,
        specialization: data.specialization || '',
        experience: data.experience || '',
        bio: data.bio || '',
        timings: data.timings || '',
        isAvailable: data.isAvailable ?? true,
        onLeave: data.onLeave ?? false,
        phone: data.phone || '',
        // Don't set image here; it's handled separately
      }));
      
      
        setPreviewImage(data.imageUrl); // use correct image field
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    if (type === 'file') {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, image: reader.result })); // base64 string
        setPreviewImage(reader.result);
      };
  
      if (file) {
        reader.readAsDataURL(file); // convert to base64
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      const updatedProfile = {
        specialization: formState.specialization,
        experience: formState.experience,
        bio: formState.bio,
        phone: formState.phone,
        isAvailable: formState.isAvailable,
        onLeave: formState.onLeave,
        timings: formState.timings,
        imageUrl: formState.image, // base64 string
      };
  
      const res = await fetch('http://localhost:5000/api/doctors/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
  
      let data;
      try {
        data = await res.json();
      } catch (err) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        alert('Error: File too large or server issue. Please try again with a smaller image.');
        return;
      }
  
      if (res.ok) {
        setProfileData(data);
        setFormState((prev) => ({ ...prev, ...data }));
        setShowForm(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Profile update failed.');
      }
  
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Unexpected error occurred. Try again.');
    }
  };
  
  
  console.log('User prop:', user);

  if (!profileData && !showForm) {
    return (
      <div className="profile-container">
        <p className="loading">Loading profile...</p>
      </div>
    );
  }
  
  

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>
      <p className="profile-info"><strong>Name:</strong> {user.name}</p>
      <p className="profile-info"><strong>Email:</strong> {user.email}</p>
      <p className="profile-info"><strong>Role:</strong> Doctor</p>

    
            {profileData && !showForm ? (
              <div className="profile-info">
                  {profileData.imageUrl && (
                   <div className="image-wrapper">
                        <img
                          src={profileData.imageUrl}
                          alt="Doctor"
                          className="doctor-image"
                          width={120}
                          height={120}
                        />
                      </div>
                    )}

          <p className="profile-info"><strong>Specialization:</strong> {profileData.specialization}</p>
          <p className="profile-info"><strong>Experience:</strong> {profileData.experience} years</p>
          <p className="profile-info"><strong>Phone:</strong> {profileData.phone}</p>
          <p className="profile-info"><strong>Bio:</strong> {profileData.bio}</p>
          <p className="profile-info"><strong>Timings:</strong> {profileData.timings}</p>
          <p className="profile-info"><strong>Available to Work:</strong> {profileData.isAvailable ? 'Yes' : 'No'}</p>
          <p className="profile-info"><strong>On Leave:</strong> {profileData.onLeave ? 'Yes' : 'No'}</p>

          <button className="complete-button" onClick={() => setShowForm(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <>
          <form className="complete-profile-form" onSubmit={handleSubmit}>
            <label>Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={formState.specialization}
              onChange={handleChange}
              required
            />

            <label>Experience (in years):</label>
            <input
              type="number"
              name="experience"
              value={formState.experience}
              onChange={handleChange}
              required
            />

            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              required
            />

            <label>Bio:</label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              required
            />

            <label>Available Timings:</label>
            <input
              type="text"
              name="timings"
              value={formState.timings}
              onChange={handleChange}
              placeholder="e.g., 10 AM - 5 PM"
              required
            />

            <label>Upload Profile Picture:</label>
            <input type="file" accept="image/*" onChange={handleChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" width={100} style={{ marginTop: '10px' }} />
            )}

            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formState.isAvailable}
                onChange={handleChange}
              />
              Open to Work
            </label>

            <label>
              <input
                type="checkbox"
                name="onLeave"
                checked={formState.onLeave}
                onChange={handleChange}
              />
              Currently on Leave
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="submit-profile-button">Save Profile</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </>
      )}

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

 export default DoctorProfile;

