import React, { useState, useEffect } from 'react';
import './See_al_users_comp.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { debounce } from 'lodash'; // Import lodash pentru debouncing

const See_al_users_comp = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'error' sau 'success'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Dacă este necesar, adaugă token de autentificare sau altele
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log("API response:", data);

        setUsers(data.users || data);

      } catch (err) {
        setError(err.message);
        setSnackbarMessage(`Error fetching users: ${err.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const applyFilters = () => {
    const filtered = users.filter(user => {
      const nameMatch = filters.name ? user.name?.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const emailMatch = filters.email ? user.email?.toLowerCase().includes(filters.email.toLowerCase()) : true;
      const companyMatch = filters.companyName ? user.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) : true;
      const phoneMatch = filters.phone ? user.phone?.includes(filters.phone) : true;

      return nameMatch && emailMatch && companyMatch && phoneMatch;
    });
    setFilteredUsers(filtered);
  };

  // Folosim debounce pentru a aplica filtrele doar după o scurtă pauză de tastare
  const debouncedApplyFilters = debounce(applyFilters, 300);

  useEffect(() => {
    debouncedApplyFilters();
  }, [users, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading users...</p></div>;
  if (error) return <div className="error-container"><p>Error: {error}</p></div>;

  return (
    <div className="users-container">
      <h2>Lista Utilizatori</h2>

      <div className="filters-container">
        <h3>Filtrează Utilizatorii</h3>
        <div className="filter-inputs">
          <div className="input-group">
            <label htmlFor="name">Nume:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Caută după nume"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Caută după email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="phone">Telefon:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Caută după telefon"
              value={filters.phone}
              onChange={handleFilterChange}
            />
          </div>
          {/* Aici poți adăuga mai multe câmpuri de filtru dacă este necesar */}
        </div>
      </div>

      <div className="users-grid">
        {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p><span className="info-label">Email:</span> {user.email}</p>
              <p><span className="info-label">Companie:</span> {user.companyName}</p>
              <p><span className="info-label">Telefon:</span> {user.phone}</p>
              {/* Aici poți adăuga mai multe informații despre utilizator */}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && !loading && (
          <div className="no-results">
            <p>Niciun utilizator nu corespunde filtrelor curente.</p>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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

export default See_al_users_comp;