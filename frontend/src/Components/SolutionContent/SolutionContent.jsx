import React from 'react';
import './SolutionContent.css';

const SolutionsContent = () => {
    const solutions = [
        {
            id: "marketing",
            title: "Marketing",
            description: "Planifică și lansează campanii eficiente. Colaborează cu echipa, urmărește rezultatele și ajustează strategia în timp real."
        },
        {
            id: "engineering",
            title: "Engineering",
            description: "Gestionează backlog-ul, planifică sprinturi și lansează produse de calitate. Jira te ajută să organizezi și să prioritizezi sarcinile."
        },
        {
            id: "design",
            title: "Design",
            description: "Transformă ideile în realitate vizuală. Colaborează cu echipele de produs și dezvoltare pentru o experiență utilizator impecabilă."
        },
        {
            id: "operations",
            title: "Operations",
            description: "Optimizează procesele și urmărește performanța echipei. Asigură-te că fiecare proiect este livrat la timp și fără probleme."
        }
    ];

    return (
        <div className="solutions-page">
            <header>
                <h1>Descoperă soluțiile Jira pentru echipa ta</h1>
                <p>Fie că lucrezi în dezvoltare software, marketing sau operațiuni, avem instrumentele potrivite pentru tine.</p>
            </header>

            <nav className="solutions-buttons">
                {solutions.map((solution) => (
                    <a 
                        key={solution.id} 
                        href={`#${solution.id}`} 
                        className="btn"
                    >
                        {solution.title}
                    </a>
                ))}
            </nav>

            <main>
                {solutions.map((solution) => (
                    <section 
                        key={solution.id} 
                        id={solution.id} 
                        className="solution-section"
                    >
                        <h2>{solution.title}</h2>
                        <p>{solution.description}</p>
                    </section>
                ))}
            </main>

            
        </div>
    );
};

export default SolutionsContent;
