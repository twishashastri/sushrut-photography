import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, createEvent, deleteEvent, fetchPhotos, deletePhoto } from '../services/api';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [photographer, setPhotographer] = useState('Sushrut Shastri');
  
  // ADD THESE TWO LINES - this is what was missing!
  const [uploadData, setUploadData] = useState({
    event: '',
    photographer: 'Sushrut Shastri',
    isHero: false,
    isFeatured: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-ssp/login');
      return;
    }
    loadEvents();
    loadPhotos();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadPhotos = async (eventName = '') => {
    try {
      const { data } = await fetchPhotos(eventName);
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ name: newEvent.name, description: '' });
      setNewEvent({ name: '' });
      loadEvents();
    } catch (error) {
      alert('Error creating event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (error) {
      alert('Error deleting event');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.event) {
      alert('Please select an event');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Please select images');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    formData.append('event', uploadData.event);
    formData.append('photographer', uploadData.photographer);
    formData.append('isHero', uploadData.isHero);
    formData.append('isFeatured', uploadData.isFeatured);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/photos', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      if (response.ok) {
        alert(`${selectedFiles.length} photos uploaded!`);
        setSelectedFiles([]);
        setUploadData({
          event: '',
          photographer: 'Sushrut Shastri',
          isHero: false,
          isFeatured: false
        });
        loadPhotos(uploadData.event);
      } else {
        const error = await response.json();
        alert('Upload failed: ' + error.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await deletePhoto(id);
      loadPhotos(selectedEvent);
    } catch (error) {
      alert('Error deleting photo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-ssp/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="container">
        {/* Add Category */}
        <div className="admin-section">
          <h3>Add New Category</h3>
          <form onSubmit={handleCreateEvent}>
            <input
              type="text"
              placeholder="Category name (e.g., Wedding)"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ name: e.target.value })}
              required
            />
            <button type="submit">Add Category</button>
          </form>
        </div>

        {/* Upload Photos */}
        <div className="admin-section">
          <h3>Upload Photos</h3>
          <form onSubmit={handleUpload}>
            <div>
              <label>Select Category:</label>
              <select
                value={uploadData.event}
                onChange={(e) => setUploadData({ ...uploadData, event: e.target.value })}
                required
              >
                <option value="">Choose category</option>
                {events.map(event => (
                  <option key={event._id} value={event.name}>{event.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Photographer:</label>
              <input
                type="text"
                value={uploadData.photographer}
                onChange={(e) => setUploadData({ ...uploadData, photographer: e.target.value })}
              />
            </div>

            <div>
              <label>Select Images (max 10):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {selectedFiles.length > 0 && (
                <p>{selectedFiles.length} files selected</p>
              )}
            </div>

            {/* Hero Image Checkbox - THIS IS YOUR NEW CODE */}
            <div style={{ margin: '15px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={uploadData.isHero}
                  onChange={(e) => setUploadData({ ...uploadData, isHero: e.target.checked })}
                />
                <span>Set as Hero Image (appears in homepage slideshow)</span>
              </label>
            </div>

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="admin-section">
          <h3>Categories</h3>
          {events.map(event => (
            <div key={event._id} className="event-item">
              <div className="event-info">
                <h4>{event.name}</h4>
                <p>{event.imageCount || 0} photos</p>
              </div>
              <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="admin-section">
          <h3>Recent Photos</h3>
          <div>
            <label>Filter by category:</label>
            <select
              onChange={(e) => loadPhotos(e.target.value)}
              value={selectedEvent}
            >
              <option value="">All</option>
              {events.map(event => (
                <option key={event._id} value={event.name}>{event.name}</option>
              ))}
            </select>
          </div>

          <div className="photos-grid">
            {photos.map(photo => (
              <div key={photo._id} className="photo-card">
                <img src={photo.url} alt={photo.event} />
                <p>{photo.event}</p>
                {photo.isHero && <span style={{ color: 'green', fontSize: '12px' }}>⭐ Hero</span>}
                <button onClick={() => handleDeletePhoto(photo._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;