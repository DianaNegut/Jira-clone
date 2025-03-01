import React, { use } from 'react'
import { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'




const Navbar = () => {
  const [menu, setMenu] = useState("home");
  return (

    <div className='navbar'>
      <img src={assets.jira_logo_icon} alt="" className='logo' />
      <ul className='navbar-menu'>
        <li><Link to="/" className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>Home</Link></li> 
        <li><Link to="/features" className={menu === "Features" ? "active" : ""} onClick={() => setMenu("Features")}>Features</Link></li>
        <li><Link to="/solutions" className={menu === "Solutions" ? "active" : ""} onClick={() => setMenu("Solutions")}>Solutions</Link></li>
        <li><Link to="/pricing" className={menu === "Pricing" ? "active" : ""} onClick={() => setMenu("Pricing")}>Pricing</Link></li>
        <li><Link to="/contact" className={menu === "Contact" ? "active" : ""} onClick={() => setMenu("Contact")}>Contact us</Link></li>
      </ul>


      <div className='navbar-right'>
        <img src={assets.lupa_icon} alt="" />
        <div className='navbar-search-icon'>
          <img src={assets.search_icon} alt="" />
          <div className="dot"></div>
        </div>
        <button>sign in</button>
      </div>


    </div>

  )
}

export default Navbar
