import React, { useState, useEffect } from 'react';
import './Profile.css';
import { assets } from '../../../assets/assets';
import { getCurrentUser, fetchWithToken } from '../../../utils/authUtils';
import Snackbar from '@mui/material/Snackbar'; 
import Alert from '@mui/material/Alert'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' }); 

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
        const file = document.getElementById('profile-pic-upload').files[0];
        if (!file) throw new Error('No file selected');

        const formData = new FormData();
        formData.append('profilePicture', file);

        const response = await fetchWithToken(`http://localhost:4000/api/user/${user._id}/profile-picture`, {
          method: 'PATCH',
          body: formData,
        });

        if (response.profilePicture) {
          const imagePath = response.profilePicture.replace('uploads/', 'images/');
          setProfilePicture(`http://localhost:4000/${imagePath}`);
        }

        setSnackbar({ open: true, message: 'Profile picture saved successfully!', severity: 'success' }); 
      } catch (error) {
        console.error('Error saving profile picture:', error);
        setSnackbar({ open: true, message: 'Failed to save profile picture: ' + error.message, severity: 'error' }); 
      } finally {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.id) {
          setSnackbar({ open: true, message: 'User not authenticated', severity: 'error' });
          setLoading(false);
          return;
        }

        const userData = await fetchWithToken(`http://localhost:4000/api/user/${currentUser.id}`);
        setUser(userData.user);

        if (userData.user.profilePicture) {
          const imagePath = userData.user.profilePicture.replace('uploads/', 'images/');
          setProfilePicture(`http://localhost:4000/${imagePath}`);
        }
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to load user data', severity: 'error' });
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
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

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;