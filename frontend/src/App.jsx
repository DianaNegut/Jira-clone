import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/home/Home';
import Footer from './Components/Footer/Footer';
import Features from './Pages/features/Features';
import Marketing from './Pages/marketing/Marketing';
import { Link } from 'react-router-dom';
import Solutions from './Pages/solutions/Solutions';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Pricing from './Pages/pricing/Pricing';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

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
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
