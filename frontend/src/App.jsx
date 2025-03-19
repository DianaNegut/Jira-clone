import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/home/Home';
import Footer from './Components/Footer/Footer';
import Features from './Pages/features/Features';
import Operations from './Pages/operations/Operations';
import Marketing from './Pages/marketing/Marketing';
import { Link } from 'react-router-dom';
import Solutions from './Pages/solutions/Solutions';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Pricing from './Pages/pricing/Pricing';
import Design from './Pages/design/Design';
import Engineering from './Pages/engineering/Engineering';
import Dashboard from './Components/Dashboard/Dashboard';
import { SiteContext } from './Components/context/SiteContext';
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");


  return (
    <div>
      {/* trebuie sa am grija sa transmit corect props-ul */}

      {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : null}    
      <div className='app'>
        <Navbar setShowLogin = {setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/features' element={<Features />} /> 
          <Route path='/solutions' element={<Solutions />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/marketing' element={<Marketing />} />
          <Route path='/operations' element={<Operations />} />
          <Route path='/design' element={<Design />} />
          <Route path='/engineering' element={<Engineering />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
