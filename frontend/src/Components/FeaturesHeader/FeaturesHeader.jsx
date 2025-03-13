import React from 'react';
import { assets } from '../../assets/assets';
import './FeaturesHeader.css';

const FeaturesHeader = () => {
  return (
    <div>
      <div className="header">
        {/* Container pentru text */}
        <div className="text-container">
          <h1 className="title">Project management features for all teams</h1>
          <p className="description">
            Built for every team, Jira is how modern organizations take work from to-do to done.
          </p>
        </div>

        {/* Imaginea */}
        <img src={assets.project} alt="" className="image" />
      </div>
    </div>
  );
};

export default FeaturesHeader;
