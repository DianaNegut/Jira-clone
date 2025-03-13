import React from 'react'
import './MarketingContent.css'
import { assets } from '../../assets/assets'

const MarketingContent = () => {
    return (
        <div className='marketing-content'>
            <h1 className='title-marketing'>How marketing teams use Jira</h1>
            <div className='marketing-content-container'>
                <div className='marketing-content-card'>
                    <img src={assets.woman1} alt='marketing' className='poze' />
                    <h2>Product marketing</h2>
                    <p>Bring marketing and product under one roof so you can plan, build, and launch products customers will love, together.</p>
                </div>
                <div className='marketing-content-card'>
                    <img src={assets.woman2} alt='marketing' className='poze' />
                    <h2>Content marketing</h2>
                    <p>Create, review, and distribute materials and focus on what you do best — crafting great content.</p>
                </div>
                <div className='marketing-content-card'>
                    <img src={assets.woman3} alt='marketing' className='poze' />
                    <h2>Marketing leadership</h2>
                    <p>Gain visibility on deliverables and goals so you can make smarter, context-based leadership decisions.</p>
                </div>

            </div>


        </div>
    )
}

export default MarketingContent
