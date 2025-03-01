import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <img src="/board_presentation.png" alt="Board Presentation" className="header-img" />
      <div className='header-content'>
        <h2>Bine ati venit la Jira!</h2>
        <p>Jira Software este construit pentru fiecare membru al echipei de dezvoltare pentru a planifica, urmari si lansa software de calitate.</p>
        <button>Incepe acum</button>
      </div>
    </div>


   
    
    
  )
}

export default Header
