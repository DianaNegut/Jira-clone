import React from 'react';
import './Header.css';
import { assets } from '../../assets/assets';

const Header = ({ setShowLogin }) => { // Primește setShowLogin ca prop
  return (
    <div className='header'>
      <img src={assets.board_presentation} alt="Board Presentation" className="header-img" />
      <div className='header-content'>
        <h2>Bine ati venit la Jira!</h2>
        <p>Jira Software este construit pentru fiecare membru al echipei de dezvoltare pentru a planifica, urmari si lansa software de calitate.</p>
        <button onClick={() => setShowLogin(true)}>Incepe acum</button> {/* Folosește prop-ul */}
      </div>
    </div>
  );
};

export default Header;