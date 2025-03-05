import React, { useState } from 'react';
import './PricingCard.css';

const PricingCard = ({ plan, price, description, extraDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="pricing-card">
      <h2 className="plan-title">{plan}</h2>
      <p className="plan-subtitle">Align multiple teams</p>

      <p className="price">{price}</p>
      <p className="price-desc">per user / month</p>

      <button className="trial-button">Start free trial</button>

      <div className="separator"></div>

      <div className="details-section">
        <p className="details-header">Everything from Standard plus:</p>
        <button className="expand-button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '⧏' : '⧐'}
        </button>
      </div>

      {showDetails && <p className="extra-details">{extraDetails}</p>}
    </div>
  );
};

export default PricingCard;