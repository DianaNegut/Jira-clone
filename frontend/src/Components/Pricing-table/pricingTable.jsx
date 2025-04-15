import React, { useState } from 'react';
import { Paper, Dialog, DialogActions, DialogContent, Button, Stack, Typography } from '@mui/material';
import './pricingTable.css';
import PricingCard from '../PricingCard/PricingCard';

const PricingTable = ({setShowLogin}) => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [teamMembers, setTeamMembers] = useState('');
  const [recommendedPlan, setRecommendedPlan] = useState(null);

  const rows = [
    { plan: 'Basic Plan', price: '$10', duration: '1 luna', description: 'Obiective, proiecte, sarcini și formulare nelimitate. Aliniază proiectele și sarcinile cu obiectivele. Colectează date prin formulare.' },
    { plan: 'Standard Plan', price: '$25', duration: '3 luni', description: 'Roluri și permisiuni pentru utilizatori. Controlează ce pot crea, vizualiza și comenta utilizatorii în Jira.' },
    { plan: 'Premium Plan', price: '$50', duration: '6 luni', description: 'Planificare între echipe și gestionarea dependențelor. Planifică și urmărește obiectivele, proiectele și dependențele într-un singur loc.' },
    { plan: 'Enterprise Plan', price: '$100', duration: '1 an', description: 'Control avansat al administrării și securității. Gestionează utilizatorii și securitatea la scară largă cu controale avansate de guvernanță.' }
  ];

  const handleCardClick = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBuyNow = () => {
    alert(`You've chosen the ${selectedPlan.plan} for ${selectedPlan.price}!`);
  };

  const handleTeamMembersChange = (e) => {
    const numMembers = e.target.value;
    setTeamMembers(numMembers);

    if (numMembers < 10) {
      setRecommendedPlan('Basic Plan');
    } else if (numMembers >= 10 && numMembers <= 100) {
      setRecommendedPlan('Standard Plan');
    } else if (numMembers > 100 && numMembers <= 1000) {
      setRecommendedPlan('Premium Plan');
    } else if (numMembers > 1000) {
      setRecommendedPlan('Enterprise Plan');
    }
  };

  const getAdjustedPrice = (price) => {
    const basePrice = parseFloat(price.replace('$', ''));
    return isYearly ? basePrice * 12 : basePrice;
  };

  return (
    <div style={{ padding: '20px' }}>
            <div className="team-members-input">
        <label>Introduceți numărul de membri ai echipei:</label>
        <input
          type="number"
          value={teamMembers}
          onChange={handleTeamMembersChange}
          placeholder="Selecteaza" 
        />
      </div>

            <div className="pricing-toggle-buttons">
        <button
          className={`pricing-toggle-button ${!isYearly ? 'active' : ''}`}
          onClick={() => setIsYearly(false)}
        >
          Lunar
        </button>
        <button
          className={`pricing-toggle-button ${isYearly ? 'active' : ''}`}
          onClick={() => setIsYearly(true)}
        >
          Anual
        </button>
      </div>

            <div className="pricing-table">
        {rows.map((row) => (
          <div key={row.plan} className={`pricing-card-container ${recommendedPlan === row.plan ? 'recommended' : ''}`}>
                        {recommendedPlan === row.plan && (
              <div className="recommended-badge">
                Recommended
              </div>
            )}

            <PricingCard setShowLogin={setShowLogin}
              plan={row.plan}
              price={`$${getAdjustedPrice(row.price)}`}
              description={row.description}
              extraDetails={`Duration: ${row.duration}`}
              onClick={() => handleCardClick(row)}
            />
          </div>
        ))}
      </div>

            <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{selectedPlan?.plan}</Typography>
            <Button onClick={handleClose} style={{ fontSize: '24px' }}>
              ⧏
            </Button>
          </Stack>

          <Typography variant="subtitle1" color="textSecondary">
            {selectedPlan?.price} - {selectedPlan?.duration}
          </Typography>

          <Typography variant="body1" style={{ marginTop: '10px' }}>
            {selectedPlan?.description}
          </Typography>
        </DialogContent>

        <DialogActions className="dialog-actions-custom">
          <Button onClick={handleBuyNow} variant="contained" color="success">
            Buy Now
          </Button>
          <Button onClick={handleClose} style={{ color: 'white' }} className="dialog-button-custom">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PricingTable;