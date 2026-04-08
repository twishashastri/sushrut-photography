import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";

function AlbumDetail() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadAlbumData();
  }, [slug]);

  const loadAlbumData = async () => {
    try {
      // Load album info
      const albumRes = await fetch(`http://localhost:5000/api/albums/${slug}`);
      const albumData = await albumRes.json();
      setAlbum(albumData);
      
      // Load album photos
      const photosRes = await fetch(`http://localhost:5000/api/albums/${slug}/photos`);
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Loading album...</div>
        <Footer />
      </>
    );
  }

  if (!album) {
    return (
      <>
        <Header />
        <div className="loading">Album not found</div>
        <Footer />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <main>
        <div className="album-header">
          <div className="container">
            <h1>{album.clientName}</h1>
            <p>{album.category} Photography • Edmonton, Alberta</p>
            {album.description && <p className="album-description">{album.description}</p>}
          </div>
        </div>

        <div className="album-photos">
          <div className="container">
            <div className="gallery-masonry">
              {photos.map((photo, index) => (
                <div 
                  key={photo._id} 
                  className="gallery-masonry-item"
                  onClick={() => openLightbox(photo, index)}
                >
                  <img src={photo.url} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            {photos.length > 1 && (
              <button className="lightbox-prev" onClick={prevPhoto}>‹</button>
            )}
            <img src={selectedPhoto.url} alt="" className="lightbox-image" />
            {photos.length > 1 && (
              <button className="lightbox-next" onClick={nextPhoto}>›</button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </motion.div>
  );
}

export default AlbumDetail;