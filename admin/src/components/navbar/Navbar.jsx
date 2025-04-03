import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './Navbar.css';

const Navbar = ({ menus }) => {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    setActiveItem(index);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
  };

  const handleLogout = () => {
    // Implementează aici logica ta de logout
    localStorage.removeItem('token'); // Exemplu: șterge token-ul din localStorage
    navigate('/login'); // Redirecționează utilizatorul către pagina de login
  };

  return (
    <nav className="jira-navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src={assets.jira_logo} alt="JIRA Logo" className="jira-logo" />
        </Link>
      </div>

      <ul className="navbar-menu">
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
          <button onClick={handleLogout} className="logout-button">
            <div className="icon-container logout-icon-container">
              {assets.logout && <img src={assets.logout} alt="Logout" className="menu-icon logout-icon" />}
            </div>
            <span className="menu-label logout-label">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

const AppNavbar = () => {
  const navigationMenus = [
    { path: "/add-user", label: "Adaugare User", icon: assets.profile },
    { path: "/add-user-team", label: "Adaugare User la Echipă", icon: assets.team },
    { path: "/statistics", label: "Statistici", icon: assets.clock },
    { path: "/delete-user", label: "Ștergere User", icon: assets.delete_im }, 
    {
      path: "/add-team", label: "Adauga echipa", icon: assets.team_create
    }
  ];

  return <Navbar menus={navigationMenus} />;
};

export default AppNavbar;