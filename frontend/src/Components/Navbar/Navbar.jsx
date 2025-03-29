import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isSolutionsHovered, setIsSolutionsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null); 


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
      setIsSearchOpen(true); 
    } else {
      setSearchResults([]);
      setIsSearchOpen(false); 
    }
  }, [searchQuery]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleResultClick = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className='navbar'>
      <img src={assets.jira_logo_icon} alt="" className='logo' />
      <ul className='navbar-menu'>
        <li><Link to="/" className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>Home</Link></li>
        <li><Link to="/features" className={menu === "Features" ? "active" : ""} onClick={() => setMenu("Features")}>Features</Link></li>
        <li
          onMouseEnter={() => setIsSolutionsHovered(true)}
          onMouseLeave={() => setIsSolutionsHovered(false)}
        >
          <Link to="/solutions" className={menu === "Solutions" ? "active" : ""} onClick={() => setMenu("Solutions")}>Solutions</Link>
          {isSolutionsHovered && (
            <ul className="solutions-submenu">
              <li><Link to="/marketing" className={menu === "Marketing" ? "active" : ""} onClick={() => setMenu("Marketing")}>Marketing</Link></li>
              <li><Link to="/engineering" className={menu === "Engineering" ? "active" : ""} onClick={() => setMenu("Engineering")}>Engineering</Link></li>
              <li><Link to="/design" className={menu === "Design" ? "active" : ""} onClick={() => setMenu("Design")}>Design</Link></li>
              <li><Link to="/operations" className={menu === "Operations" ? "active" : ""} onClick={() => setMenu("Operations")}>Operations</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/pricing" className={menu === "Pricing" ? "active" : ""} onClick={() => setMenu("Pricing")}>Pricing</Link></li>
      </ul>

      <div className='navbar-right'>
        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <img
            src={assets.lupa_icon}
            alt="Search"
            className="search-icon"
          />
          {isSearchOpen && (
            <ul className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <li key={index}>
                    <Link to={result.path} onClick={handleResultClick}>
                      {result.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="no-results">No matching results</li>
              )}
            </ul>
          )}
        </div>
        <button onClick={() => setShowLogin(true)}>sign in</button>
      </div>
    </div>
  );
};

export default Navbar;