import React from 'react'
import './MarketingContent.css'
import { assets } from '../../assets/assets'

const MarketingContent = () => {
    return (
        <div className='body-container'>
            <div className='marketing-content'>
                <h1 className='title-marketing'>How marketing teams use Jira</h1>
                <div className='marketing-content-container'>
                    <div className='marketing-content-card'>
                        <img src={assets.woman1} alt='marketing' className='poze' />
                        <h2>Product marketing</h2>
                        <p>Adu echipele de marketing și produs sub același acoperiș, astfel încât să puteți planifica, construi și lansa împreună produse pe care clienții le vor adora. 🚀</p>
                    </div>
                    <div className='marketing-content-card'>
                        <img src={assets.woman2} alt='marketing' className='poze' />
                        <h2>Content marketing</h2>
                        <p>Creează, revizuiește și distribuie materiale, concentrându-te pe ceea ce faci cel mai bine — să creezi conținut de calitate. </p>
                    </div>
                    <div className='marketing-content-card'>
                        <img src={assets.woman3} alt='marketing' className='poze' />
                        <h2>Marketing leadership</h2>
                        <p>Obține vizibilitate asupra livrabilelor și obiectivelor pentru a lua decizii de leadership mai inteligente, bazate pe context. </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketingContent