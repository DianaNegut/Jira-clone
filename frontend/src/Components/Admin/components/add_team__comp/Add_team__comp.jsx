import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './Add_team__comp.css';

const Add_team__comp = () => {
  const [numeEchipa, setNumeEchipa] = useState('');
  const [echipe, setEchipe] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

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
          setEchipe([]);
        } else {
          setEchipe(teamsData.teams);
        }
        
      } catch (error) {
        setError('Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTeams();
  }, []);

  const handleAdaugaEchipa = async () => {
    if (!numeEchipa.trim()) {
      setError('Team name cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          name: numeEchipa.trim(), 
          companyName: companyName
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add team');
      }
      
      const data = await response.json();
      setSuccess(data.message);
      setNumeEchipa('');
      

      const teamsResponse = await fetch(
        `http://localhost:4000/api/teams?companyName=${encodeURIComponent(companyName)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (!teamsResponse.ok) {
        throw new Error('Failed to refresh teams list');
      }
      
      const teamsData = await teamsResponse.json();
      setEchipe(teamsData.teams);
      
    } catch (error) {
      setError('Error adding team: ' + error.message);
    }
  };

  const handleStergeEchipa = async (id) => {
    if (window.confirm('Are you sure you want to delete this team? All associated tasks will also be deleted.')) {
      try {
        const response = await fetch(`http://localhost:4000/api/teams/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete team');
        }
        
        const data = await response.json();
        setSuccess(data.message);
        setEchipe(echipe.filter((echipa) => echipa._id !== id));
        
      } catch (error) {
        setError('Error deleting team: ' + error.message);
      }
    }
  };

  const handleUpdateTeam = async (teamId, newName) => {
    if (!newName.trim()) {
      setError('Team name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          name: newName.trim(),
          companyName: companyName
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update team');
      }
      
      const data = await response.json();
      setSuccess(data.message);
      

      const teamsResponse = await fetch(
        `http://localhost:4000/api/teams?companyName=${encodeURIComponent(companyName)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (!teamsResponse.ok) {
        throw new Error('Failed to refresh teams list');
      }
      
      const teamsData = await teamsResponse.json();
      setEchipe(teamsData.teams);
      
    } catch (error) {
      setError('Error updating team: ' + error.message);
    }
  };

  if (loading) {
    return <div className="add-team-container">Loading...</div>;
  }

  return (
    <div className="add-team-container">
      <h2>Manage Teams for {companyName}</h2>
      
      <div className="form-group">
        <label htmlFor="numeEchipa">Team Name:</label>
        <input
          type="text"
          id="numeEchipa"
          value={numeEchipa}
          onChange={(e) => setNumeEchipa(e.target.value)}
          required
          placeholder="Enter team name"
        />
      </div>
      
      <button className="adauga-btn" onClick={handleAdaugaEchipa}>
        Add Team
      </button>

      <h3>Existing Teams</h3>
      
      {echipe.length === 0 ? (
        <p>No teams found for {companyName}</p>
      ) : (
        <div className="teams-table">
          <table>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {echipe.map((echipa) => (
                <TeamRow 
                  key={echipa._id}
                  team={echipa}
                  onDelete={handleStergeEchipa}
                  onUpdate={handleUpdateTeam}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(null);
          setError(null);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(null);
            setError(null);
          }}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </div>
  );
};

const TeamRow = ({ team, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(team.name);

  const handleUpdate = () => {
    onUpdate(team._id, editedName);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            autoFocus
          />
        ) : (
          team.name
        )}
      </td>
      <td className="actions-cell">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleUpdate}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="sterge-btn" onClick={() => onDelete(team._id)}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default Add_team__comp;