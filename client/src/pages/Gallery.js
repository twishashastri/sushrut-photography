import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Lightbox from '../components/Lightbox';
import { fetchPhotos } from '../services/api';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadAllPhotos();
  }, []);

  const loadAllPhotos = async () => {
    try {
      const { data } = await fetchPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="gallery-header">
        <div className="container">
          <h1>All Photography</h1>
          <p>Edmonton, Alberta • {photos.length} beautiful moments</p>
        </div>
      </div>
      <main className="container">
        {photos.length === 0 ? (
          <div className="loading" style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3>No photos yet</h3>
            <p>Check back soon!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div 
                key={photo._id} 
                className="gallery-item"
                onClick={() => openLightbox(photo)}
              >
                <img src={photo.url} alt={photo.event} />
                <div className="gallery-item-info">
                  <p>{photo.event} • Edmonton, AB</p>
                  {photo.photographer && (
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>By {photo.photographer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Lightbox for fullscreen view */}
      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={closeLightbox} />
      )}
      
      <Footer />
    </>
  );
}

export default Gallery;