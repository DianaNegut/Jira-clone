import React from 'react';
import ChoosePlanComponent from '../../Components/User/ChoosePlan/ChoosePlanComponent';

const ChoosePlan = ({ setShowLogin, onLogout }) => {
  return (
    <div>
      
      <ChoosePlanComponent setShowLogin={setShowLogin} onLogout={onLogout} />
    </div>
  );
};

export default ChoosePlan;