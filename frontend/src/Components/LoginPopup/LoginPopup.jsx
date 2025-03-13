import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { IoMdCloseCircle } from "react-icons/io";

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");

    return (
        <div className='login-popup'>
            <form action="" className="login-popup-container">
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <IoMdCloseCircle onClick={() => setShowLogin(false)} />
                </div>
                <div className='login-popup-inputs'>
                    {
                        currState === "Login" ? <></> : <input type="text" placeholder='Your name' required></input>
                    }

                    <input type="email" placeholder='Your email' required></input>
                    <input type="password" placeholder='Password' required></input>



                </div>
                <button>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className='login-popup-condition'>
                    <input type="checkbox" required />
                    <p>I agree to the terms of use.</p>
                </div>
                {currState === "Login"
                    ? <p> Create a new account <span onClick={() => setCurrState("Sign Up")}> Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Click here</span></p>
                }



            </form>
        </div>
    );
}

export default LoginPopup;
