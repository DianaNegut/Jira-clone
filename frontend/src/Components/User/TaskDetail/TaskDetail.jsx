import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./TaskDetail.css";

const TaskDetail = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("unassigned");
  const [previousTeam, setPreviousTeam] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, teamsResponse] = await Promise.all([
          fetch(`http://localhost:4000/api/task/${taskId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch("http://localhost:4000/api/teams", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!taskResponse.ok) throw new Error("Task not found");
        if (!teamsResponse.ok) throw new Error("Failed to fetch teams");

        const taskData = await taskResponse.json();
        const teamsData = await teamsResponse.json();

        setTask(taskData);
        setSelectedTeam(taskData.team?._id || "");
        setPreviousTeam(taskData.team?._id || "");
        setNewDescription(taskData.description);
        setSelectedStatus(taskData.status || "unassigned");
        setTeams(teamsData.teams || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const updateTask = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData),
      });

      const responseClone = response.clone();
      
      try {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to update task");
        }
        return data;
      } catch (jsonError) {
        const textError = await responseClone.text();
        throw new Error(textError || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const handleTeamChange = (e) => {
    const newTeamId = e.target.value;
    setSelectedTeam(newTeamId);

    // Dacă echipa s-a schimbat, pregătim resetarea statusului și eliminarea userului
    if (newTeamId !== previousTeam) {
      setSelectedStatus("unassigned");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("images", imageFile);

    try {
      const response = await fetch(`http://localhost:4000/api/task/${taskId}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const responseClone = response.clone();
      
      try {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to upload image");
        }
        return data;
      } catch (jsonError) {
        const textError = await responseClone.text();
        throw new Error(textError || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const saveAllChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      const teamChanged = selectedTeam !== previousTeam;
      
      // Actualizare task cu toate modificările
      const updatedTask = await updateTask({
        team: selectedTeam,
        description: newDescription,
        status: teamChanged ? "unassigned" : selectedStatus,
        user: teamChanged ? null : task.user?._id
      });

      setTask(updatedTask);
      setPreviousTeam(selectedTeam);
      if (teamChanged) {
        setSelectedStatus("unassigned");
      }

      // Upload imagine separat (dacă există)
      if (imageFile) {
        const taskWithImage = await handleImageUpload();
        setTask(taskWithImage);
        setImageFile(null);
      }

      alert("Toate modificările au fost salvate cu succes!");
    } catch (error) {
      console.error("Error saving changes:", error);
      setError(error.message);
      alert(`Eroare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading task details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!task) return <div className="error">Task not found</div>;

  return (
    <div className="task-details-container">
      <div className="task-header">
        <h1>{task.title}</h1>
        <span className={`status-badge ${selectedStatus.replace(/\s+/g, "-")}`}>
          {selectedStatus}
        </span>
      </div>

      <div className="task-meta">
        <p>
          <strong>Echipă curentă:</strong> {task.team?.name || "Nici o echipă"}
        </p>
        <select 
          value={selectedTeam} 
          onChange={handleTeamChange}
          className="team-dropdown"
        >
          <option value="">Selectează o echipă</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        {task.user && (
          <p>
            <strong>Asignat lui:</strong> {task.user.name || task.user.email}
          </p>
        )}
      </div>

      <div className="task-description">
        <h3>Descriere</h3>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="description-textarea"
          rows={6}
        />
      </div>

      <div className="task-status-actions">
        <h3>Status:</h3>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-select"
        >
          <option value="unassigned">Neatribuit</option>
          <option value="in progress">În progres</option>
          <option value="completed">Finalizat</option>
        </select>
      </div>

      {task.files?.length > 0 && (
        <div className="task-files">
          <h3>Fișiere atașate</h3>
          <div className="file-grid">
            {task.files.map((file, index) => {
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
              return (
                <div key={index} className="file-item">
                  {isImage ? (
                    <img 
                      src={`http://localhost:4000${file}`} 
                      alt={`Fișier ${index + 1}`} 
                      className="task-image"
                    />
                  ) : (
                    <a 
                      href={`http://localhost:4000${file}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      Fișier {index + 1}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="image-upload-section">
        <h3>Încarcă fișiere</h3>
        <div className="upload-container">
          <input 
            type="file" 
            id="file-upload"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            Alege fișier
          </label>
          {imageFile && (
            <div className="file-preview">
              <span>{imageFile.name}</span>
              <button 
                onClick={() => setImageFile(null)}
                className="remove-file-btn"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={saveAllChanges} 
          className="save-all-btn"
          disabled={loading}
        >
          {loading ? "Se salvează..." : "Salvează Toate Modificările"}
        </button>
        <Link to="/" className="back-link">
          ← Înapoi la lista de task-uri
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TaskDetail;