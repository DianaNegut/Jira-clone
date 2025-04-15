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
import See_al_users from './Pages/Admin/pages/see_al_users/see_al_users.jsx'
import SeeTasksPage from './Pages/SeeTasksPage/SeeTasksPage.jsx'
import AllTasks from './Pages/AllTasks/AllTasks.jsx'
import Mytasks from './Pages/Admin/pages/mytasks/Mytasks.jsx';
import axios from 'axios';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { token, setToken, userRole, setUserRole, url } = useContext(SiteContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);


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

            console.log('Token verified, user authenticated');
            setToken(savedToken);
            setUserRole(response.data.user.role);
            

            localStorage.setItem('token', savedToken);
          } else {
            console.warn('Token validation failed');

            localStorage.removeItem('token');
            setToken(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error validating authentication token:', error);

          localStorage.removeItem('token');
          setToken(null);
          setUserRole(null);
        }
      } else {

        console.log('No authentication token found');
        setToken(null);
        setUserRole(null);
        localStorage.removeItem('token'); 
      }
      
      setAuthChecked(true);
      setLoading(false);
    };

    initializeAuth();
  }, [setToken, setUserRole, url]);


  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && userRole === 'Administrator';


  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    navigate('/');
  };


  const renderNavbar = () => {
    if (loading) return null; 

    if (!isLoggedIn) {
      return <Navbar setShowLogin={setShowLogin} />;
    }

    if (isAdmin) {
      return <NavbarAdmin onLogout={handleLogout} />;
    }

    return <NavbarLogged onLogout={handleLogout} />;
  };


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


  if (!authChecked || loading) {
    return <div className="full-page-loading">Loading...</div>;
  }

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {renderNavbar()}

      <Routes>
                <Route path="/" element={<PublicRoute><Home setShowLogin={setShowLogin} onLogout={() => {}} /></PublicRoute>} />
        <Route path="/features" element={<PublicRoute><Features /></PublicRoute>} />
        <Route path="/solutions" element={<PublicRoute><Solutions /></PublicRoute>} />
        <Route path="/pricing" element={<PublicRoute><Pricing setShowLogin={setShowLogin}/></PublicRoute>} />
        <Route path="/marketing" element={<PublicRoute><Marketing /></PublicRoute>} />
        <Route path="/operations" element={<PublicRoute><Operations /></PublicRoute>} />
        <Route path="/design" element={<PublicRoute><Design setShowLogin={setShowLogin}/></PublicRoute>} />
        <Route path="/engineering" element={<PublicRoute><Engineering /></PublicRoute>} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Taskuri /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/bugreport" element={<ProtectedRoute><BugReport /></ProtectedRoute>} />
        <Route path="/timetracker" element={<ProtectedRoute><Timetracker /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/choose-plan" element={<ProtectedRoute> <ChoosePlan setShowLogin={setShowLogin} onLogout={handleLogout} /> </ProtectedRoute>} />
        <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/seealltasks" element={<ProtectedRoute><SeeTasksPage /></ProtectedRoute>} />
        
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

 
        <Route path="/add-user" element={<ProtectedRoute adminOnly><Add_user /></ProtectedRoute>} />
        <Route path="/add-user-team" element={<ProtectedRoute adminOnly><Add_user_team /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute adminOnly><Statistici /></ProtectedRoute>} />
        <Route path="/delete-user" element={<ProtectedRoute adminOnly><Delete_user /></ProtectedRoute>} />
        <Route path="/add-team" element={<ProtectedRoute adminOnly><Add_team /></ProtectedRoute>} /> 
        <Route path="/see-all-users" element={<ProtectedRoute adminOnly><See_al_users /></ProtectedRoute>} /> 
        <Route path="/see-all-tasksadmin" element={<ProtectedRoute adminOnly><AllTasks /></ProtectedRoute>} />
        <Route path="/bug-report-admin" element={<ProtectedRoute adminOnly><BugReport /></ProtectedRoute>} />
        <Route path="/setting-admin" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
        <Route path="/mytasks" element={<ProtectedRoute adminOnly><Mytasks /></ProtectedRoute>} />
       
        
      </Routes>

      {!isLoggedIn && <Footer />}
    </>
  );
};

export default App;