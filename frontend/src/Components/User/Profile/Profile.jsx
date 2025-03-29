import React, { useState } from 'react';
import './Profile.css';
import { assets } from '../../../assets/assets';

const Profile = () => {
 
  const user = {
    name: 'John Doe',
    email: 'john.doe@jira.com',
    role: 'Developer',
    team: 'Engineering Team',
    joined: 'January 2023',
  };

  // Starea pentru fotografia de profil
  const [profilePicture, setProfilePicture] = useState(null); // Imaginea curentă (null pentru implicit)
  const [preview, setPreview] = useState(null); // Previzualizare pentru imaginea încărcată

  // Funcție pentru a gestiona încărcarea imaginii
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Funcție pentru a salva imaginea (simulat, poți conecta la backend)
  const handleSaveImage = () => {
    if (preview) {
      setProfilePicture(preview);
      // Aici poți trimite imaginea către backend (ex. cu fetch sau axios)
      console.log('Profile picture saved:', preview);
      // Eliberează memoria pentru previzualizare
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  // Funcție pentru a anula modificarea
  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-content">
        {/* Secțiunea pentru fotografia de profil */}
        <div className="profile-picture-section">
          <div className="profile-picture">
          <img src={preview || profilePicture || assets.default_profile_icon} alt="Profile" />


          </div>
          <div className="profile-picture-actions">
            <label htmlFor="profile-pic-upload" className="upload-button">
              Change Photo
            </label>
            <input
              type="file"
              id="profile-pic-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {preview && (
              <div className="preview-actions">
                <button onClick={handleSaveImage} className="save-button">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secțiunea pentru informațiile utilizatorului */}
        <div className="profile-details">
          <h2>{user.name}</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Team:</strong> {user.team}</p>
            <p><strong>Joined:</strong> {user.joined}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;