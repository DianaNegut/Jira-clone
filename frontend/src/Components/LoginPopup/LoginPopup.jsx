import './LoginPopup.css';
import { IoMdCloseCircle } from "react-icons/io";
import React, { useContext, useState, useEffect } from 'react';
import { SiteContext } from '../context/SiteContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";  
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken, setUserRole } = useContext(SiteContext);
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (setShowLogin) {
            document.body.classList.add('no-scroll');
            return () => document.body.classList.remove('no-scroll');
        }
    }, [setShowLogin]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'phone' && currState === "Sign Up") {
            const phoneRegex = /^0\d{0,9}$/;
            if (value !== '' && !phoneRegex.test(value)) {
                setErrorMessage('Numărul de telefon trebuie să înceapă cu 0 și să aibă maxim 10 cifre.');
                return;
            }
            if (value.length === 10 && !/^0\d{9}$/.test(value)) {
                setErrorMessage('Numărul de telefon trebuie să aibă exact 10 cifre.');
                return;
            }
            setErrorMessage('');
        }

        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (currState === "Sign Up") {
            if (data.phone && !/^0\d{9}$/.test(data.phone)) {
                setErrorMessage('Numărul de telefon trebuie să înceapă cu 0 și să aibă exact 10 cifre.');
                return;
            }
        }

        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                const token = response.data.token;
                setToken(token);
                localStorage.setItem("token", token);
                
                try {
                    const userResponse = await axios.get(`${url}/api/user/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    if (userResponse.data.success) {
                        console.log("User role:", userResponse.data.user.role);
                        setUserRole(userResponse.data.user.role);
                    }
                } catch (roleError) {
                    console.error('Error fetching user role:', roleError);
                }
                
                setShowLogin(false);
                setSuccessMessage('Login/Registration successful!');
                
                setTimeout(() => {
                    navigate("/homelog");
                }, 100);
            } else {
                setErrorMessage(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to communicate with server.');
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
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
                                <input 
                                    name='name' 
                                    onChange={onChangeHandler} 
                                    value={data.name} 
                                    type="text" 
                                    placeholder="Your name" 
                                    required 
                                />
                                <input 
                                    name='phone' 
                                    onChange={onChangeHandler} 
                                    value={data.phone} 
                                    type="tel" 
                                    placeholder="Phone" 
                                    required 
                                />
                            </>
                        )
                    }
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Your email' 
                        required 
                    />
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                    />
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

            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage('')} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!errorMessage} 
                autoHideDuration={6000} 
                onClose={() => setErrorMessage('')} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default LoginPopup;