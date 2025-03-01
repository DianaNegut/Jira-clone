import React from 'react'
import './Middle.css'
import { assets } from '../../assets/assets'

const Middle = () => {
  return (
    <div className='middle'>
        <h1>Bring every team together under one roof</h1>
        <p>Spend less time trying to get aligned and more time driving projects forward with confidence.</p>
        <img src={assets.teams} alt="" className='middle-image'/>
      
    </div>


   
    
    
  )
}

export default Middle
