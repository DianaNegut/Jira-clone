import React, { useState } from 'react';
import './Delete_user_comp.css';

const Delete_user_comp = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
          throw new Error('Eroare la ștergerea utilizatorului');
        }

        const data = await response.json();
        setMessage(data.message || 'Utilizatorul a fost șters cu succes!');
        setTimeout(() => setMessage(''), 3000);
        setEmail('');
      } catch (error) {
        setMessage(error.message || 'A apărut o eroare la ștergerea utilizatorului.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="delete-user-container">
      <h2>Ștergere Utilizator</h2>
      {message && <div className="message">{message}</div>}
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
    </div>
  );
};

export default Delete_user_comp;