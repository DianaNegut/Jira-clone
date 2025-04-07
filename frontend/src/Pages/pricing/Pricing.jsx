import React from "react";  
import PricingTable from "../../Components/Pricing-table/pricingTable";
import './Pricing.css';
import PricingJos from "../../Components/PricingDown/PricingJos";



const Pricing = ({setShowLogin}) => {
  return (
    <div>
        <h1 className="title">Prețuri simple și transparente pentru fiecare echipă.</h1>
        <PricingTable setShowLogin={setShowLogin} />  
        <PricingJos />
    </div>
);
  };
  
  export default Pricing;
