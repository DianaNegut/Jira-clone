import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../utils/authUtils.js';
import './Homel.css';
import { Link } from "react-router-dom";

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
        setUserTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const user = getCurrentUser();

        if (!user) {
          throw new Error('Nu ești autentificat');
        }

        const response = await fetch('http://localhost:4000/api/activitate/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Eroare la obținerea activităților');
        }

        const data = await response.json();

        // Ensure data is always an array
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        setActivitiesError(err.message);
      } finally {
        setActivitiesLoading(false);
      }
    };


    fetchUserTasks();
    fetchActivities();
  }, []);

  // Function to format date
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
        <h3>Asignate mie {currentUser && `(ID: ${currentUser.id})`}</h3>
        <div className="dashboard-content">
          {loading ? (
            <p>Se încarcă...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : userTasks.length === 0 ? (
            <p>Nu ai taskuri asignate</p>
          ) : (
            <ul className="task-list">
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
                      <p className="activity-message">{activity.mesaj}</p>
                      <p className="activity-user">
                        {activity.user?.nume || 'Utilizator'} • {formatDate(activity.createdAt)}
                      </p>
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