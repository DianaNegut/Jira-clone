import React from 'react';
import './Statistici_comp.css';

const Statistici_comp = () => {
  const statistici = {
    utilizatoriTotali: 150,
    echipeTotale: 25,
    proiecteTotale: 50,
    taskuriTotale: 300,
    taskuriFinalizate: 220,
    taskuriInDesfasurare: 80,
  };

  return (
    <div className="statistici-container">
      <h2>Statistici</h2>
      <div className="statistici-grid">
        <div className="statistica-item utilizatori">
          <h3>Utilizatori Totali</h3>
          <p>{statistici.utilizatoriTotali}</p>
        </div>
        <div className="statistica-item echipe">
          <h3>Echipe Totale</h3>
          <p>{statistici.echipeTotale}</p>
        </div>
        <div className="statistica-item proiecte">
          <h3>Proiecte Totale</h3>
          <p>{statistici.proiecteTotale}</p>
        </div>
        <div className="statistica-item taskuri">
          <h3>Task-uri Totale</h3>
          <p>{statistici.taskuriTotale}</p>
        </div>
        <div className="statistica-item finalizate">
          <h3>Task-uri Finalizate</h3>
          <p>{statistici.taskuriFinalizate}</p>
        </div>
        <div className="statistica-item in-desfasurare">
          <h3>Task-uri În Desfășurare</h3>
          <p>{statistici.taskuriInDesfasurare}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistici_comp;