import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./TaskDetail.css";

const TaskDetail = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [teams, setTeams] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("unassigned");
  const [previousTeam, setPreviousTeam] = useState("");

  const formatLoggedTime = (minutes) => {
    if (!minutes || minutes === 0) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : ''}`;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchTeams(), fetchTask(), fetchComments()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/teams', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la preluarea echipelor');
      }

      const data = await response.json();
      if (data.teams && Array.isArray(data.teams)) {
        setTeams(data.teams); 
      } else {
        setTeams([]);
      }
    } catch (err) {
      console.error("Eroare la încărcarea echipelor:", err);
      setError(err.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTask = async () => {
    const taskResponse = await fetch(`http://localhost:4000/api/task/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!taskResponse.ok) throw new Error("Task not found");

    const taskData = await taskResponse.json();
    setTask(taskData);
    setSelectedTeam(taskData.team?._id || "");
    setPreviousTeam(taskData.team?._id || "");
    setNewDescription(taskData.description);
    setSelectedStatus(taskData.status || "unassigned");
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/task/${taskId}/comments`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Eroare la încărcarea comentariilor:", err);
      setError(err.message);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/task/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: newComment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);
      setNewComment("");
      setSuccess("Comentariul a fost adăugat cu succes!");
    } catch (err) {
      console.error("Eroare la adăugarea comentariului:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (updatedData) => {
    console.log("Update task request body:", updatedData);

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

  const assignToNewTeam = async () => {
    if (!selectedTeam || selectedTeam === previousTeam) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedTask = await updateTask({
        team: selectedTeam,
        status: "unassigned", 
        user: null 
      });

      setTask(updatedTask);
      setPreviousTeam(selectedTeam);
      setSelectedStatus("unassigned");
      setSuccess("Task-ul a fost asignat cu succes noii echipe!");

    } catch (error) {
      console.error("Error assigning team:", error);
      setError(`Eroare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveAllChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
  
      const updateData = {
        title: task.title, // Păstrează titlul original
        description: newDescription,
        status: selectedStatus,
        team: selectedTeam,
        user: selectedTeam !== previousTeam ? null : task.user?._id
      };
  
      const updatedTask = await updateTask(updateData);
  
      if (imageFile) {
        await handleImageUpload();
        setImageFile(null);
      }
  
      setTask(updatedTask);
      setPreviousTeam(selectedTeam);
      setSuccess("Task actualizat cu succes!");
    } catch (error) {
      console.error("Eroare actualizare:", error);
      setError(`Eroare: ${error.message || "Nu s-a putut actualiza task-ul"}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading task details...</div>;
  if (error && !task) return <div className="error">Error: {error}</div>;
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
        <p className="time-logged">
          <strong>Timp logat:</strong> {formatLoggedTime(task.time_logged)}
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
        
        <button 
          onClick={assignToNewTeam}
          className="assign-team-btn"
          disabled={loading || !selectedTeam || selectedTeam === previousTeam}
        >
          {loading ? "Se procesează..." : "Asignează Echipă"}
        </button>

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

      <div className="comments-section">
        <h3>Comentarii</h3>
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.user?.name || "Utilizator necunoscut"}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">Nu există comentarii pentru acest task.</p>
          )}
        </div>
        <div className="new-comment">
          <textarea
            placeholder="Adaugă un comentariu..."
            className="comment-input"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            className="add-comment-btn" 
            onClick={addComment}
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Se adaugă..." : "Adaugă comentariu"}
          </button>
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

      {(success || error) && (
        <div className={`snackbar ${success ? 'success' : 'error'}`}>
          {success || error}
          <button 
            className="snackbar-close"
            onClick={() => {
              setSuccess(null);
              setError(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
