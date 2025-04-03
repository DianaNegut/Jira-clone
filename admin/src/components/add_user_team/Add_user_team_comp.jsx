import React, { useState, useEffect } from 'react';
import './Add_user_team_comp.css';

const Add_user_team_comp = () => {
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Eroare la obținerea echipelor');
        }
        const data = await response.json();
        setTeams(data.teams); // Assuming the response has a 'teams' array
      } catch (err) {
        setTeamsError(err.message);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/teams/${team}/members/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Eroare la adăugarea utilizatorului la echipă');
      }
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => setMessage(''), 3000);
      setEmail('');
      setTeam('');
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="add-user-team-container">
      <h2>Adaugă Utilizator la Echipă</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="add-user-team-form">
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
        <div className="form-group">
          <label htmlFor="team">Echipă:</label>
          {loadingTeams ? (
            <p>Se încarcă echipele...</p>
          ) : teamsError ? (
            <p className="error">{teamsError}</p>
          ) : (
            <select
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="">Selectează o echipă</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Adaugă la Echipă
        </button>
      </form>
    </div>
  );
};

export default Add_user_team_comp;