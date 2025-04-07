import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../../../assets/assets';
import './NavbarAdmin.css';

const Navbar = ({ menus, onLogout }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State pentru meniul hamburger

  const handleMouseEnter = (index) => {
    setActiveItem(index);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    onLogout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="jira-navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src={assets.jira_logo} alt="JIRA Logo" className="jira-logo" />
        </Link>
      </div>

      {/* Buton hamburger pentru mobil */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <div className="hamburger-icon"></div>
      </button>

      <ul className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {menus.map((menu, index) => (
          <li
            key={index}
            className={`navbar-item ${activeItem === index ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={menu.path} className="navbar-link">
              <div className="icon-container">
                {menu.icon && <img src={menu.icon} alt={menu.label} className="menu-icon" />}
              </div>
              <span className="menu-label">{menu.label}</span>
            </Link>
          </li>
        ))}
        <li className="navbar-item logout-item">
          <button onClick={onLogout} className="logout-button">
            <div className="icon-container logout-icon-container">
              <img src={assets.logout} alt="Logout" className="menu-icon logout-icon" />
            </div>
            <span className="menu-label logout-label">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

const NavbarAdmin = ({ onLogout }) => {
  const adminMenus = [
    { path: "/add-user", label: "Adaugare User", icon: assets.profile },
    { path: "/add-user-team", label: "Adaugare User la Echipă", icon: assets.team },
    { path: "/statistics", label: "Statistici", icon: assets.clock },
    { path: "/delete-user", label: "Ștergere User", icon: assets.delete_im },
    {
      path: "/add-team", label: "Adauga echipa", icon: assets.team_create
    }
  ];

  return <Navbar menus={adminMenus} onLogout={onLogout} />;
};

export default NavbarAdmin;
