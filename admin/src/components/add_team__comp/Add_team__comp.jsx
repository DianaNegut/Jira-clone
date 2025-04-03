import React, { useState, useEffect } from 'react';
import './Add_team__comp.css';

const Add_team__comp = () => {
  const [numeEchipa, setNumeEchipa] = useState('');
  const [echipe, setEchipe] = useState([]);
  const [message, setMessage] = useState('');

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
        setMessage('Eroare la preluarea echipelor: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
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
      setMessage(data.message); // Assuming the response has a 'message' field
      setTimeout(() => setMessage(''), 3000);
      setNumeEchipa('');
      setEchipe([...echipe, data.team]); // Assuming the response has a 'team' field
    } catch (error) {
      setMessage('Eroare la adăugarea echipei: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
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
        setMessage(data.message); // Assuming the response has a 'message' field
        setTimeout(() => setMessage(''), 3000);
        setEchipe(echipe.filter((echipa) => echipa._id !== id));
      } catch (error) {
        setMessage('Eroare la ștergerea echipei: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="add-team-container">
      <h2>Adaugă/Șterge Echipă</h2>
      {message && <div className="message">{message}</div>}
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
    </div>
  );
};

export default Add_team__comp;