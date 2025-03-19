
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { IoMdCloseCircle } from "react-icons/io";
import { Password } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { SiteContext } from '../context/SiteContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 


const LoginPopup = ({ setShowLogin }) => {
    const {url, setToken} = useContext(SiteContext);
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        phone: ""
    })


    const onLogin = async(event)=>{
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login")
        {
            newUrl += "/api/user/login"
        }
        else{
            newUrl+="/api/user/register"
        }
        const response = await axios.post(newUrl,data);

        if(response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
            
           // am adaugat delay aici pentru ca nu functiona
            setTimeout(() => {
                navigate("/dashboard");
            }, 100);
        }
        else
        {
            alert(response.data.message);
        }


    }


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    }
    



    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} action="" className="login-popup-container">
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <IoMdCloseCircle onClick={() => setShowLogin(false)} />
                </div>
                <div className='login-popup-inputs'>
                    {
                        currState === "Login" ? (
                            <></>
                        ) : (
                            <>
                                <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
                                <input name='companyName' onChange={onChangeHandler} value={data.companyName} type="companyName" placeholder="Company Name" required />
                                <input name='phone' onChange={onChangeHandler} value={data.phone}  type="phone" placeholder="Phone" required />
                            </>
                        )
                    }


                    <input name='email' onChange={onChangeHandler} value={data.email}  type="email" placeholder='Your email' required></input>
                    <input name='password' onChange={onChangeHandler} value={data.password}  type="password" placeholder='Password' required></input>



                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className='login-popup-condition'>
                    <input type="checkbox" required />
                    <p className='condition-paragraph'>I agree to the terms of use.</p>
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
