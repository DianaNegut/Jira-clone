import React from 'react'
import './PricingJos.css'
import { FaStarOfLife } from "react-icons/fa";

const PricingJos = () => {
    return (
        <div>
            <div className='dreptunghi_pricing'>
                <h1 className='titluPricing'>
                    Începe gratuit!
                </h1>
                <p className='paragrafPricing'>
                    Testează Jira gratuit timp de 14 zile, fără card de credit. Vezi cum poate transforma modul în care echipa ta lucrează.
                </p>
                <div className="why_choose_jira">
                    <h1>De ce să alegi Jira?</h1>

                    <div className="features">
                        <div className="feature_item">
                            <div className="feature_title">
                                <FaStarOfLife className="feature_icon" />
                                <h3>Management flexibil</h3>
                            </div>
                            <p>Organizează task-uri, sprint-uri și roadmap-uri ușor și rapid.</p>
                        </div>

                        <div className="feature_item">
                            <div className="feature_title">
                                <FaStarOfLife className="feature_icon" />
                                <h3>Automatizări inteligente</h3>
                            </div>
                            <p>Automatizează sarcini repetitive ca să economisești timp.</p>
                        </div>

                        <div className="feature_item">
                            <div className="feature_title">
                                <FaStarOfLife className="feature_icon" />
                                <h3>Securitate de top</h3>
                            </div>
                            <p>Datele tale sunt protejate cu standarde de securitate enterprise.</p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default PricingJos
