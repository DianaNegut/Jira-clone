import React from 'react';
import './FeatureContent.css';
import { assets } from '../../assets/assets';

const FeatureContent = () => {
  return (
    <div className="feature-container">
      <h1 className="titlu">
        Where devs, marketers, and every team in between get work done
      </h1>

      <div className="feature-container-content">
        {/* Imaginea backlog */}
        <img src={assets.backlog} alt="Backlog" className="image-backlog" />

        {/* Titlul și paragraful */}
        <div className="text-content">
          <h3 className="titlu-plan">Plan</h3>
          <p className="paragraf-feature">
            Align teams, resources, and deliverables to ensure the project hits deadlines and maps to company goals from the start.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureContent;
