import React, { useState, useEffect } from 'react';
import './Add_user_comp.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getCurrentUser, fetchWithToken } from '../../../../utils/authUtils';

const Add_user_comp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    role: 'Angajat',
    useExistingAccount: false,
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [companyName, setCompanyName] = useState(null); // Starea pentru numele companiei

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getCurrentUser();
        if (!user || !user.id) throw new Error("User not authenticated");
  
        const userDetails = await fetchWithToken(`http://localhost:4000/api/user/${user.id}`);
  
        if (!userDetails || !userDetails.user) {
          throw new Error("User data not available");
        }
  
        setCurrentUser(userDetails.user);
  
        // Dacă userul are companie, setăm compania
        if (userDetails.user.companyName) {
          setCompanyName(userDetails.user.companyName);
          setFormData((prev) => ({
            ...prev,
            companyName: userDetails.user.companyName,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Nu s-au putut obține datele utilizatorului.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const associateCompanyWithExistingUser = async () => {
    try {
      // 1. Verificăm dacă există un utilizator cu acest email
      const emailCheckResponse = await fetch(`http://localhost:4000/api/user/email/${formData.email}`);
      const emailCheckData = await emailCheckResponse.json();
      
      if (!emailCheckResponse.ok) {
        throw new Error("Nu s-a putut verifica emailul.");
      }
      
      if (!emailCheckData.user) {
        return setError("Nu există un utilizator cu acest email. Creați un nou utilizator.");
      }
      
      // 2. Asociem compania utilizatorului curent cu utilizatorul găsit
      const response = await fetch('http://localhost:4000/api/user/set-company-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: emailCheckData.user._id,
          newCompanyName: companyName || formData.companyName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      setSuccess(`Utilizatorul ${emailCheckData.user.name} a fost asociat cu succes companiei ${companyName || formData.companyName}.`);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: companyName || '',
        role: 'Angajat',
        useExistingAccount: false,
      });
      
    } catch (error) {
      console.error('Error associating company with existing user:', error);
      setError(error.message || 'A apărut o eroare la asocierea companiei cu utilizatorul existent.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.useExistingAccount) {
      // În loc să afișăm doar un mesaj, vom apela funcția pentru asocierea companiei
      await associateCompanyWithExistingUser();
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
          phone: formData.phone,
          companyName: formData.companyName || companyName, // Folosește compania curentă dacă nu este modificată
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setSuccess(data.message || 'Utilizatorul a fost creat cu succes! O parolă temporară a fost trimisă pe email.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: companyName || '', // Resetează la compania curentă
        role: 'Angajat',
        useExistingAccount: false,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'A apărut o eroare la adăugarea utilizatorului.');
    }
  };

  if (loading) {
    return <div className="add-user-container">Se încarcă...</div>;
  }

  if (!currentUser) {
    return (
      <div className="add-user-container">
        <Alert severity="error">Trebuie să fii autentificat pentru a adăuga utilizatori.</Alert>
      </div>
    );
  }

  return (
    <div className="add-user-container">
      <h2>Adăugare Utilizator</h2>
      {companyName && (
        <p className="company-info">
         <strong>{companyName}</strong>
        </p>
      )}
      
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
            required
            placeholder={formData.useExistingAccount ? "Introdu e-mailul contului existent" : "Introdu e-mailul"}
          />
        </div>
        
        {!formData.useExistingAccount && (
          <>
            <div className="form-group">
              <label htmlFor="phone">Telefon:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Introdu telefonul (opțional)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyName">Nume Companie:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Introdu numele companiei"
                required
                readOnly={!!companyName} // Face câmpul readonly dacă există deja o companie
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Angajat">Angajat</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="useExistingAccount"
              checked={formData.useExistingAccount}
              onChange={handleChange}
            />
            Am deja un cont și vreau să îl folosesc
          </label>
        </div>
        
        <button type="submit" className="submit-btn">
          {formData.useExistingAccount ? 'Asociază Contul Existent' : 'Adaugă Utilizator'}
        </button>
      </form>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Add_user_comp;