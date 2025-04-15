import React, { useState, useEffect } from 'react';
import './SettingsComponent.css';
import { getCurrentUser, fetchWithToken } from '../../../utils/authUtils';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SettingsComponent = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskUpdates: true,
    mentions: true,
  });
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUserData = getCurrentUser();
        if (!currentUserData || !currentUserData.id) {
          throw new Error('User not authenticated or no user ID found');
        }

        const userResponse = await fetchWithToken(`http://localhost:4000/api/user/${currentUserData.id}`);
        setUserInfo({
          name: userResponse.user.name,
          email: userResponse.user.email,
        });
      } catch (err) {
        setError('Failed to load user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.oldPassword || password.newPassword || password.confirmPassword) {
      if (!password.oldPassword) {
        setSnackbar({ open: true, message: 'Old password is required.', severity: 'error' });
        return;
      }

      if (!password.newPassword) {
        setSnackbar({ open: true, message: 'New password is required.', severity: 'error' });
        return;
      }

      if (password.newPassword !== password.confirmPassword) {
        setSnackbar({ open: true, message: 'New password and confirm password do not match.', severity: 'error' });
        return;
      }

      if (password.newPassword.length < 8) {
        setSnackbar({ open: true, message: 'New password must be at least 8 characters long.', severity: 'error' });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.id) {
          throw new Error('User not authenticated or no user ID found');
        }

        const passwordData = {
          userId: currentUser.id,
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        };

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:4000/api/user/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(passwordData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const responseData = await response.json();

        setSnackbar({ open: true, message: responseData.message || 'Password changed successfully!', severity: 'success' });
        setPassword({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        saveOtherSettings();
      } catch (err) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      saveOtherSettings();
    }
  };

  const saveOtherSettings = () => {
    const updatedSettings = {
      userInfo,
      notifications,
      theme,
    };

    setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
  };

  if (loading && !userInfo.name) return <div className="loading">Loading...</div>;

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>User Settings</h1>
        <p>Manage your account preferences and settings</p>
      </header>
      <form onSubmit={handleSubmit} className="settings-form">
        <section className="settings-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              placeholder="Enter your full name"
              readOnly
              
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              placeholder="Enter your email"
              readOnly
              
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Change Password</h2>

          {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <div className="form-group password-group" key={field}>
              <label htmlFor={field}>
                {field === "oldPassword"
                  ? "Old Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  id={field}
                  name={field}
                  value={password[field]}
                  onChange={handlePasswordChange}
                  placeholder={
                    field === "oldPassword"
                      ? "Enter old password"
                      : field === "newPassword"
                      ? "Enter new password"
                      : "Confirm new password"
                  }
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => togglePasswordVisibility(field)}
                >
                  {showPassword[field] ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
        </section>

        

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SettingsComponent;
