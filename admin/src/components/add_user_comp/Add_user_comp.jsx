import React, { useState } from 'react';
import './Add_user_comp.css';

const Add_user_comp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Added phone field
    companyName: '', // Added companyName field
    role: 'developer',
    useExistingAccount: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.useExistingAccount) {
      setMessage('Te rugăm să te autentifici cu contul tău existent pe pagina de login.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/user/register-temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone, // Include phone in the request
          companyName: formData.companyName, // Include companyName in the request
          role: formData.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Eroare la adăugarea utilizatorului');
      }

      const data = await response.json();
      setMessage(data.message || 'Utilizatorul a fost creat cu succes! O parolă temporară a fost trimisă pe email.');
      setTimeout(() => setMessage(''), 3000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        role: 'developer',
        useExistingAccount: false,
      });
    } catch (error) {
      setMessage(error.message || 'A apărut o eroare la adăugarea utilizatorului.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="add-user-container">
      <h2>Adăugare Utilizator</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="add-user-form">
        {!formData.useExistingAccount && (
          <div className="form-group">
            <label htmlFor="name">Nume:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!formData.useExistingAccount}
              placeholder="Introdu numele"
              disabled={formData.useExistingAccount}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required={true}
            placeholder={formData.useExistingAccount ? "Introdu e-mailul cu care ai contul" : "Introdu e-mailul"}
            disabled={false}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input // Added phone input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Introdu telefonul"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Nume Companie:</label>
          <input // Added companyName input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Introdu numele companiei"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={formData.useExistingAccount}
          >
            <option value="developer">Dezvoltator</option>
            <option value="admin">Administrator</option>
            <option value="tester">Tester</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="useExistingAccount"
              checked={formData.useExistingAccount}
              onChange={handleChange}
            />{' '}
            Am deja un cont și vreau să îl folosesc
          </label>
        </div>
        <button type="submit" className="submit-btn">
          Adaugă Utilizator
        </button>
      </form>
    </div>
  );
};

export default Add_user_comp;