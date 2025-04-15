
import React, { useState, useEffect } from 'react';
import './See_al_users_comp.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { debounce } from 'lodash';
import { getCurrentUser, fetchWithToken } from '../../../../utils/authUtils.js';

const See_al_users_comp = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setError('No authentication token found. Please log in.');
        setSnackbarMessage('No authentication token found. Please log in.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchWithToken('http://localhost:4000/api/user/all/company', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setUsers(data.users || []);

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
      const phoneMatch = filters.phone ? user.phone?.includes(filters.phone) : true;
      return nameMatch && emailMatch && phoneMatch;
    });
    setFilteredUsers(filtered);
  };

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
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  if (loading) return <div className="loading-container-admin-users"><div className="spinner-admin-users"></div><p>Loading users...</p></div>;
  if (error) return <div className="error-container-admin-users"><p>Error: {error}</p></div>;

  return (
    <div className="users-container-admin-users">
      <h2>Lista Utilizatori din Compania Ta</h2>

      <div className="filters-container-admin-users">
        <h3>Filtrează Utilizatorii</h3>
        <div className="filter-inputs-admin-users">
          <div className="input-group-admin-users">
            <label htmlFor="name">Nume:</label>
            <input type="text" id="name" name="name" placeholder="Caută după nume" value={filters.name} onChange={handleFilterChange} />
          </div>
          <div className="input-group-admin-users">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" placeholder="Caută după email" value={filters.email} onChange={handleFilterChange} />
          </div>
          <div className="input-group-admin-users">
            <label htmlFor="phone">Telefon:</label>
            <input type="text" id="phone" name="phone" placeholder="Caută după telefon" value={filters.phone} onChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <div className="users-grid-admin-users">
        {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
          <div key={user._id} className="user-card-admin-users">
            <div className="user-info-admin-users">
              <h3>{user.name}</h3>
              <p><span className="info-label-admin-users">Email:</span> {user.email}</p>
              <p><span className="info-label-admin-users">Companie:</span> {user.companyName}</p>
              <p><span className="info-label-admin-users">Telefon:</span> {user.phone}</p>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && !loading && (
          <div className="no-results-admin-users"><p>Niciun utilizator nu corespunde filtrelor curente.</p></div>
        )}
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default See_al_users_comp;
