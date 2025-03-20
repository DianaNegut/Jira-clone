import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './Pages/home/Home';
import Footer from './Components/Footer/Footer';
import Features from './Pages/features/Features';
import Operations from './Pages/operations/Operations';
import Marketing from './Pages/marketing/Marketing';
import Solutions from './Pages/solutions/Solutions';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Pricing from './Pages/pricing/Pricing';
import Design from './Pages/design/Design';
import Engineering from './Pages/engineering/Engineering';
import Dashboard from './Pages/dashboard/Dashboard';
import { SiteContext } from './Components/context/SiteContext';
import NavbarLogged from './Components/User/Navbar/NavbarLogged';
import HomeLoged from './Pages/homeLoged/homeLoged';
import Profile from './Pages/profil/Profile';
import Taskuri from './Pages/taskuri/Taskuri';
import BugReport from './Pages/bug_report/BugReport';
import Settings from './Pages/settings/Settings';
import Timetracker from './Pages/timetracker/Timetracker';
import Explore from './Pages/explore/Explore';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { token, setToken } = useContext(SiteContext);
  const location = useLocation();


  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    } else {
      setToken(null); 
    }
  }, [setToken]);

  const isLoggedIn = !!token;

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  console.log("Current token in App:", token);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

     
      {isLoggedIn ? (
        <NavbarLogged setShowLogin={setShowLogin} onLogout={handleLogout} />
      ) : (
        <Navbar setShowLogin={setShowLogin} />
      )}

      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/design" element={<Design />} />
        <Route path="/engineering" element={<Engineering />} />

        
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/tasks" element={isLoggedIn ? <Taskuri /> : <Navigate to="/tasks" />} />
        <Route path="/explore" element={isLoggedIn ? <Explore /> : <Navigate to="/explore" />} />
        <Route path="/bugreport" element={isLoggedIn ? <BugReport /> : <Navigate to="/bugreport" />} />
        <Route path="/timetracker" element={isLoggedIn ? <Timetracker /> : <Navigate to="/timetracker" />} />
        <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/settings" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/profile" />} />
        <Route path="/homelog" element={isLoggedIn ? <HomeLoged /> : <Navigate to="/homelog" />} />
      </Routes>

      {!isLoggedIn && <Footer />}
    </>
  );
};

export default App;