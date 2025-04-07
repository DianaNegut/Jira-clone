import React from 'react';
import ChoosePlanComponent from '../../Components/User/ChoosePlan/ChoosePlanComponent';

// Receive onLogout as a prop here
const ChoosePlan = ({ setShowLogin, onLogout }) => {
  return (
    <div>
      {/* Pass onLogout down to ChoosePlanComponent */}
      <ChoosePlanComponent setShowLogin={setShowLogin} onLogout={onLogout} />
    </div>
  );
};

export default ChoosePlan;