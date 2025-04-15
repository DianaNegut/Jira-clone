import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './My_tasks_component.css';

const My_tasks_component = () => {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();


  const fetchUserTasks = async () => {
    try {
    
      const userResponse = await fetch('http://localhost:4000/api/user/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('Eroare la obținerea datelor utilizatorului');
      }
      
      const userData = await userResponse.json();
      
      if (!userData.success) {
        throw new Error(userData.message || 'Eroare la obținerea utilizatorului');
      }

      const user = userData.user;
      setCurrentUser(user);
      setCompanyName(user.companyName || '');
  
      if (!user || !user._id) {
        throw new Error('Nu ești autentificat sau lipsesc date utilizator');
      }
      console.log("User ID:", user._id);
    
      const response = await fetch(`http://localhost:4000/api/task/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Eroare la obținerea task-urilor');
      }
  
      const data = await response.json();
  
    
      const filteredTasks = data.filter(task => task.status === "in progress");
  
      setUserTasks(filteredTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };


  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return <div className="loading-container">Se încarcă task-urile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (userTasks.length === 0) {
    return <div className="empty-tasks">Nu ai task-uri în progres momentan.</div>;
  }

  return (
    <div className="my-tasks-container">
      <h2>Task-urile mele în progres</h2>
      <div className="user-info">
        {currentUser && (
          <>
            <p>Utilizator: {currentUser.name}</p>
            {companyName && <p>Companie: {companyName}</p>}
          </>
        )}
      </div>
      <div className="tasks-list">
        {userTasks.map((task) => (
          <div 
            key={task._id} 
            className="task-card" 
            onClick={() => handleTaskClick(task._id)}
            style={{ cursor: 'pointer' }}
          >
            <h3 className="task-title">{task.title}</h3>
            <div className="task-details">
              <p className="task-description">{task.description}</p>
              
              {task.assignedBy && (
                <p className="task-assigned-by">Asignat de: {task.assignedBy.name}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default My_tasks_component;