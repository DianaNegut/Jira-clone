import React from 'react';
import './MarketingContent2.css';
import { assets } from '../../assets/assets';

const MarketingContent2 = () => {
    return (
        <div className='marketing-content2'>
            <h1 className='titlu'>Drive marketing campaigns from idea to launch</h1>
            <div className='marketing-content-container2'>
                <img src={assets.backlog2} alt='marketing' className='photos' />
                <div className='text-container'>
                    <h3 className='titlu2'>Plan campaigns</h3>
                    <p className='text-marketing'>Set goals, track progress, and create a shared campaign calendar.</p>
                </div>
            </div>
        </div>
    );
};

export default MarketingContent2;