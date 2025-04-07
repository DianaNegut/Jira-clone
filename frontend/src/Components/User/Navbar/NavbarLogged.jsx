import React, { useState } from 'react';
import { ImMenu } from "react-icons/im";
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import './NavbarLogged.css';

const NavbarLogged = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
  };

  return (
    <div className="navbar-logged">
      <div className="navbar-top">
        <img
          src={assets.jira_logo}
          alt="Jira"
          className='logo'
          style={{ width: "80px", height: "auto", maxHeight: "30px" }}
        />
        <button className="menu-toggle" onClick={toggleMenu}>
          <ImMenu />
        </button>
      </div>

      <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/homelog" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/bugreport" onClick={() => setIsMenuOpen(false)}>Bug Report</Link></li>
        <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Setari</Link></li>
        <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profil</Link></li>
        <li><Link to="/timetracker" onClick={() => setIsMenuOpen(false)}>Timetracker</Link></li>
        <li><Link to="/choose-plan" onClick={() => setIsMenuOpen(false)}>Alege Plan</Link></li>
      </ul>

      <div className="navbar-right">
        <button onClick={() => onLogout()}>Logout</button>
      </div>
    </div>
  );
};

export default NavbarLogged;
