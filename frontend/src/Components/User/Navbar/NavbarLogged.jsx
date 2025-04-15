import React, { useState, useEffect } from 'react';
import { ImMenu } from "react-icons/im";
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import './NavbarLogged.css';

const NavbarLogged = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    console.log("Menu state changed to:", isMenuOpen);
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
 
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Toggle menu clicked. Current state:", isMenuOpen);
    setIsMenuOpen(prevState => !prevState);
    console.log("Menu state after toggle should be:", !isMenuOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.navbar-menu');
      const menuButton = document.querySelector('.menu-toggle');
      
      if (isMenuOpen && menu && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="navbar-logged">
      <div className="navbar-top">
        <img
          src={assets.jira_logo}
          alt="Jira"
          className='logo'
          style={{ width: "80px", height: "auto", maxHeight: "30px" }}
        />
        <button 
          className="menu-toggle" 
          onClick={toggleMenu} 
          type="button"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <ImMenu style={{ pointerEvents: 'none' }} />
        </button>
      </div>

  
      <ul 
        className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}
        style={{ display: isMenuOpen ? 'flex' : 'none' }}
      >
        <li><Link to="/homelog" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
        <li><Link to="/bugreport" onClick={() => setIsMenuOpen(false)}>Bug Report</Link></li>
        <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Setari</Link></li>
        <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profil</Link></li>
        <li><Link to="/timetracker" onClick={() => setIsMenuOpen(false)}>Timetracker</Link></li>
        <li><Link to="/seealltasks" onClick={() => setIsMenuOpen(false)}>Vezi taskuri</Link></li>
        <li><Link to="/choose-plan" onClick={() => setIsMenuOpen(false)}>Alege Plan</Link></li>
       
      </ul>

      <div className="navbar-right">
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </div>
  );
};

export default NavbarLogged;