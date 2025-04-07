import React, { useState, useEffect } from 'react';
import './ChoosePlanComponent.css';
import { getCurrentUser, fetchWithToken } from '../../../utils/authUtils';

const setCompanyNameForUser = async (userId, newCompanyName) => {
  try {
    const response = await fetchWithToken('http://localhost:4000/api/user/set-company-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newCompanyName }),
    });

    if (response.success) {
      console.log('Company name updated:', response);
    } else {
      console.error('Error setting company name:', response.message);
    }
  } catch (error) {
    console.error('Network error setting company name:', error);
  }
};

const createCompany = async (name, planType, paymentFrequency) => {
  const startDate = new Date();
  const expirationDate = new Date(startDate);
  expirationDate.setMonth(startDate.getMonth() + (paymentFrequency === 'anual' ? 12 : 1));

  try {
    const response = await fetchWithToken('http://localhost:4000/api/company/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        planType,
        paymentFrequency: paymentFrequency === 'lunar' ? 'monthly' : 'annually',
        startDate,
        expirationDate,
        teams: [],
      }),
    });

    if (response._id) {
      console.log('Company created:', response);
    } else {
      console.error('Error creating company:', response.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Network error creating company:', error);
  }
};

const ChoosePlanComponent = ({ onLogout, setShowLogin }) => {
  const [isPrePopupOpen, setIsPrePopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('lunar');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [userRole, setUserRole] = useState('Angajat');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyAssigned, setCompanyAssigned] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      fetchUserData(user.id);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onLogout();
    }
    return () => clearTimeout(timer);
  }, [countdown, onLogout]);

  const fetchUserData = async (userId) => {
    try {
      console.log('Fetching user data...');
      const data = await fetchWithToken(`http://localhost:4000/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Parsed user data:', data);

      if (data.success) {
        setUserRole(data.user.role);
        console.log('User company:', data.user.companyName);
        const userCompanyName = data.user.companyName || '';
        setCompanyAssigned(!!userCompanyName);
        setCompanyName(userCompanyName);
      } else {
        throw new Error(data.message || 'Eroare la obținerea datelor utilizatorului');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setCompanyAssigned(false);
      setCompanyName('');
    }
  };

  const handlePlanClick = (plan) => {
    if (companyAssigned) return;
    setSelectedPlan(plan);
    setIsPrePopupOpen(true);
  };

  const closePrePopup = () => {
    setIsPrePopupOpen(false);
    setSelectedPlan(null);
  };

  const handlePrePopupSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim()) {
      setIsPrePopupOpen(false);
      setIsPopupOpen(true);
    } else {
      alert('Vă rugăm să introduceți numele companiei.');
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlan(null);
    setCompanyName('');
    setPaymentFrequency('lunar');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetchWithToken(
        'http://localhost:4000/api/user/update-role',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            newRole: 'Administrator',
          }),
        }
      );

      if (response.success) {
        setUserRole('Administrator');
        setIsSnackbarOpen(true);
        // Create new company
        await createCompany(companyName, selectedPlan, paymentFrequency);
        // Set company name for the user
        await setCompanyNameForUser(currentUser.id, companyName);
        setTimeout(() => {
          setIsSnackbarOpen(false);
          if (!companyAssigned) {
            setCountdown(5);
          }
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating user role, creating company, or setting company name:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      closePopup();
    }
  };

  return (
    <div className="choose-plan-container">
      {countdown !== null ? (
        <div className="logout-message">
          <div>
            <p>Veți fi delogat în {countdown} secunde...</p>
            <p>Vă rugăm să vă autentificați din nou.</p>
          </div>
        </div>
      ) : (
        <>
          <h1 className="title">Prețuri simple și transparente pentru fiecare echipă.</h1>
          <div style={{ background: '#eee', padding: '5px', marginBottom: '15px', fontSize: '12px' }}>
            Debug: Company Assigned: {companyAssigned ? 'Yes' : 'No'}, Company Name: {companyName || 'None'}, Is Popup Open: {isPopupOpen ? 'Yes' : 'No'}, Countdown: {countdown !== null ? `${countdown} secunde` : 'N/A'}
          </div>

          {companyAssigned ? (
            <div className="company-already-assigned">
              <div className="message-container">
                <h2>Aveți deja o echipă atribuită</h2>
                <p>Nu puteți deveni administrator. Trebuie să fiți numit ca administrator sau să vă creați un alt cont.</p>
                <p>Companie curentă: <strong>{companyName}</strong></p>
              </div>
            </div>
          ) : (
            <>
              <div className="team-input">
                <label>Introduceti numărul de membri ai echipei: </label>
                <input type="number" placeholder="Selecteaza" />
                <button className="submit-btn">Lunar</button>
                <button className="cancel-btn">Anul</button>
              </div>

              <div className="plans-container">
                {['Basic', 'Standard', 'Premium', 'Enterprise'].map((name, i) => (
                  <div className="plan-card" key={name}>
                    <h2>{name} Plan</h2>
                    <p>Coordonare echipă pentru o colaborare perfectă!</p>
                    <h3>${[10, 25, 50, 100][i]}</h3>
                    <p className="per-user">Pe utilizator / lună</p>
                    <button className="plan-btn" onClick={() => handlePlanClick(`${name} Plan`)}>Începe!</button>
                  </div>
                ))}
              </div>

              {isPrePopupOpen && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <h2>Configurați detaliile pentru {selectedPlan}</h2>
                    <form onSubmit={handlePrePopupSubmit}>
                      <div className="form-group">
                        <label>Numele companiei:</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Introduceți numele companiei"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Frecvența plăților:</label>
                        <select value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)} required>
                          <option value="lunar">Lunar</option>
                          <option value="anual">Anual</option>
                        </select>
                      </div>
                      <button type="submit" className="submit-payment-btn">Continuă</button>
                      <button type="button" className="cancel-payment-btn" onClick={closePrePopup}>Anulează</button>
                    </form>
                  </div>
                </div>
              )}

              {isPopupOpen && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <h2>Finalizați achiziția pentru {selectedPlan}</h2>
                    <p>Companie: {companyName}</p>
                    <p>Frecvență plată: {paymentFrequency === 'lunar' ? 'Lunar' : 'Anual'}</p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Număr card:</label>
                        <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="form-group">
                        <label>Data expirării:</label>
                        <input type="text" name="expiryDate" placeholder="MM/YY" required />
                      </div>
                      <div className="form-group">
                        <label>CVV:</label>
                        <input type="text" name="cvv" placeholder="123" required />
                      </div>
                      <button type="submit" className="submit-payment-btn" disabled={isLoading}>
                        {isLoading ? 'Se procesează...' : 'Plătește'}
                      </button>
                      <button type="button" className="cancel-payment-btn" onClick={closePopup} disabled={isLoading}>
                        Anulează
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {isSnackbarOpen && (
            <div className="snackbar">
              Tranzacția pentru {selectedPlan} a fost finalizată cu succes! Rolul dumneavoastră a fost actualizat la Administrator.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChoosePlanComponent;