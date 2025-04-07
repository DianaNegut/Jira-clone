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

    // State pentru gestionarea mesajelor de succes și eroare
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Efect pentru a controla scroll-ul
    useEffect(() => {
        if (setShowLogin) {
            document.body.classList.add('no-scroll');
            return () => document.body.classList.remove('no-scroll');
        }
    }, [setShowLogin]);

    const onLogin = async(event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data);

            if(response.data.success) {
                const token = response.data.token;
                setToken(token);
                localStorage.setItem("token", token);
                
                // Fetch user role immediately after successful login
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
                
                // Redirect after a short delay to ensure states are updated
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

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    }

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
                                <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
                                <input name='phone' onChange={onChangeHandler} value={data.phone} type="phone" placeholder="Phone" required />
                            </>
                        )
                    }
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
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

            {/* Snackbar pentru mesaje de succes */}
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

            {/* Snackbar pentru mesaje de eroare */}
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