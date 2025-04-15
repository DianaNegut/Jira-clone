import React, { useState, useEffect } from 'react';
import './Add_user_team_comp.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Add_user_team_comp = () => {
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchUserAndTeams = async () => {
      try {
        setLoading(true);
        

        const userResponse = await fetch('http://localhost:4000/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        
        if (!userData.success) {
          throw new Error(userData.message || 'Failed to get user');
        }

        const userCompanyName = userData.user.companyName || '';
        
        if (!userCompanyName) {
          throw new Error('User is not associated with any company');
        }
        
        setCompanyName(userCompanyName);

        const teamsResponse = await fetch(
          `http://localhost:4000/api/teams?companyName=${encodeURIComponent(userCompanyName)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        if (!teamsResponse.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const teamsData = await teamsResponse.json();
        
        if (!teamsData.teams || teamsData.teams.length === 0) {
          setTeams([]);
          setError('No teams found for your company');
        } else {
          setTeams(teamsData.teams);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setSnackbar({
          open: true,
          message: 'Error loading data: ' + err.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !team) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    try {

      const userResponse = await fetch(`http://localhost:4000/api/user/email/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      
      const userData = await userResponse.json();
      

      if (userData.user.companyName !== companyName) {
        throw new Error('User belongs to a different company');
      }
      
      const userId = userData.user._id;
  

      const response = await fetch(`http://localhost:4000/api/teams/${team}/members/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user to team');
      }
      
      const data = await response.json();
      setSnackbar({ 
        open: true, 
        message: data.message || 'User added to team successfully!', 
        severity: 'success' 
      });
      

      setEmail('');
      setTeam('');
    } catch (err) {
      console.error('Error adding user to team:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'An error occurred', 
        severity: 'error' 
      });
    }
  };

  return (
    <div className="add-user-team-container">
      <h2>Add User to Team </h2>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <form onSubmit={handleSubmit} className="add-user-team-form">
        <div className="form-group">
          <label htmlFor="email">User Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter user's email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team">Team:</label>
          {loading ? (
            <p>Loading teams...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : teams.length === 0 ? (
            <p>No teams available in your company</p>
          ) : (
            <select
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading || teams.length === 0}>
          Add to Team
        </button>
      </form>
    </div>
  );
};

export default Add_user_team_comp;