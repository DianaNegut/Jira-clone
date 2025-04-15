import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getCurrentUser, fetchWithToken } from '../../../../utils/authUtils.js';
import './Statistici_comp.css';

const Statistici_comp = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistici, setStatistici] = useState({
    utilizatoriTotali: 0, 
    taskuriTotale: 0, 
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setError('Nu s-a găsit niciun token de autentificare. Vă rugăm să vă autentificați.');
        setSnackbarMessage('Nu s-a găsit niciun token de autentificare. Vă rugăm să vă autentificați.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userData = await fetchWithToken('http://localhost:4000/api/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!userData.success || !userData.user || !userData.user.companyName) {
          throw new Error('Nu s-a putut obține informații despre compania utilizatorului');
        }

        const companyName = encodeURIComponent(userData.user.companyName); 
  
        const employeesData = await fetchWithToken(`http://localhost:4000/api/user/${companyName}/employees`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!employeesData.success || employeesData.count === undefined) {
          throw new Error('Nu s-a putut obține numărul de angajați');
        }

        const employeeCount = employeesData.count;


        const taskData = await fetchWithToken(`http://localhost:4000/api/task/company/${companyName}/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (taskData.success && taskData.count !== undefined) {
          setStatistici(prev => ({
            ...prev,
            utilizatoriTotali: employeeCount, 
            taskuriTotale: taskData.count 
          }));
        } else {
          throw new Error('Răspuns invalid de la server pentru numărul de task-uri');
        }

      } catch (error) {
        console.error('Eroare la încărcarea datelor:', error);
        setError(error.message);
        setSnackbarMessage(`Eroare: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  return (
    <div className="statistici-container">
      <h2>Statistici</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="statistici-grid">
        <div className="statistica-item utilizatori">
          <h3>Utilizatori Totali</h3>
          <p>{loading ? "Se încarcă..." : statistici.utilizatoriTotali}</p>
        </div>
        <div className="statistica-item taskuri">
          <h3>Task-uri Totale</h3>
          <p>{loading ? "Se încarcă..." : statistici.taskuriTotale}</p>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Statistici_comp;