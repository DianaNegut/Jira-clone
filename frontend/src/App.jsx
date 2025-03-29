import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Profil from './Pages/profil/Profil';
import Taskuri from './Pages/taskuri/Taskuri';
import BugReport from './Pages/bug_report/BugReport';
import Settings from './Pages/settings/Settings';
import Timetracker from './Pages/timetracker/Timetracker';
import Explore from './Pages/explore/Explore';
import TaskDetail from './Pages/taskDetailPage/TaskDetailPage'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { token, setToken } = useContext(SiteContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    console.log("Token from localStorage:", savedToken);

    if (savedToken && savedToken !== 'null') { 
      setToken(savedToken);
    } else {
      setToken(null);
      localStorage.setItem('token', null); 
    }
    setLoading(false);
  }, [setToken]);

  const isLoggedIn = !!token;
  console.log("Token after useEffect:", token, "isLoggedIn:", isLoggedIn);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/tasks" element={isLoggedIn ? <Taskuri /> : <Navigate to="/" />} />
        <Route path="/explore" element={isLoggedIn ? <Explore /> : <Navigate to="/" />} />
        <Route path="/bugreport" element={isLoggedIn ? <BugReport /> : <Navigate to="/" />} />
        <Route path="/timetracker" element={isLoggedIn ? <Timetracker /> : <Navigate to="/" />} />
        <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profil /> : <Navigate to="/" />} />
        <Route path="/homelog" element={isLoggedIn ? <HomeLoged /> : <Navigate to="/" />} />

        <Route path="/task/:taskId" element={isLoggedIn ? <TaskDetail /> : <Navigate to="/" />} />
      </Routes>

      {!isLoggedIn && <Footer />}
    </>
  );
};

export default App;