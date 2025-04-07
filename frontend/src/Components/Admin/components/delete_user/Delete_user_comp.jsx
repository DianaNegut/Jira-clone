import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './Delete_user_comp.css';

const Delete_user_comp = () => {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleDelete = async () => {
    if (window.confirm('Ești sigur că vrei să ștergi acest utilizator?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/user/delete/${email}`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Eroare la ștergerea utilizatorului');
        }

        const data = await response.json();
        setSnackbar({ open: true, message: data.message || 'Utilizatorul a fost șters cu succes!', severity: 'success' });
        setEmail('');
      } catch (error) {
        setSnackbar({ open: true, message: error.message || 'A apărut o eroare la ștergerea utilizatorului.', severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="delete-user-container">
      <h2>Ștergere Utilizator</h2>
      <div className="form-group">
        <label htmlFor="email">E-mail Utilizator:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Introdu e-mailul utilizatorului"
        />
      </div>
      <button className="delete-btn" onClick={handleDelete}>
        Șterge Utilizator
      </button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Delete_user_comp;
