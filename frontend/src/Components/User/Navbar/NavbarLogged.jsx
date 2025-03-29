import React from 'react';
import { ImMenu } from "react-icons/im";
import { Link } from 'react-router-dom';
import './NavbarLogged.css';

const NavbarLogged = ({ onLogout }) => {
  const handleLogoutClick = (e) => {
    e.preventDefault(); 
    onLogout(); 
  };

  return (
    <div className="menu">
      <ul className="menu-content">
        <li>
          <Link to="/homelog"><span className="material-symbols-outlined">home</span></Link>
          <span className="tooltip">Home</span>
        </li>
        <li>
          <Link to="/dashboard"><span className="material-symbols-outlined">dashboard</span></Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/tasks"><span className="material-symbols-outlined">Tactic</span></Link>
          <span className="tooltip">Taskuri</span>
        </li>
        <li>
          <Link to="/bugreport"><span className="material-symbols-outlined">bug_report</span></Link>
          <span className="tooltip">Bug Report</span>
        </li>
        <li>
          <Link to="/settings"><span className="material-symbols-outlined">settings</span></Link>
          <span className="tooltip">Setari</span>
        </li>
        <li>
          <Link to="/profile"><span className="material-symbols-outlined">person</span></Link>
          <span className="tooltip">Profil</span>
        </li>
        <li>
          <Link to="/timetracker"><span className="material-symbols-outlined">Schedule</span></Link>
          <span className="tooltip">Timetracker</span>
        </li>
        <li>
          <Link to="/explore"><span className="material-symbols-outlined">public</span></Link>
          <span className="tooltip">Exploreaza</span>
        </li>
        <li>
          {/* Înlocuim Link cu un element care apelează handleLogoutClick */}
          <a href="/" onClick={handleLogoutClick}>
            <span className="material-symbols-outlined">logout</span>
          </a>
          <span className="tooltip">Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default NavbarLogged;