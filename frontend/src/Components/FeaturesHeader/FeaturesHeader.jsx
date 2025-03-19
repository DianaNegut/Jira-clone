import React from 'react';
import { assets } from '../../assets/assets';
import './FeaturesHeader.css';

const FeaturesHeader = () => {
  return (
    <div>
      <div className="header">
       
        <div className="text-container">
          <h1 className="title">Funcționalități de gestionare a proiectelor pentru toate echipele!</h1>
          <p className="description">
          Creat pentru fiecare echipă, Jira este instrumentul prin care organizațiile moderne duc munca de la „de făcut” la „finalizat”.
          </p>
        </div>

        
        <img src={assets.project} alt="" className="image" />
      </div>
    </div>
  );
};

export default FeaturesHeader;
