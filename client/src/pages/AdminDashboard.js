import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, createEvent, deleteEvent, fetchPhotos, deletePhoto } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Admin Dashboard Component
 * Manages categories, photo uploads, client albums, and gallery
 * Protected route - requires authentication token
 */
function AdminDashboard() {
  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Data State
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  
  // Form State
  const [selectedEvent, setSelectedEvent] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  
  // Album Management State
  const [newAlbum, setNewAlbum] = useState({
    clientName: '',
    category: '',
    description: ''
  });
  
  // Cover Photo Modal State
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [albumPhotosForCover, setAlbumPhotosForCover] = useState([]);
  const [selectedAlbumForCover, setSelectedAlbumForCover] = useState(null);

  // Upload Configuration State
  const [uploadData, setUploadData] = useState({
    event: '',
    photographer: 'Sushrut Shastri',
    section: 'none',
    albumId: ''
  });

  const navigate = useNavigate();

  /**
   * Auto-dismiss notification messages after 3 seconds
   */
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * Check authentication and load initial data on mount
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-ssp/login');
      return;
    }
    loadEvents();
    loadPhotos();
    loadAlbums();
  }, []);

  /**
   * Display user feedback message
   * @param {string} type - 'success' or 'error'
   * @param {string} text - Message content
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  /**
   * Fetch all categories/events from API
   */
  const loadEvents = async () => {
    try {
      const { data } = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  /**
   * Fetch photos with optional event filter
   * @param {string} eventName - Optional event name to filter by
   */
  const loadPhotos = async (eventName = '') => {
    try {
      const { data } = await fetchPhotos(eventName);
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  /**
   * Fetch all client albums
   */
  const loadAlbums = async () => {
    try {
      const response = await fetch(`${API_URL}/albums`);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  /**
   * Load photos for a specific album to choose cover image
   * @param {string} albumId - Album ID to load photos for
   */
  const loadAlbumPhotosForCover = async (albumId) => {
    try {
      const response = await fetch(`${API_URL}/albums/photos-by-id/${albumId}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setAlbumPhotosForCover(data);
        setSelectedAlbumForCover(albumId);
        setShowCoverModal(true);
      } else {
        showMessage('error', 'No photos found in this album. Please upload photos first.');
      }
    } catch (error) {
      console.error('Error loading album photos:', error);
      showMessage('error', 'Failed to load album photos');
    }
  };

  /**
   * Set cover photo for an album
   * @param {string} albumId - Album ID
   * @param {string} photoUrl - URL of selected photo
   */
  const handleSetCoverPhoto = async (albumId, photoUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${albumId}/cover`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ coverPhotoUrl: photoUrl }),
      });
      
      if (response.ok) {
        showMessage('success', 'Cover photo updated successfully!');
        setShowCoverModal(false);
        loadAlbums(); // Refresh album list
      } else {
        const error = await response.json();
        showMessage('error', 'Failed to update cover: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error setting cover:', error);
      showMessage('error', 'Failed to set cover photo');
    }
  };

  /**
   * Create new category/event
   */
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name.trim()) {
      showMessage('error', 'Please enter a category name');
      return;
    }
    try {
      await createEvent({ name: newEvent.name, description: '' });
      setNewEvent({ name: '' });
      loadEvents();
      showMessage('success', `Category "${newEvent.name}" created successfully!`);
    } catch (error) {
      showMessage('error', 'Error creating category');
    }
  };

  /**
   * Delete category and all associated photos
   * @param {string} id - Category ID to delete
   */
  const handleDeleteEvent = async (id) => {
    const eventName = events.find(e => e._id === id)?.name;
    if (!window.confirm(`Delete category "${eventName}" and ALL its photos? This cannot be undone.`)) return;
    try {
      await deleteEvent(id);
      loadEvents();
      loadPhotos();
      showMessage('success', `Category "${eventName}" deleted`);
    } catch (error) {
      showMessage('error', 'Error deleting category');
    }
  };

  /**
   * Create new client album
   */
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.clientName || !newAlbum.category) {
      showMessage('error', 'Please fill client name and category');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newAlbum),
      });
      
      if (response.ok) {
        showMessage('success', 'Album created successfully!');
        setNewAlbum({ clientName: '', category: '', description: '' });
        setShowAlbumForm(false);
        loadAlbums();
      } else {
        const error = await response.json();
        showMessage('error', 'Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error creating album:', error);
      showMessage('error', 'Failed to create album');
    }
  };

  /**
   * Delete album and all its photos
   * @param {string} id - Album ID to delete
   */
  const handleDeleteAlbum = async (id) => {
    const album = albums.find(a => a._id === id);
    if (!window.confirm(`Delete album "${album?.clientName}" and ALL its photos?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (response.ok) {
        showMessage('success', 'Album deleted');
        loadAlbums();
        loadPhotos();
      } else {
        showMessage('error', 'Error deleting album');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      showMessage('error', 'Failed to delete album');
    }
  };

  /**
   * Handle file selection for upload
   * Enforces maximum 10 files limit
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      showMessage('error', 'Maximum 10 photos per upload');
      return;
    }
    setSelectedFiles(files);
  };

  /**
   * Upload selected photos to Cloudinary via backend
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!uploadData.event) {
      showMessage('error', 'Please select a category');
      return;
    }
    if (selectedFiles.length === 0) {
      showMessage('error', 'Please select images');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    // Append all files
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    // Append metadata
    formData.append('event', uploadData.event);
    formData.append('photographer', uploadData.photographer);
    formData.append('section', uploadData.section);
    formData.append('albumId', uploadData.albumId);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/photos`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        showMessage('success', `${result.uploaded} photos uploaded successfully!`);
        
        // Reset form
        setSelectedFiles([]);
        setUploadData({
          event: '',
          photographer: 'Sushrut Shastri',
          section: 'none',
          albumId: ''
        });
        
        // Refresh data
        await loadPhotos(uploadData.event);
        await loadAlbums();  
        await loadEvents(); 
      } else {
        const error = await response.json();
        showMessage('error', 'Upload failed: ' + error.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Delete single photo
   * @param {string} id - Photo ID to delete
   */
  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await deletePhoto(id);
      await loadPhotos(selectedEvent);
      await loadAlbums(); 
      await loadEvents();
      showMessage('success', 'Photo deleted');
    } catch (error) {
      showMessage('error', 'Error deleting photo');
    }
  };

  /**
   * Logout user and clear token
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-ssp/login');
  };

  /**
   * Get human-readable section name
   * @param {string} section - Section code from database
   * @returns {string} Display name
   */
  const getSectionName = (section) => {
    const sections = {
      'none': 'Gallery Only',
      'hero': 'Hero Slideshow',
      'home-parallax': 'Home Parallax',
      'contact-parallax': 'Contact Parallax',
      'events-parallax': 'Events Parallax'
    };
    return sections[section] || section;
  };

  // Calculate statistics for dashboard overview
  const totalPhotos = photos.length;
  const totalCategories = events.length;
  const totalAlbums = albums.length;
  const totalHeroImages = photos.filter(p => p.section === 'hero').length;

  return (
    <div className="admin-container">
      {/* Header Section */}
      <div className="admin-header">
        <div className="container">
          <h1><img src="/logo.svg" className="logo-img" /></h1>
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="container">
        {/* Notification Messages */}
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.type === 'success' ? 'Success: ' : 'Error: '}{message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`admin-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Photos
          </button>
          <button 
            className={`admin-tab ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            Client Albums
          </button>
          <button 
            className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery Manager
          </button>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Photos</h3>
              <p>{totalPhotos}</p>
              <small>Images in gallery</small>
            </div>
            <div className="dashboard-card">
              <h3>Categories</h3>
              <p>{totalCategories}</p>
              <small>Photo categories</small>
            </div>
            <div className="dashboard-card">
              <h3>Client Albums</h3>
              <p>{totalAlbums}</p>
              <small>Client collections</small>
            </div>
            <div className="dashboard-card">
              <h3>Hero Images</h3>
              <p>{totalHeroImages}</p>
              <small>Homepage slideshow</small>
            </div>
          </div>
        )}

        {/* Tab 2: Category Management */}
        {activeTab === 'categories' && (
          <>
            {/* Create Category Form */}
            <div className="admin-form">
              <h3>Create New Category</h3>
              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    placeholder="Example: Wedding, Portrait, Commercial"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ name: e.target.value })}
                    required
                  />
                  <small>Categories will appear on the homepage gallery section</small>
                </div>
                <button type="submit" className="btn btn-primary">Create Category</button>
              </form>
            </div>

            {/* Existing Categories List */}
            <div className="admin-section">
              <h3>Existing Categories</h3>
              {events.length === 0 ? (
                <p>No categories yet. Create one above.</p>
              ) : (
                events.map(event => (
                  <div key={event._id} className="event-item">
                    <div className="event-info">
                      <h4>{event.name}</h4>
                      <p>{event.imageCount || 0} photos in this category</p>
                    </div>
                    <button onClick={() => handleDeleteEvent(event._id)} className="btn btn-danger btn-small">
                      Delete Category
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 3: Photo Upload */}
        {activeTab === 'upload' && (
          <div className="admin-form">
            <h3>Upload New Photos</h3>
            <form onSubmit={handleUpload}>
              {/* Category Selection */}
              <div className="form-group">
                <label>Select Category *</label>
                <select
                  value={uploadData.event}
                  onChange={(e) => setUploadData({ ...uploadData, event: e.target.value })}
                  required
                >
                  <option value="">-- Choose a category --</option>
                  {events.map(event => (
                    <option key={event._id} value={event.name}>{event.name}</option>
                  ))}
                </select>
                <small>Which category do these photos belong to?</small>
              </div>

              {/* Album Assignment (Optional) */}
              <div className="form-group">
                <label>Client Album (Optional)</label>
                <select
                  value={uploadData.albumId}
                  onChange={(e) => setUploadData({ ...uploadData, albumId: e.target.value })}
                >
                  <option value="">-- No Album (General Gallery) --</option>
                  {albums.map(album => (
                    <option key={album._id} value={album._id}>{album.clientName} ({album.category})</option>
                  ))}
                </select>
                <small>Create albums first in the "Client Albums" tab</small>
              </div>

              {/* Two Column Layout for Photographer and Section */}
              <div className="form-row">
                <div className="form-group">
                  <label>Photographer Name</label>
                  <input
                    type="text"
                    value={uploadData.photographer}
                    onChange={(e) => setUploadData({ ...uploadData, photographer: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Display Location</label>
                  <select
                    value={uploadData.section}
                    onChange={(e) => setUploadData({ ...uploadData, section: e.target.value })}
                  >
                    <option value="none">Gallery Only</option>
                    <option value="hero">Homepage Hero Slideshow</option>
                    <option value="home-parallax">Homepage Parallax Background</option>
                    <option value="contact-parallax">Contact Page Parallax</option>
                    <option value="events-parallax">Events Page Parallax</option>
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label>Select Images (Max 10, Up to 50MB Each)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                />
                {selectedFiles.length > 0 && (
                  <div className="file-info">
                    <strong>{selectedFiles.length} file(s) selected:</strong>
                    <ul>
                      {selectedFiles.map((file, i) => (
                        <li key={i}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={uploading} className="btn btn-primary">
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Photos`}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Client Album Management */}
        {activeTab === 'albums' && (
          <>
            <div className="admin-section">
              {/* Album Header with Create Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Client Albums</h3>
                <button 
                  onClick={() => setShowAlbumForm(!showAlbumForm)} 
                  className="btn btn-primary"
                >
                  {showAlbumForm ? 'Cancel' : '+ Create New Album'}
                </button>
              </div>
              
              {/* Create Album Form (Conditional) */}
              {showAlbumForm && (
                <div className="admin-form" style={{ marginBottom: '30px' }}>
                  <h4>New Client Album</h4>
                  <form onSubmit={handleCreateAlbum}>
                    <div className="form-group">
                      <label>Client Name *</label>
                      <input
                        type="text"
                        placeholder="Example: John & Sarah's Wedding"
                        value={newAlbum.clientName}
                        onChange={(e) => setNewAlbum({ ...newAlbum, clientName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={newAlbum.category}
                        onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        {events.map(event => (
                          <option key={event._id} value={event.name}>{event.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Description (Optional)</label>
                      <textarea
                        placeholder="Describe this client's session..."
                        value={newAlbum.description}
                        onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Create Album</button>
                  </form>
                </div>
              )}

              {/* Albums List */}
              {albums.length === 0 ? (
                <p>No albums yet. Create one above.</p>
              ) : (
                albums.map(album => (
                  <div key={album._id} className="event-item">
                    <div className="event-info">
                      <h4>{album.clientName}</h4>
                      <p>Category: {album.category} • Photos: {album.photoCount || 0}</p>
                      {album.description && <p className="album-desc">{album.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {album.photoCount > 0 && (
                        <button 
                          onClick={() => loadAlbumPhotosForCover(album._id)} 
                          className="btn btn-primary btn-small"
                        >
                          Set Cover Photo
                        </button>
                      )}
                      <button onClick={() => handleDeleteAlbum(album._id)} className="btn btn-danger btn-small">
                        Delete Album
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 5: Gallery Manager */}
        {activeTab === 'gallery' && (
          <div className="admin-section">
            <h3>Photo Gallery Manager</h3>
            
            {/* Category Filter */}
            <div className="form-group">
              <label>Filter by Category:</label>
              <select
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  loadPhotos(e.target.value);
                }}
                value={selectedEvent}
              >
                <option value="">All Photos ({totalPhotos})</option>
                {events.map(event => (
                  <option key={event._id} value={event.name}>
                    {event.name} ({event.imageCount || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Photos Grid */}
            {photos.length === 0 ? (
              <p>No photos found. Upload some photos first!</p>
            ) : (
              <div className="photos-grid">
                {photos.map(photo => (
                  <div key={photo._id} className="photo-card">
                    <img src={photo.url} alt={photo.event} />
                    <div className="photo-info">
                      <p><strong>Category: {photo.event}</strong></p>
                      {photo.section && photo.section !== 'none' && (
                        <p className="photo-section">{getSectionName(photo.section)}</p>
                      )}
                      <small>Uploaded: {new Date(photo.createdAt).toLocaleDateString()}</small>
                    </div>
                    <button onClick={() => handleDeletePhoto(photo._id)} className="btn btn-danger btn-small">
                      Delete Photo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cover Photo Selection Modal */}
      {showCoverModal && albumPhotosForCover.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowCoverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Select Cover Photo</h3>
            <p>Click on a photo to set it as the album cover</p>
            <div className="cover-photos-grid">
              {albumPhotosForCover.map(photo => (
                <div 
                  key={photo._id} 
                  className="cover-photo-item"
                  onClick={() => handleSetCoverPhoto(selectedAlbumForCover, photo.url)}
                >
                  <img src={photo.url} alt="Album cover option" />
                </div>
              ))}
            </div>
            <button onClick={() => setShowCoverModal(false)} className="btn btn-primary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;