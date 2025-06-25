import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import { toast } from 'react-toastify';

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
        setFormState((prevState) => ({
          ...prevState,
          specialization: data.specialization || '',
          experience: data.experience || '',
          bio: data.bio || '',
          timings: data.timings || '',
          isAvailable: data.isAvailable ?? true,
          onLeave: data.onLeave ?? false,
          phone: data.phone || '',
        }));
        setPreviewImage(data.imageUrl);
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
        setFormState((prev) => ({ ...prev, image: reader.result }));
        setPreviewImage(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
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
        specialization: formState.specialization || profileData.specialization,
        experience: formState.experience || profileData.experience,
        bio: formState.bio || profileData.bio,
        phone: formState.phone || profileData.phone,
        isAvailable: formState.isAvailable ?? profileData.isAvailable,
        onLeave: formState.onLeave ?? profileData.onLeave,
        timings: formState.timings || profileData.timings,
        imageUrl: formState.image || profileData.imageUrl,
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
        toast.error('Error: File too large or server issue. Please try again with a smaller image.');
        return;
      }

      if (res.ok) {
        setProfileData(data);
        setFormState((prev) => ({ ...prev, ...data }));
        setShowForm(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Profile update failed.');
      }

    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Unexpected error occurred. Try again.');
    }
  };

  if (!profileData && !showForm) {
    return <div className="profile-container"><p className="loading">Loading profile...</p></div>;
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
              />
            </div>
          )}
          <p><strong>Specialization:</strong> {profileData.specialization}</p>
          <p><strong>Experience:</strong> {profileData.experience} years</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Bio:</strong> {profileData.bio}</p>
          <p><strong>Timings:</strong> {profileData.timings}</p>
          <p><strong>Available to Work:</strong> {profileData.isAvailable ? 'Yes' : 'No'}</p>
          <p><strong>On Leave:</strong> {profileData.onLeave ? 'Yes' : 'No'}</p>

         <button className="edit-profile-button" onClick={() => setShowForm(true)}>Edit Profile</button>

        </div>
      ) : (
        <div className="edit-form-wrapper">
        <form className="complete-profile-form" onSubmit={handleSubmit}>
          <label>Specialization:</label>
          <input type="text" name="specialization" value={formState.specialization} onChange={handleChange} required />

          <label>Experience (in years):</label>
          <input type="number" name="experience" value={formState.experience} onChange={handleChange} required />

          <label>Phone Number:</label>
          <input type="tel" name="phone" value={formState.phone} onChange={handleChange} required />

          <label>Bio:</label>
          <textarea name="bio" value={formState.bio} onChange={handleChange} required />

          <label>Available Timings:</label>
          <input type="text" name="timings" value={formState.timings} onChange={handleChange} required />
        
          <label>Upload Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleChange} />
        <div className='style-image'>
          {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
        </div>
          <label className="checkbox-group">
            <input type="checkbox" name="isAvailable" checked={formState.isAvailable} onChange={handleChange} />
            <span>Open to Work</span>
          </label>

          <label className="checkbox-group">
            <input type="checkbox" name="onLeave" checked={formState.onLeave} onChange={handleChange} />
            <span>Currently on Leave</span>
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-profile-button">Save Profile</button>
            <button type="button" className="cancel-profile-button" onClick={() => setShowForm(false)}>Cancel</button>

          </div>
        </form>
        </div>
      )}

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DoctorProfile;
