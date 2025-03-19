import React, { useState } from 'react';
import './PricingCard.css';

const PricingCard = ({ plan, price, description, extraDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="pricing-card">
      <h2 className="plan-title">{plan}</h2>
      <p className="plan-subtitle">Coordonează echipele pentru o colaborare perfectă!</p>

      <p className="price">{price}</p>
      <p className="price-desc">Pe utilizator / lună</p>

      <button className="trial-button">Începe perioada de testare gratuită!</button>

      <div className="separator"></div>

      <div className="details-section">
        <p className="details-header">Tot ce oferă planul</p>
        <button className="expand-button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '⧏' : '⧐'}
        </button>
      </div>

      {showDetails && <p className="extra-details">{extraDetails}</p>}
    </div>
  );
};

export default PricingCard;