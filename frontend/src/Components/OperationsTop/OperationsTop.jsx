import React from 'react';
import './OperationsTop.css';

const OperationsTop = () => {
    return (
        <div className="operations-container">
            <h1 className='subtitluOperations fadeIn'>Monitorizare în timp real</h1>
            <p className='paragrafeOperations fadeIn'>Urmărim constant performanța aplicației pentru a detecta și rezolva rapid orice problemă.</p>
            <p className='paragrafeOperations fadeIn'>Monitorizarea 24/7 asigură stabilitatea și fiabilitatea sistemului, astfel încât echipa ta să se concentreze pe inovație, nu pe întreruperi.</p>

            <h1 className='subtitluOperations fadeIn'>Automatizări inteligente</h1>
            <p className='paragrafeOperations fadeIn'>Reducem sarcinile manuale repetitive prin implementarea de automatizări care accelerează livrarea și minimizează erorile.</p>
            <p className='paragrafeOperations fadeIn'>De la testare continuă la implementări fără downtime, ne asigurăm că totul funcționează fluid.</p>

            <h1 className='subtitluOperations fadeIn'>Tehnologii și instrumente utilizate</h1>
            <div className='operations-section fadeIn'>
                <ul className='operations-list'>
                    <li> <strong>Containerizare:</strong> Docker, Kubernetes</li>
                    <li> <strong>Monitorizare:</strong> Prometheus, Grafana</li>
                    <li> <strong>Securitate:</strong> OAuth, SSL/TLS, WAF</li>
                    <li> <strong>CI/CD:</strong> Jenkins, GitLab CI</li>
                    <li> <strong>Management log-uri:</strong> ELK Stack (Elasticsearch, Logstash, Kibana)</li>
                </ul>
            </div>

            <h1 className='subtitluOperations fadeIn'>De ce contează toate acestea?</h1>
            <div className='operations-section fadeIn'>
                <ul className='operations-list'>
                    <li> <strong>Mai puțin timp pierdut cu depanarea problemelor</strong></li>
                    <li> <strong>Timp de răspuns rapid în fața incidentelor</strong></li>
                    <li> <strong>Performanță constantă chiar și la vârfuri de trafic</strong></li>
                    <li> <strong>Infrastructură pregătită pentru viitor</strong></li>
                    <li> <strong>Management log-uri:</strong> ELK Stack (Elasticsearch, Logstash, Kibana)</li>
                </ul>
            </div>
        </div>
    );
}

export default OperationsTop;
