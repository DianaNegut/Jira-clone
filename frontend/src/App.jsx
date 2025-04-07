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
import TaskDetail from './Pages/taskDetailPage/TaskDetailPage';
import ChoosePlan from './Pages/ChoosePlan/ChoosePlan';
import NavbarAdmin from './Components/Admin/components/navbar/NavbarAdmin.jsx';
import Add_user from './pages/Admin/pages/add_user/Add_user.jsx';
import Add_user_team from './pages/Admin/pages/add_user_echipa/Add_user_team.jsx';
import Statistici from './pages/Admin/pages/statistici/Statistici.jsx';
import Delete_user from './pages/Admin/pages/delete_user/Delete_user.jsx';
import Add_team from './pages/Admin/pages/add_team/add_team.jsx';
import axios from 'axios';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { token, setToken, userRole, setUserRole, url } = useContext(SiteContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Implement token refresh on application start
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const savedToken = localStorage.getItem('token');
      
      if (savedToken && savedToken !== 'null') {
        try {
          const response = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          
          if (response.data.success) {
            // Token is valid, store it in context
            console.log('Token verified, user authenticated');
            setToken(savedToken);
            setUserRole(response.data.user.role);
            
            // Ensure token is fresh in localStorage
            localStorage.setItem('token', savedToken);
          } else {
            console.warn('Token validation failed');
            // Token invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error validating authentication token:', error);
          // Handle expired or invalid token
          localStorage.removeItem('token');
          setToken(null);
          setUserRole(null);
        }
      } else {
        // No token found
        console.log('No authentication token found');
        setToken(null);
        setUserRole(null);
        localStorage.removeItem('token'); // Clean up any null tokens
      }
      
      setAuthChecked(true);
      setLoading(false);
    };

    initializeAuth();
  }, [setToken, setUserRole, url]);

  // Computed auth states
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && userRole === 'Administrator';

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    navigate('/');
  };

  // Dynamic navbar rendering based on auth state
  const renderNavbar = () => {
    if (loading) return null; // Don't show navbar while loading

    if (!isLoggedIn) {
      return <Navbar setShowLogin={setShowLogin} />;
    }

    if (isAdmin) {
      return <NavbarAdmin onLogout={handleLogout} />;
    }

    return <NavbarLogged onLogout={handleLogout} />;
  };

  // Route protection components
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!authChecked || loading) return <div className="full-page-loading">Loading...</div>;
    
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    
    if (adminOnly && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (!authChecked || loading) return <div className="full-page-loading">Loading...</div>;
    
    if (isLoggedIn) {
      return <Navigate to={isAdmin ? "/add-user" : "/dashboard"} replace />;
    }
    
    return children;
  };

  // Show loading state while auth is being checked
  if (!authChecked || loading) {
    return <div className="full-page-loading">Loading...</div>;
  }

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {renderNavbar()}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Home setShowLogin={setShowLogin} onLogout={() => {}} /></PublicRoute>} />
        <Route path="/features" element={<PublicRoute><Features /></PublicRoute>} />
        <Route path="/solutions" element={<PublicRoute><Solutions /></PublicRoute>} />
        <Route path="/pricing" element={<PublicRoute><Pricing setShowLogin={setShowLogin}/></PublicRoute>} />
        <Route path="/marketing" element={<PublicRoute><Marketing /></PublicRoute>} />
        <Route path="/operations" element={<PublicRoute><Operations /></PublicRoute>} />
        <Route path="/design" element={<PublicRoute><Design setShowLogin={setShowLogin}/></PublicRoute>} />
        <Route path="/engineering" element={<PublicRoute><Engineering /></PublicRoute>} />

        {/* User routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Taskuri /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/bugreport" element={<ProtectedRoute><BugReport /></ProtectedRoute>} />
        <Route path="/timetracker" element={<ProtectedRoute><Timetracker /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/choose-plan" element={<ProtectedRoute> <ChoosePlan setShowLogin={setShowLogin} onLogout={handleLogout} /> {/* Pass onLogout here */}</ProtectedRoute>} />
        <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />

        {/* Ruta /homelog - accesibilă doar pentru utilizatori logați non-admin */}
        <Route 
          path="/homelog" 
          element={
            <ProtectedRoute>
              {isLoggedIn && !isAdmin ? (
                <HomeLoged />
              ) : (
                <Navigate to={isAdmin ? "/add-user" : "/"} replace />
              )}
            </ProtectedRoute>
          } 
        />

        {/* Admin routes */}
        <Route path="/add-user" element={<ProtectedRoute adminOnly><Add_user /></ProtectedRoute>} />
        <Route path="/add-user-team" element={<ProtectedRoute adminOnly><Add_user_team /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute adminOnly><Statistici /></ProtectedRoute>} />
        <Route path="/delete-user" element={<ProtectedRoute adminOnly><Delete_user /></ProtectedRoute>} />
        <Route path="/add-team" element={<ProtectedRoute adminOnly><Add_team /></ProtectedRoute>} />
      </Routes>

      {!isLoggedIn && <Footer />}
    </>
  );
};

export default App;