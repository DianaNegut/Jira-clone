import React, { useState } from 'react';
import './SettingsComponent.css';

const SettingsComponent = () => {
  // Starea pentru informațiile utilizatorului (simulat, poți prelua din backend)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@jira.com',
  });

  // Starea pentru parolă
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Starea pentru notificări
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskUpdates: true,
    mentions: true,
  });

  // Starea pentru tema
  const [theme, setTheme] = useState('light'); // 'light' sau 'dark'

  // Funcție pentru a actualiza informațiile utilizatorului
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Funcție pentru a actualiza parola
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Funcție pentru a actualiza notificările
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  // Funcție pentru a salva modificările (simulat, poți conecta la backend)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validare parolă
    if (password.newPassword && password.newPassword !== password.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    // Datele care vor fi trimise
    const updatedSettings = {
      userInfo,
      password: password.newPassword ? password.newPassword : undefined,
      notifications,
      theme,
    };

    // Aici poți trimite datele către backend (ex. cu fetch sau axios)
    console.log('Settings updated:', updatedSettings);

    // Resetare câmpuri de parolă după salvare
    setPassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        {/* Secțiunea pentru informații personale */}
        <div className="settings-section">
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
              required
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
              required
            />
          </div>
        </div>

        {/* Secțiunea pentru schimbarea parolei */}
        <div className="settings-section">
          <h2>Change Password</h2>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={password.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={password.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={password.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Secțiunea pentru notificări */}
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notifications.emailNotifications}
                onChange={handleNotificationChange}
              />
              <span>Email Notifications</span>
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="taskUpdates"
                checked={notifications.taskUpdates}
                onChange={handleNotificationChange}
              />
              <span>Task Updates</span>
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="mentions"
                checked={notifications.mentions}
                onChange={handleNotificationChange}
              />
              <span>Mentions</span>
            </label>
          </div>
        </div>

        {/* Buton de salvare */}
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsComponent;