import React from 'react';
import './MarketingContent2.css';
import { assets } from '../../assets/assets';

const MarketingContent2 = () => {
    return (
        <div className='marketing-content2'>
            <h1 className='titlu'>Derulează campanii de marketing de la idee la lansare</h1>
            <div className='marketing-content-container2'>
                <img src={assets.backlog2} alt='marketing' className='photos' />
                <div className='text-container'>
                    <h3 className='titlu2'>Planifică campanii</h3>
                    <p className='text-marketing'>Stabilește obiective, urmărește progresul și creează un calendar de campanii comun.</p>
                </div>
            </div>
        </div>
    );
};

export default MarketingContent2;