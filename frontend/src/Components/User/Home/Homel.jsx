import React from 'react';
import './Homel.css';

const Homel = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-box full-width">
        <h3>Introducere</h3>
        <div className="dashboard-content">
          <p>Bine ai venit la  <strong>JIRA</strong></p>
          <p>Nu stii de unde sa incepi? Verifica taskurile active!.</p>
        </div>
      </div>

      <div className="dashboard-box">
        <h3>Asignate mie</h3>
        <div className="dashboard-content">
          <p>Taskuri active</p>
        </div>
      </div>

      <div className="dashboard-box">
        <h3>Activitatea colegilor</h3>
        <div className="dashboard-content">
          <p>Modificari recente ale echipei tale</p>
        </div>
      </div>
    </div>
  );
};

export default Homel;
