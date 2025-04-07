import React from 'react'
import './DesignComponent.css'
import { assets } from '../../assets/assets';

const DesignComponent = ({ setShowLogin }) => {
    return (
        <div className="design-container">
            <h1 className="design-title">Design-ul care potențează productivitatea echipei tale</h1>

            <p className="design-intro">
                Un design intuitiv și bine structurat este esențial pentru succesul unui site Jira. Ne concentrăm pe claritate vizuală, ușurință în navigare și o estetică modernă care transformă gestionarea proiectelor într-o experiență fluidă.
            </p>

            <div className="section">
                <h2 className="section-title"> Management vizual organizat</h2>
                <p className="section-text">
                    Dashboard-urile și panourile Kanban sunt gândite pentru a oferi o vedere de ansamblu clară asupra task-urilor.
                    Colorează prioritățile, personalizează coloanele și urmărește progresul echipei într-un mod simplu și eficient.
                </p>
                <img src={assets.management} alt="Management vizual" className="image-board" />
            </div>

            <div className="section">
                <h2 className="section-title"> Experiență optimizată pentru colaborare</h2>
                <p className="section-text">
                    Design-ul paginilor de proiect facilitează colaborarea între membri, cu secțiuni dedicate pentru backlog, sprint-uri și comentarii.
                    Fiecare element este plasat strategic pentru a minimiza timpul pierdut și a maximiza claritatea.
                </p>
                <img src={assets.project2} alt="Pagina de proiect" className="image-board" />
            </div>

            <div className="section">
                <h2 className="section-title"> Elemente de design personalizabile</h2>
                <p className="section-text">
                    Alege culori, fonturi și layout-uri care se potrivesc culturii organizației tale. Design-ul adaptabil permite echipei să creeze un mediu de lucru care inspiră și motivează.
                </p>
            </div>

            <div className="cta-section">
                <h2 className="cta-title"> Redefinește modul în care echipa ta lucrează!</h2>
                <p className="cta-text">
                    Testează Jira acum și descoperă cum un design bine gândit poate îmbunătăți semnificativ eficiența echipei tale.
                </p>
                <button className="cta-button"onClick={() => setShowLogin(true)}>Începe gratuit</button>
            </div>
        </div>
    )
}

export default DesignComponent
