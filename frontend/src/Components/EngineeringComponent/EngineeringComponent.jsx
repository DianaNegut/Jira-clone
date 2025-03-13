import React from 'react';
import './EngineeringComponent.css';

const EngineeringComponent = () => {
    return (
        <div className="engineering-container">
            <h1 className="engineering-title">Inovație și scalabilitate în spatele fiecărei funcționalități</h1>
            
            <p className="engineering-intro">
                Fiecare componentă Jira este construită cu grijă pentru performanță, securitate și flexibilitate.  
                Arhitectura modernă și procesele DevOps asigură o experiență fiabilă și rapidă, indiferent de complexitatea proiectelor tale.
            </p>

            <div className="section">
                <h2 className="section-title">🔧 Arhitectură scalabilă și fiabilă</h2>
                <p className="section-text">
                    Jira este construit pe o arhitectură microservicii, care permite scalarea rapidă în funcție de nevoile echipei tale.  
                    Fiecare serviciu este izolat și optimizat pentru performanță maximă, asigurând o disponibilitate de aproape 100%.
                </p>
                {/* <img src={assets.architecture} alt="Arhitectură" className="image-engineering" /> */}
            </div>

            <div className="section">
                <h2 className="section-title">🚀 Fluxuri DevOps și livrare continuă</h2>
                <p className="section-text">
                    Automatizăm pipeline-urile CI/CD pentru a permite implementări rapide și sigure.  
                    De la testare automată la monitorizare constantă, ne asigurăm că fiecare release este stabil și pregătit pentru producție.
                </p>
                {/* <img src={assets.devops} alt="DevOps" className="image-engineering" /> */}
            </div>

            <div className="section">
                <h2 className="section-title">🛡️ Securitate de top</h2>
                <p className="section-text">
                    Folosim protocoale de securitate avansate (SSL/TLS, OAuth, JWT) pentru a proteja datele sensibile ale utilizatorilor.  
                    Auditările periodice și testele de penetrare garantează că sistemul rămâne rezistent la amenințări.
                </p>
            </div>

            <div className="section">
                <h2 className="section-title">📊 Observabilitate și optimizare continuă</h2>
                <p className="section-text">
                    Monitorizăm metrice esențiale în timp real cu ajutorul Prometheus și Grafana, iar log-urile sunt procesate prin ELK Stack.  
                    Această abordare ne permite să anticipăm problemele și să optimizăm continuu performanța platformei.
                </p>
            </div>

            <div className="cta-section">
                <h2 className="cta-title">✨ Construiește viitorul dezvoltării software cu Jira!</h2>
                <p className="cta-text">
                    Explorează infrastructura de ultimă generație care susține echipele de top din întreaga lume.
                </p>
                
            </div>
        </div>
    );
};

export default EngineeringComponent;
