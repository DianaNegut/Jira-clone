import React from 'react';
import './FeatureContent.css';
import { assets } from '../../assets/assets';

const FeatureContent = () => {
  return (
    <div className="feature-container">
      <h1 className="titlu">
      Locul unde dezvoltatorii, specialiștii în marketing și toate echipele colaborează pentru a-și duce munca la bun sfârșit.
      </h1>

      <div className="feature-container-content">
        <img src={assets.backlog} alt="Backlog" className="image-backlog" />

       
        <div className="text-content">
          <h3 className="titlu-plan">Plan</h3>
          <p className="paragraf-feature">
          Aliniază echipele, resursele și livrabilele pentru a te asigura că proiectul respectă termenele limită și se aliniază cu obiectivele companiei încă de la început.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureContent;
