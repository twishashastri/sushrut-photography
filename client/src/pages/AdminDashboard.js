import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, createEvent, deleteEvent, fetchPhotos, deletePhoto } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Album states
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({
    clientName: '',
    category: '',
    description: ''
  });
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  
  // Cover photo states
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [albumPhotosForCover, setAlbumPhotosForCover] = useState([]);
  const [selectedAlbumForCover, setSelectedAlbumForCover] = useState(null);
  
  const [uploadData, setUploadData] = useState({
    event: '',
    photographer: 'Sushrut Shastri',
    isHero: false,
    isFeatured: false,
    section: 'none',
    albumId: ''
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
    loadAlbums();
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

  const loadAlbums = async () => {
    try {
      const response = await fetch(`${API_URL}/albums`);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  const loadAlbumPhotosForCover = async (albumId) => {
    try {
      const response = await fetch(`${API_URL}/albums/photos-by-id/${albumId}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setAlbumPhotosForCover(data);
        setSelectedAlbumForCover(albumId);
        setShowCoverModal(true);
      } else {
        alert('No photos found in this album. Please upload photos first.');
      }
    } catch (error) {
      console.error('Error loading album photos:', error);
      alert('Failed to load album photos');
    }
  };

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
        alert('Cover photo updated successfully!');
        setShowCoverModal(false);
        loadAlbums();
      } else {
        const error = await response.json();
        alert('Failed to update cover: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error setting cover:', error);
      alert('Failed to set cover photo');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ name: newEvent.name, description: '' });
      setNewEvent({ name: '' });
      loadEvents();
      alert('Category created successfully!');
    } catch (error) {
      alert('Error creating category');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteEvent(id);
      loadEvents();
      loadPhotos();
      alert('Category deleted');
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.clientName || !newAlbum.category) {
      alert('Please fill client name and category');
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
        alert('Album created successfully!');
        setNewAlbum({ clientName: '', category: '', description: '' });
        setShowAlbumForm(false);
        loadAlbums();
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Failed to create album');
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Delete this album and all its photos?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (response.ok) {
        alert('Album deleted');
        loadAlbums();
        loadPhotos();
      } else {
        alert('Error deleting album');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Failed to delete album');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.event) {
      alert('Please select a category');
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
        alert(`${selectedFiles.length} photos uploaded!`);
        setSelectedFiles([]);
        setUploadData({
          event: '',
          photographer: 'Sushrut Shastri',
          isHero: false,
          isFeatured: false,
          section: 'none',
          albumId: ''
        });
        await loadPhotos(uploadData.event);
        await loadAlbums();  
        await loadEvents(); 
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
      await loadPhotos(selectedEvent);
      await loadAlbums(); 
      await loadEvents();
      alert('Photo deleted');
    } catch (error) {
      alert('Error deleting photo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-ssp/login');
  };

  const getSectionName = (section) => {
    const sections = {
      'none': 'Gallery Only',
      'hero': 'Hero Slideshow',
      'home-parallax': 'Home Parallax',
      'contact-parallax': 'Contact Parallax',
      'events-parallax': 'Events Parallax',
      'featured': 'Featured'
    };
    return sections[section] || section;
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
            <button type="submit" className="btn btn-primary">Add Category</button>
          </form>
        </div>

        {/* Create Client Album */}
        <div className="admin-section">
          <h3>Client Albums </h3>
          <button 
            onClick={() => setShowAlbumForm(!showAlbumForm)} 
            className="btn btn-primary"
            style={{ marginBottom: '15px' }}
          >
            {showAlbumForm ? 'Cancel' : '+ Create New Album'}
          </button>
          
          {showAlbumForm && (
            <form onSubmit={handleCreateAlbum}>
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g., John & Sarah's Wedding"
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
                <label>Description (optional)</label>
                <textarea
                  placeholder="Describe this client's session..."
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  rows="3"
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Create Album</button>
            </form>
          )}
        </div>

        {/* Existing Albums List with Set Cover Button */}
        <div className="admin-section">
          <h3>Existing Client Albums</h3>
          {albums.length === 0 ? (
            <p>No albums yet. Create one above.</p>
          ) : (
            albums.map(album => (
              <div key={album._id} className="event-item">
                <div className="event-info">
                  <h4>{album.clientName}</h4>
                  <p>{album.category} • {album.photoCount || 0} photos</p>
                  {album.description && <p style={{ fontSize: '12px', color: '#666' }}>{album.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {album.photoCount > 0 && (
                    <button 
                      onClick={() => loadAlbumPhotosForCover(album._id)} 
                      className="btn btn-primary btn-small"
                    >
                      Set Cover
                    </button>
                  )}
                  <button onClick={() => handleDeleteAlbum(album._id)} className="btn btn-danger btn-small">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Photos */}
        <div className="admin-section">
          <h3>Upload Photos</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
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

            <div className="form-group">
              <label>Add to Client Album (Optional):</label>
              <select
                value={uploadData.albumId}
                onChange={(e) => setUploadData({ ...uploadData, albumId: e.target.value })}
              >
                <option value="">No Album (General Gallery)</option>
                {albums.map(album => (
                  <option key={album._id} value={album._id}>{album.clientName} ({album.category})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Photographer:</label>
              <input
                type="text"
                value={uploadData.photographer}
                onChange={(e) => setUploadData({ ...uploadData, photographer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Where should this photo appear?</label>
              <select
                value={uploadData.section}
                onChange={(e) => setUploadData({ ...uploadData, section: e.target.value })}
              >
                <option value="none">General Gallery Only</option>
                <option value="hero">Homepage Hero Slideshow</option>
                <option value="home-parallax">Homepage Parallax Background</option>
                <option value="contact-parallax">Contact Page Parallax Background</option>
                <option value="events-parallax">Events Page Parallax Background</option>
                <option value="featured">Featured Section</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Images (max 10):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {selectedFiles.length > 0 && (
                <p className="file-info">{selectedFiles.length} files selected</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={uploadData.isHero}
                  onChange={(e) => setUploadData({ ...uploadData, isHero: e.target.checked })}
                /> Set as Hero Image (Homepage Slideshow)
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={uploadData.isFeatured}
                  onChange={(e) => setUploadData({ ...uploadData, isFeatured: e.target.checked })}
                /> Set as Featured Image
              </label>
            </div>

            <button type="submit" disabled={uploading} className="btn btn-primary">
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
              <button onClick={() => handleDeleteEvent(event._id)} className="btn btn-danger btn-small">Delete</button>
            </div>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="admin-section">
          <h3>Recent Photos</h3>
          <div className="form-group">
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
                <div className="photo-info">
                  <p><strong>{photo.event}</strong></p>
                  {photo.section && photo.section !== 'none' && (
                    <p className="photo-section">{getSectionName(photo.section)}</p>
                  )}
                  {photo.isHero && <span className="photo-badge hero">Hero</span>}
                  {photo.isFeatured && <span className="photo-badge featured">Featured</span>}
                </div>
                <button onClick={() => handleDeletePhoto(photo._id)} className="btn btn-danger btn-small">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Photo Modal */}
      {showCoverModal && albumPhotosForCover.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowCoverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Select Cover Photo</h3>
            <div className="cover-photos-grid">
              {albumPhotosForCover.map(photo => (
                <div 
                  key={photo._id} 
                  className="cover-photo-item"
                  onClick={() => handleSetCoverPhoto(selectedAlbumForCover, photo.url)}
                >
                  <img src={photo.url} alt="" />
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