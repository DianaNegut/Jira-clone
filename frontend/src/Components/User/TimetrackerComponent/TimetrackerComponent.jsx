import React, { useState, useEffect } from 'react';
import './TimetrackerComponent.css';

const TimetrackerComponent = () => {
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState(''); 
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState(''); 
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState(''); 

  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setTimeout(() => {
      setSnackbarMessage('');
      setSnackbarType('');
    }, 3000);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUser = getCurrentUser();
        
        if (!token || !currentUser?.id) {
          setError('Please login first');
          showSnackbar('Please login first', 'error');
          return;
        }
        console.log('Fetching tasks for user:', currentUser.id);
  
        const response = await fetch(`http://localhost:4000/api/task/user/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        console.log('Fetched tasks:', data);

        const inProgressTasks = data.filter(task => 
          task.status === "in progress"
        );
        
        setTasks(inProgressTasks);
      } catch (err) {
        setError(err.message);
        showSnackbar(err.message, 'error');
      }
    };
  
    fetchTasks();
  }, []);

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
      };
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName || !startDate || !startTime || !endDate || !endTime || !description) {
      showSnackbar('Please fill in all fields.', 'error');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      showSnackbar('End time must be after start time.', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      
      const selectedTask = tasks.find(task => task.title === taskName);
      if (!selectedTask) {
        throw new Error('Task not found');
      }

      
      const timeDifferenceMs = endDateTime - startDateTime;
      const timeToAdd = Math.floor(timeDifferenceMs / 60000); 
      
      const response = await fetch(`http://localhost:4000/api/task/${selectedTask._id}/add-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timeToAdd: timeToAdd
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add time to task');
      }

      
      console.log('Time entry submitted successfully:', {
        taskName,
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        timeAdded: timeToAdd
      });

      
      setTaskName('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setDescription('');
      showSnackbar('Time logged successfully!', 'success');

    } catch (err) {
      setError(err.message);
    
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timetracker-container">
      <h1>Time Tracker</h1>
      {error && <div className="error-message">{error}</div>}
      
      {snackbarMessage && (
        <div className={`snackbar ${snackbarType}`}>
          {snackbarMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <select
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          >
            <option value="">Select a task</option>
            {tasks.map(task => (
              <option key={task._id} value={task.title}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group date-group">
          <div className="date-time-field">
            <label htmlFor="startDate">From</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="date-time-field">
            <label htmlFor="endDate">To</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work done"
            rows="5"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Time Entry'}
        </button>
      </form>
    </div>
  );
};

export default TimetrackerComponent;