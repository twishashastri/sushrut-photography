import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AlbumDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Store the font mappings once when album loads
  const [fontMap, setFontMap] = useState({});

  // Font list for random word rotation
  const playfulFonts = [
    'Pacifico',
    'Dancing Script',
    'Sacramento',
    'Calligraffitti',
    'Puppies Play',
    'Great Vibes',
    'Caveat',
    'Ingrid Darling',
    'Euphoria Script',
    'WindSong'
  ];

  const getRandomFont = () => {
    return playfulFonts[Math.floor(Math.random() * playfulFonts.length)];
  };

  // Generate font map for album title once
  const generateFontMap = (title) => {
    if (!title) return {};
    const words = title.split(' ');
    const map = {};
    words.forEach((word, index) => {
      map[index] = getRandomFont();
    });
    return map;
  };

  // Function to render album title with consistent fonts
  const renderTitleWithFonts = (title) => {
    if (!title) return null;
    const words = title.split(' ');
    
    return words.map((word, index) => {
      const font = fontMap[index] || getRandomFont();
      const space = index < words.length - 1 ? ' ' : '';
      
      return (
        <span key={index}>
          <span style={{ 
            fontFamily: `'${font}', cursive`, 
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            {word}
          </span>
          {space}
        </span>
      );
    });
  };

  useEffect(() => {
    loadAlbumData();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadAlbumData = async () => {
    try {
      setLoading(true);
      // Load album info
      const albumRes = await fetch(`${API_URL}/albums/${slug}`);
      const albumData = await albumRes.json();
      setAlbum(albumData);
      
      // Generate font map once when album loads
      if (albumData.clientName) {
        const map = generateFontMap(albumData.clientName);
        setFontMap(map);
      }
      
      // Load album photos
      const photosRes = await fetch(`${API_URL}/albums/${slug}/photos`);
      const photosData = await photosRes.json();
      setPhotos(photosData);
      
    } catch (error) {
      console.error('Error loading album:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
    setSelectedIndex(nextIndex);
  };

  const prevPhoto = () => {
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
    setSelectedIndex(prevIndex);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhoto, selectedIndex]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="album-loading">
          <div className="loading-spinner"></div>
          <p>Loading album...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!album) {
    return (
      <>
        <Header />
        <div className="album-not-found">
          <h1>Album Not Found</h1>
          <p>Sorry, we couldn't find this album.</p>
          <button onClick={() => navigate('/events')} className="back-to-events-btn">
            Back to Events
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      {/* Hero Section with Cover Image */}
      <div className="album-hero-section">
        <div 
          className="album-hero-bg"
          style={{
            backgroundImage: `url(${album.coverPhoto || photos[0]?.url || '/default-album-bg.jpg'})`
          }}
        >
          <div className="album-hero-overlay"></div>
        </div>
        <div className="album-hero-content">
          <div className="container">
            <button onClick={() => navigate('/events')} className="album-back-button">
              ← Back to Events
            </button>
            
            {/* Album Title with Random Fonts per Word - FIXED on load */}
            <h1 style={{ fontFamily: "'Abril Fatface', serif" }}>
              {renderTitleWithFonts(album.clientName)}
            </h1>
            
            <div className="album-meta-info">
              <span className="album-category-badge">{album.category}</span>
              <span className="album-photo-count-badge">{photos.length} Photos</span>
            </div>
            {album.description && (
              <p className="album-description-text">{album.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <section className="album-gallery-section">
        <div className="container">
          {photos.length === 0 ? (
            <div className="no-photos-message">
              <p>No photos in this album yet.</p>
            </div>
          ) : (
            <>
              <div className="album-stats-bar">
                <p>✨ Capturing beautiful moments from {album.clientName}</p>
              </div>
              
              <div className="album-photos-grid">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo._id}
                    className="album-photo-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => openLightbox(photo, index)}
                  >
                    <div className="album-photo-wrapper">
                      <img 
                        src={photo.url} 
                        alt={`${album.clientName} - ${album.category} photography`}
                        loading="lazy"
                      />
                      <div className="album-photo-hover">
                        <span className="zoom-icon">🔍</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="album-cta-section">
        <div className="container">
          <div className="cta-content-wrapper">
            <h2>Love what you see?</h2>
            <p>Let's create beautiful memories for your special moments</p>
            <button onClick={() => navigate('/contact')} className="cta-button">
              Book Your Session →
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            
            {photos.length > 1 && (
              <>
                <button className="lightbox-prev" onClick={prevPhoto}>‹</button>
                <button className="lightbox-next" onClick={nextPhoto}>›</button>
              </>
            )}
            
            <img 
              src={selectedPhoto.url} 
              alt={album.clientName}
              className="lightbox-image" 
            />
            
            <div className="lightbox-info">
              <p>{album.clientName} • {album.category}</p>
              <small>{selectedIndex + 1} of {photos.length}</small>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </motion.div>
  );
}

export default AlbumDetail;