import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = ( {setShowLogin} ) => {
  const [menu, setMenu] = useState("home");
  const [isSolutionsHovered, setIsSolutionsHovered] = useState(false);

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
        <img src={assets.lupa_icon} alt="" />
        
        <button onClick={()=>setShowLogin(true)}>sign in</button>
      </div>
    </div>
  );
};

export default Navbar;