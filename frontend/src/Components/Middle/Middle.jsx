import React from 'react'
import './Middle.css'
import { assets } from '../../assets/assets'

const Middle = () => {
  return (
    <div className='middle'>
        <h1>Adu toate echipele împreună sub același acoperiș.</h1>
        <p>Petrece mai puțin timp încercând să te aliniezi și mai mult timp avansând proiectele cu încredere.</p>
        <img src={assets.teams} alt="" className='middle-image'/>
      
    </div>


   
    
    
  )
}

export default Middle
