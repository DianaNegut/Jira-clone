import React, { useState } from 'react';
import './TimetrackerComponent.css';

const TimetrackerComponent = () => {
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState(''); // Nou: Ora de început
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState(''); // Nou: Ora de sfârșit
  const [description, setDescription] = useState('');

  // Funcție pentru a trimite formularul
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName || !startDate || !startTime || !endDate || !endTime || !description) {
      alert('Please fill in all fields.');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      alert('End time must be after start time.');
      return;
    }

    const timeEntry = {
      taskName,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
    };

    console.log('Time entry submitted:', timeEntry);

    // Resetare formular
    setTaskName('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
  };

  return (
    <div className="timetracker-container">
      <h1>Time Tracker</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            required
          />
        </div>

        {/* Secțiunea pentru selecția datei și orei */}
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

        <button type="submit" className="submit-button">
          Submit Time Entry
        </button>
      </form>
    </div>
  );
};

export default TimetrackerComponent;
