import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../utils/authUtils.js';
import './Homel.css';
import { Link } from "react-router-dom";
import { assets } from '../../../assets/assets'; 

const Homel = () => {
  const [userTasks, setUserTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activitiesError, setActivitiesError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
    
        if (!user) {
          throw new Error('Nu ești autentificat');
        }
    
        const response = await fetch(`http://localhost:4000/api/task/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Eroare la obținerea task-urilor');
        }
    
        const data = await response.json();
    
        // 🟡 Filtrare task-uri cu status "in progress"
        const filteredTasks = data.filter(task => task.status === "in progress");
    
        setUserTasks(filteredTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
    

        const userResponse = await fetch('http://localhost:4000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!userResponse.ok) {
          throw new Error('Eroare la obținerea utilizatorului curent');
        }
    
        const userData = await userResponse.json();
        setCurrentUser(userData.user); 
        console.log(userData.user);
    
        const companyName = userData.user.companyName;
    

        const activitatiResponse = await fetch(`http://localhost:4000/api/activitate/?companyName=${encodeURIComponent(companyName)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!activitatiResponse.ok) {
          throw new Error('Eroare la obținerea activităților');
        }
    
        const activitatiData = await activitatiResponse.json();
    

        setActivities(Array.isArray(activitatiData) ? activitatiData.slice(0, 4) : []);
      } catch (err) {
        console.error(err);
        setActivitiesError(err.message);
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchActivities();
    fetchUserTasks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) {
      return assets.default_profile_icon; 
    }
    

    if (profilePicture.includes('http://localhost:4000/')) {
      return profilePicture;
    }
    

    const correctedPath = profilePicture.replace('uploads/', 'images/');
    return `http://localhost:4000/${correctedPath}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box full-width">
        <h3>Introducere</h3>
        <div className="dashboard-content">
          <p>Bine ai venit la <strong>JIRA</strong></p>
          <p>Nu știi de unde să începi? Verifică taskurile active!</p>
        </div>
      </div>

      <div className="dashboard-box">
        <h3>Asignate mie </h3>
        <div className="dashboard-content">
          {loading ? (
            <p>Se încarcă...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : userTasks.length === 0 ? (
            <p>Nu ai taskuri asignate</p>
          ) : (
            <ul className="task-list-homel">
              {userTasks.map(task => (
                <li key={task._id} className="task-item">
                  <Link to={`/task/${task._id}`} className="task-link">
                    <h4>{task.title}</h4>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-box">
        <h3>Activitatea colegilor</h3>
        <div className="dashboard-content">
          {activitiesLoading ? (
            <p>Se încarcă activitățile...</p>
          ) : activitiesError ? (
            <p className="error">{activitiesError}</p>
          ) : activities.length === 0 ? (
            <p>Nu există activități recente</p>
          ) : (
            <ul className="activity-list">
              {activities.map(activity => (
                <li key={activity._id} className="activity-item">
                  <Link to={`/task/${activity.task?._id || activity.task}`} className="activity-link">
                    <div className="activity-content">
                      <div className="activity-user-info">
                                                <img
                          src={getProfilePictureUrl(activity.user?.profilePicture)}
                          alt={activity.user?.name || 'Utilizator'}
                          className="activity-user-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.default_profile_icon;
                          }}
                        />
                        <div className="activity-user-details">
                          <p className="activity-message">{activity.mesaj}</p>
                          <p className="activity-user">
                            {activity.user?.name || 'Utilizator'} • {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homel;