import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchPhotos, fetchPhotosByCategory } from '../services/api';

function Gallery() {
  const { category } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('');

  useEffect(() => {
    if (category) {
      // Load photos for specific category
      loadCategoryPhotos(category);
      setCurrentCategory(category);
    } else {
      // Load all photos
      loadAllPhotos();
      setCurrentCategory('');
    }
  }, [category]);

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

    const loadCategoryPhotos = async (cat) => {
      console.log('Fetching category:', cat);
    try {
      const { data } = await fetchPhotosByCategory(cat);
      console.log('Photos received:', data);
      setPhotos(data);
    } catch (error) {
      console.error('Error loading category photos:', error);
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
        <div className="loading">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
        <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        >
      <Header />
      <main className="gallery-page">
        {currentCategory && (
          <div className="gallery-category-header">
            <h1>{currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Photography</h1>
            <p>{photos.length} beautiful moments captured</p>
          </div>
        )}
        <div className="gallery-masonry">
          {photos.map((photo, index) => (
            <div 
              key={photo._id} 
              className="gallery-masonry-item"
              onClick={() => openLightbox(photo, index)}
            >
              <img 
                src={photo.url} 
                alt="" 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>
      
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            
            {photos.length > 1 && (
              <button className="lightbox-prev" onClick={prevPhoto}>‹</button>
            )}
            
            <img 
              src={selectedPhoto.url} 
              alt="" 
              className="lightbox-image" 
            />
            
            {photos.length > 1 && (
              <button className="lightbox-next" onClick={nextPhoto}>›</button>
            )}
          </div>
        </div>
      )}
      
      <Footer />
      </motion.div>
    </>
  );
}

export default Gallery;