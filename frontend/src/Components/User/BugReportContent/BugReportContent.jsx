import React, { useState, useEffect } from 'react';
import './BugReportContent.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const BugReportContent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchUserAndTeams = async () => {
      try {
        setLoading(true);

        const userResponse = await fetch('http://localhost:4000/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        
        if (!userData.success) {
          throw new Error(userData.message || 'Failed to get user');
        }

        const userCompanyName = userData.user.companyName || '';
        
        if (!userCompanyName) {
          throw new Error('User is not associated with any company');
        }
        
        setCompanyName(userCompanyName);

        const teamsResponse = await fetch(
          `http://localhost:4000/api/teams?companyName=${encodeURIComponent(userCompanyName)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        if (!teamsResponse.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const teamsData = await teamsResponse.json();
        
        if (teamsData.teams && Array.isArray(teamsData.teams)) {
          setTeams(teamsData.teams);
        } else {
          setTeams([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setSnackbar({ open: true, message: err.message, severity: 'error' });
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTeams();
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

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !team) {
      setSnackbar({ 
        open: true, 
        message: 'Please fill in all required fields', 
        severity: 'error' 
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('team', team);
    
    images.forEach((image) => {
      formData.append('images', image.file);
    });

    try {
      setSubmitting(true);
      setSnackbar({ open: false, message: '', severity: '' });

      const response = await fetch('http://localhost:4000/api/task/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error adding task');
      }

      setSnackbar({ 
        open: true, 
        message: 'Bug report submitted successfully!', 
        severity: 'success' 
      });
      
      setTitle('');
      setDescription('');
      setTeam('');
      setImages([]);
    } catch (err) {
      console.error("Error submitting bug report:", err);
      setSnackbar({ 
        open: true, 
        message: err.message, 
        severity: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bug-report-content">
      <h1>Report a Bug</h1>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            <p>Loading teams...</p>
          ) : teams.length === 0 ? (
            <p>No teams available in your company</p>
          ) : (
            <select
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="" disabled>Select a team</option>
              {teams.map((teamObj) => (
                <option key={teamObj._id} value={teamObj._id}>
                  {teamObj.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group-bug">
          <label htmlFor="images">Attach Screenshots (optional)</label>
          <label className="custom-file-upload">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            Choose Files
          </label>
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
          className="submit-button-bug" 
          disabled={submitting || loading || teams.length === 0}
        >
          {submitting ? 'Submitting...' : 'Submit Bug Report'}
        </button>
      </form>
    </div>
  );
};

export default BugReportContent;