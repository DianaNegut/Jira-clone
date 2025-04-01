import React from 'react';
import { ImMenu } from "react-icons/im";
import { Link } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import './NavbarLogged.css';

const NavbarLogged = ({ onLogout }) => {
  const handleLogoutClick = (e) => {
    e.preventDefault(); 
    onLogout(); 
  };

  return (
    <div className="navbar-logged">
      <img src={assets.jira_logo_icon} alt="" className='logo' />
      <ul className="navbar-menu">
        <li><Link to="/homelog">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/bugreport">Bug Report</Link></li>
        <li><Link to="/settings">Setari</Link></li>
        <li><Link to="/profile">Profil</Link></li>
        <li><Link to="/timetracker">Timetracker</Link></li>
        
        
      </ul>
      <div className="navbar-right">
        <button onClick={() => onLogout()}>Logout</button>
      </div>
    </div>
  );
};

export default NavbarLogged;
