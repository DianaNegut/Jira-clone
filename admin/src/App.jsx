import React from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx'
import Add_user from './pages/add_user/Add_user.jsx'
import Add_user_team from './pages/add_user_echipa/Add_user_team.jsx'
import Statistici from './pages/statistici/Statistici.jsx'
import Delete_user from './pages/delete_user/Delete_user.jsx'
import Add_team from './pages/add_team/add_team.jsx'
import See_al_users from './pages/see_al_users/see_al_users.jsx'


const App = () => {
  return (
 

    <div>
      <Navbar />
      <hr />
      <div className='app-content'  >
        <Routes>
          <Route path="/add-user" element={<Add_user />} />
          <Route path="/add-user-team" element={<Add_user_team />} />
          <Route path="/statistics" element={<Statistici />} />
          <Route path="/delete-user" element={<Delete_user />} />
          <Route path="/add-team" element={<Add_team />} />
          <Route path="/see_all_users" element={<See_al_users />} />
        </Routes>

      </div>

    </div>
  );
}

export default App
