import React, { useState, useEffect } from 'react';
import './BugReportContent.css';

const BugReportContent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/teams');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Eroare la preluarea echipelor');
        }

        const data = await response.json();
        console.log('Răspuns de la getAllTeams:', data);

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

    fetchTeams();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevImages[index].preview);
      return updatedImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !team) {
      setError('Vă rugăm să completați toate câmpurile obligatorii');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('team', team);
    
    // Adăugare imagini dacă există
    images.forEach((image) => {
      formData.append('images', image.file);
    });

    console.log('Se trimite bug report:', { 
      title, 
      description, 
      team, 
      imagesCount: images.length 
    });

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Verbose pentru debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await fetch('http://localhost:4000/api/task/add', {
        method: 'POST',
        body: formData,
        // Nu adăugăm header pentru Content-Type deoarece formData îl setează automat cu multipart/form-data
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Eroare la adăugarea task-ului');
      }

      console.log('Task adăugat cu succes:', data);
      setSuccess('Bug report-ul a fost trimis cu succes!');

      // Resetare formular
      setTitle('');
      setDescription('');
      setTeam('');
      setImages([]);
    } catch (err) {
      console.error("Eroare la trimiterea bug report-ului:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bug-report-content">
      <h1>Report a Bug</h1>
      
      {error && (
        <div className="error-message">
          <p>Eroare: {error}</p>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Bug Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the bug title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the bug in detail"
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="team">Assign to Team</label>
          {loading ? (
            <p>Se încarcă echipele...</p>
          ) : (
            <select
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="" disabled>Select a team</option>
              {teams.length > 0 ? (
                teams.map((teamObj) => (
                  <option key={teamObj._id} value={teamObj._id}>
                    {teamObj.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nicio echipă disponibilă
                </option>
              )}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="images">Attach Screenshots (optional)</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>

        {images.length > 0 && (
          <div className="image-preview">
            {images.map((image, index) => (
              <div key={index} className="image-preview-item">
                <img src={image.preview} alt={`Preview ${index}`} />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button" 
          disabled={submitting || loading}
        >
          {submitting ? 'Se trimite...' : 'Submit Bug Report'}
        </button>
      </form>
    </div>
  );
};

export default BugReportContent;