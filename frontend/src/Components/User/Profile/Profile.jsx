import React, { useState, useEffect } from 'react';
import './Profile.css';
import { assets } from '../../../assets/assets';
import { getCurrentUser, fetchWithToken } from '../../../utils/authUtils';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSaveImage = async () => {
    if (preview) {
      try {
        const file = document.getElementById('profile-pic-upload').files[0]; // Obține fișierul încărcat
        if (!file) throw new Error('No file selected');

        const formData = new FormData();
        formData.append('file', file); // Adaugă fișierul în formData

        const response = await fetchWithToken(`http://localhost:4000/api/user/${user._id}/profile-picture`, {
          method: 'POST',
          body: formData,
        });

        console.log('Profile picture saved:', response);
        setProfilePicture(response.profilePicture); // Actualizează starea cu noua cale a imaginii

      } catch (error) {
        console.error('Error saving profile picture:', error);
        setError('Failed to save profile picture: ' + error.message);
      }

      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const userData = await fetchWithToken(`http://localhost:4000/api/user/${currentUser.id}`);
        setUser(userData.user);
        if (userData.user.profilePicture) {
          setProfilePicture(userData.user.profilePicture);
        }

      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-content">
        <div className="profile-picture-section">
          <div className="profile-picture">
            <img src={preview || profilePicture || assets.default_profile_icon} alt="Profile" />
          </div>
          <div className="profile-picture-actions">
            <label htmlFor="profile-pic-upload" className="upload-button">Change Photo</label>
            <input
              type="file"
              id="profile-pic-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {preview && (
              <div className="preview-actions">
                <button onClick={handleSaveImage} className="save-button">Save</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <h2>{user.name}</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Company:</strong> {user.companyName}</p>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;