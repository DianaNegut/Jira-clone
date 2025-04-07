import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImMenu } from 'react-icons/im'; // Import menu icon
import { assets } from '../../assets/assets';
import './Navbar.css';

const Navbar = ({ menus }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.classList.contains('menu-toggle') &&
          !event.target.parentElement?.classList.contains('menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <nav className="jira-navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <Link to="/" className="brand-link">
            <img src={assets.jira_logo} alt="JIRA Logo" className="logo" />
          </Link>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <ImMenu />
          </button>
        </div>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
          {menus.map((menu, index) => (
            <li key={index} className="navbar-item">
              <Link 
                to={menu.path} 
                className="navbar-link" 
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="icon-container">
                  {menu.icon && <img src={menu.icon} alt={menu.label} className="menu-icon" />}
                </div>
                <span className="menu-label">{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="navbar-right">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const AppNavbar = () => {
  const navigationMenus = [
    { path: "/add-user", label: "Adaugare User", icon: assets.profile },
    { path: "/add-user-team", label: "Adaugare User la Echipă", icon: assets.team },
    { path: "/statistics", label: "Statistici", icon: assets.clock },
    { path: "/delete-user", label: "Ștergere User", icon: assets.delete_im },
    { path: "/add-team", label: "Adauga echipa", icon: assets.team_create },
    { path: "/see_all_users", label: "Vezi toti userii", icon: assets.see_all_users },
  ];

  return <Navbar menus={navigationMenus} />;
};

export default AppNavbar;