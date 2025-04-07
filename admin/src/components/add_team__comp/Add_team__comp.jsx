import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './Add_team__comp.css';

const Add_team__comp = () => {
  const [numeEchipa, setNumeEchipa] = useState('');
  const [echipe, setEchipe] = useState([]);
  const [success, setSuccess] = useState(null); // Added for success messages
  const [error, setError] = useState(null);   // Added for error messages

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Eroare la preluarea echipelor');
        }
        const data = await response.json();
        setEchipe(data.teams); // Assuming the response has a 'teams' array
      } catch (error) {
        setError('Eroare la preluarea echipelor: ' + error.message);
      }
    };

    fetchTeams();
  }, []);

  const handleAdaugaEchipa = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: numeEchipa }),
      });
      if (!response.ok) {
        throw new Error('Eroare la adăugarea echipei');
      }
      const data = await response.json();
      setSuccess(data.message); // Set success message
      setNumeEchipa('');
      setEchipe([...echipe, data.team]); // Assuming the response has a 'team' field
    } catch (error) {
      setError('Eroare la adăugarea echipei: ' + error.message);
    }
  };

  const handleStergeEchipa = async (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi această echipă?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/teams/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Eroare la ștergerea echipei');
        }
        const data = await response.json();
        setSuccess(data.message); // Set success message
        setEchipe(echipe.filter((echipa) => echipa._id !== id));
      } catch (error) {
        setError('Eroare la ștergerea echipei: ' + error.message);
      }
    }
  };

  return (
    <div className="add-team-container">
      <h2>Adaugă/Șterge Echipă</h2>
      <div className="form-group">
        <label htmlFor="numeEchipa">Nume Echipă:</label>
        <input
          type="text"
          id="numeEchipa"
          value={numeEchipa}
          onChange={(e) => setNumeEchipa(e.target.value)}
          required
          placeholder="Introdu numele echipei"
        />
      </div>
      <button className="adauga-btn" onClick={handleAdaugaEchipa}>
        Adaugă Echipă
      </button>

      <h3>Echipe Existente</h3>
      <ul className="echipe-list">
        {echipe.map((echipa) => (
          <li key={echipa._id}>
            {echipa.name}
            <button className="sterge-btn" onClick={() => handleStergeEchipa(echipa._id)}>
              Șterge
            </button>
          </li>
        ))}
      </ul>

      {/* Material-UI Snackbar for Success/Error Messages */}
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

export default Add_team__comp;