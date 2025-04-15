import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../../../assets/assets';
import './NavbarAdmin.css';

const Navbar = ({ menus, onLogout }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);


  useEffect(() => {
    const checkIfTablet = () => {
      const tabletWidth = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
      setIsTablet(tabletWidth.matches);
      
      
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };


    checkIfTablet();
    
    
    window.addEventListener('resize', checkIfTablet);
    
    
    return () => {
      window.removeEventListener('resize', checkIfTablet);
    };
  }, []);

  const handleMouseEnter = (index) => {
    if (!isTablet && !window.matchMedia('(max-width: 768px)').matches) {
      setActiveItem(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isTablet && !window.matchMedia('(max-width: 768px)').matches) {
      setActiveItem(null);
    }
  };

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = () => {
    if (isTablet || window.matchMedia('(max-width: 768px)').matches) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="jira-navbar-admin">
      <div className="navbar-brand-admin">
        <Link to="/" className="brand-link-admin">
          <img src={assets.jira_logo} alt="JIRA Logo" className="jira-logo-admin" />
        </Link>
      </div>

      <button 
        className="mobile-menu-toggle-admin" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className={`hamburger-icon-admin ${isMobileMenuOpen ? 'open' : ''}`}></div>
      </button>

      <ul className={`navbar-menu-admin ${isMobileMenuOpen ? 'open-admin' : ''} ${isTablet ? 'tablet-view' : ''}`}>
        {menus.map((menu, index) => (
          <li
            key={index}
            className={`navbar-item-admin ${activeItem === index ? 'active-admin' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to={menu.path} 
              className="navbar-link-admin"
              onClick={handleNavItemClick}
            >
              <div className="icon-container-admin">
                {menu.icon && <img src={menu.icon} alt={menu.label} className="menu-icon-admin" />}
              </div>
              <span className="menu-label-admin">{menu.label}</span>
            </Link>
          </li>
        ))}
        <li className="navbar-item-admin logout-item-admin">
          <button onClick={handleLogout} className="logout-button-admin">
            <div className="icon-container-admin logout-icon-container-admin">
              <img src={assets.logout} alt="Logout" className="menu-icon-admin logout-icon-admin" />
            </div>
            <span className="menu-label-admin logout-label-admin">Logout</span>
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
    { path: "/add-team", label: "Adauga echipa", icon: assets.team_create },
    { path: "/see-all-users", label: "Vezi toti utilizatorii", icon: assets.profile },
    { path: "/see-all-tasksadmin", label: "Vezi toate taskurile", icon: assets.project2 },
    { path: "/bug-report-admin", label: "Raporteaza un bug", icon: assets.board_icon },
    { path: "/setting-admin", label: "Setari", icon: assets.settings_icon },
    { path: "/mytasks", label: "Taskurile mele", icon: assets.email }
  ];

  return <Navbar menus={adminMenus} onLogout={onLogout} />;
};

export default NavbarAdmin;