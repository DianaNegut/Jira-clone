import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets'; // Asigură-te că path-ul este corect
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home"); // Recomandare: Setează starea inițială pe baza rutei curente dacă e posibil
  const [isSolutionsHovered, setIsSolutionsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null); // Ref pentru iconița hamburger

  // Definește conținutul căutabil (rămâne la fel)
  const searchableContent = [
    { title: 'Home', path: '/', keywords: ['home', 'welcome', 'jira'] },
    { title: 'Features', path: '/features', keywords: ['features', 'functionalities', 'tools'] },
    { title: 'Solutions', path: '/solutions', keywords: ['solutions', 'tools', 'jira solutions'] },
    { title: 'Marketing', path: '/marketing', keywords: ['marketing', 'campaigns', 'advertising'] },
    { title: 'Engineering', path: '/engineering', keywords: ['engineering', 'development', 'coding'] },
    { title: 'Design', path: '/design', keywords: ['design', 'ui', 'ux', 'interface'] },
    { title: 'Operations', path: '/operations', keywords: ['operations', 'management', 'workflow'] },
    { title: 'Pricing', path: '/pricing', keywords: ['pricing', 'cost', 'plans'] },
  ];

  // Efect pentru căutare (rămâne la fel)
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredResults = searchableContent.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const keywordMatch = item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm)
        );
        return titleMatch || keywordMatch;
      });
      setSearchResults(filteredResults);
      // Deschide rezultatele doar dacă există text în input
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Efect pentru click în afara meniului mobil și a căutării
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Închide căutarea dacă se dă click în afara ei
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      // Închide meniul mobil dacă se dă click în afara lui ȘI în afara iconiței hamburger
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Dependency array gol, rulează doar la montare/demontare

  // Handler pentru click pe un rezultat al căutării
  const handleResultClick = () => {
    setSearchQuery(""); // Golește inputul
    setIsSearchOpen(false); // Închide lista de rezultate
    setIsMobileMenuOpen(false); // Închide și meniul mobil dacă era deschis
  };

  // Toggle meniul mobil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handler pentru click pe un item din meniul mobil
  const handleMobileMenuItemClick = (menuItem) => {
    setMenu(menuItem); // Setează itemul activ (opțional)
    setIsMobileMenuOpen(false); // Închide meniul mobil
  };

  return (
    <div className='navbar'>
      {/* Logo - link către home */}
      <Link to="/" className='navbar-logo-link'>
        <img src={assets.jira_logo_icon} alt="Jira Logo" className='logo' />
      </Link>

      {/* Meniu Desktop (ascuns pe mobil) */}
      <ul className='navbar-menu'>
        <li><Link to="/" className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>Home</Link></li>
        <li><Link to="/features" className={menu === "Features" ? "active" : ""} onClick={() => setMenu("Features")}>Features</Link></li>
        <li
          className='navbar-menu-solutions'
          onMouseEnter={() => setIsSolutionsHovered(true)}
          onMouseLeave={() => setIsSolutionsHovered(false)}
        >
          <Link to="/solutions" className={menu === "Solutions" ? "active" : ""} onClick={() => setMenu("Solutions")}>Solutions</Link>
          {isSolutionsHovered && (
            <ul className="solutions-submenu">
              <li><Link to="/marketing" onClick={() => {setMenu("Marketing"); setIsSolutionsHovered(false);}}>Marketing</Link></li>
              <li><Link to="/engineering" onClick={() => {setMenu("Engineering"); setIsSolutionsHovered(false);}}>Engineering</Link></li>
              <li><Link to="/design" onClick={() => {setMenu("Design"); setIsSolutionsHovered(false);}}>Design</Link></li>
              <li><Link to="/operations" onClick={() => {setMenu("Operations"); setIsSolutionsHovered(false);}}>Operations</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/pricing" className={menu === "Pricing" ? "active" : ""} onClick={() => setMenu("Pricing")}>Pricing</Link></li>
      </ul>

      {/* Elementele din dreapta (căutare, buton sign in) */}
      <div className='navbar-right'>
        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Deschide rezultatele la focus dacă există text
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            className="search-input"
          />
          <img
            src={assets.lupa_icon} // Asigură-te că ai această imagine în assets
            alt="Search"
            className="search-icon"
            // Poți adăuga un onClick aici dacă vrei ca lupa să facă submit/focus etc.
          />
          {/* Rezultatele căutării */}
          {isSearchOpen && searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((result, index) => (
                <li key={index}>
                  <Link to={result.path} onClick={handleResultClick}>
                    {result.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
           {isSearchOpen && searchResults.length === 0 && searchQuery.trim() && (
             <ul className="search-results">
                <li className="no-results">No matching results</li>
             </ul>
           )}
        </div>
        <button onClick={() => setShowLogin(true)} className="signin-button">sign in</button>
      </div>

      {/* Iconița Hamburger (vizibilă doar pe mobil) */}
      <div
        className="hamburger-icon"
        ref={hamburgerRef}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu-list" // ID-ul listei din meniul mobil
      >
        <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
      </div>

      {/* Meniu Mobil (afișat condiționat) */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <ul id="mobile-menu-list">
            {/* Adaugă link-urile pentru meniul mobil */}
            <li><Link to="/" onClick={() => handleMobileMenuItemClick("Home")}>Home</Link></li>
            <li><Link to="/features" onClick={() => handleMobileMenuItemClick("Features")}>Features</Link></li>
            {/* Poți adăuga aici logica pentru submeniul Solutions pe mobil dacă dorești */}
            <li className="mobile-solutions-group">
              <Link to="/solutions" onClick={() => handleMobileMenuItemClick("Solutions")}>Solutions</Link>
              {/* Submeniul este mereu vizibil în structura actuală, doar stilizat diferit */}
              <ul className="mobile-submenu">
                  <li><Link to="/marketing" onClick={() => handleMobileMenuItemClick("Marketing")}>Marketing</Link></li>
                  <li><Link to="/engineering" onClick={() => handleMobileMenuItemClick("Engineering")}>Engineering</Link></li>
                  <li><Link to="/design" onClick={() => handleMobileMenuItemClick("Design")}>Design</Link></li>
                  <li><Link to="/operations" onClick={() => handleMobileMenuItemClick("Operations")}>Operations</Link></li>
              </ul>
            </li>
            <li><Link to="/pricing" onClick={() => handleMobileMenuItemClick("Pricing")}>Pricing</Link></li>
            {/* Poți adăuga și un link/buton de Sign In aici dacă dorești */}
            {/* <li><button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} className="mobile-signin-button">Sign In</button></li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;