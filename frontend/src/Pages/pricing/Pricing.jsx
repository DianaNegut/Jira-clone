import React from "react";  
import PricingTable from "../../Components/Pricing-table/pricingTable";
import './Pricing.css';
import PricingJos from "../../Components/PricingDown/PricingJos";



const Pricing = () => {
  return (
    <div>
        <h1 className="title">Simple, transparent pricing for every team.</h1>
        <PricingTable />  
        <PricingJos />
    </div>
);
  };
  
  export default Pricing;
