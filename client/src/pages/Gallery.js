import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchPhotos, fetchEvents } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Gallery() {
  const { category } = useParams();
  
  // State
  const [photos, setPhotos] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Scroll reveal - Initialize with all items visible
  const [visibleItems, setVisibleItems] = useState({});
  const itemRefs = useRef({});

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle URL category param - ONLY after data is loaded
  useEffect(() => {
    if (allPhotos.length > 0) {
      if (category) {
        setActiveFilter(category);
        const filtered = allPhotos.filter(photo => 
          photo.event && photo.event.toLowerCase() === category.toLowerCase()
        );
        setPhotos(filtered);
      } else {
        setActiveFilter('all');
        setPhotos(allPhotos);
      }
    }
  }, [category, allPhotos]);

  // Setup intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [photos]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch all photos
      const { data: photosData } = await fetchPhotos();
      console.log('Photos loaded:', photosData.length);
      setAllPhotos(photosData);
      
      // Set photos based on URL category
      if (category) {
        const filtered = photosData.filter(photo => 
          photo.event && photo.event.toLowerCase() === category.toLowerCase()
        );
        setPhotos(filtered);
        setActiveFilter(category);
      } else {
        setPhotos(photosData);
        setActiveFilter('all');
      }
      
      // Make all photos visible immediately on load
      const allVisible = {};
      photosData.forEach((_, index) => {
        allVisible[index] = true;
      });
      setVisibleItems(allVisible);
      
      // Fetch categories/events
      const { data: categoriesData } = await fetchEvents();
      console.log('Categories loaded:', categoriesData.length);
      setCategories(categoriesData);
      
      // Fetch albums
      try {
        const albumsResponse = await fetch(`${API_URL}/albums`);
        const albumsData = await albumsResponse.json();
        console.log('Albums loaded:', albumsData.length);
        setAlbums(albumsData);
      } catch (albumError) {
        console.error('Error loading albums:', albumError);
        setAlbums([]);
      }
      
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  // SIMPLE FILTER - Just update state, no URL changes!
  const handleFilterClick = (filterValue, filterType) => {
    setActiveFilter(filterValue);
    
    let filteredPhotos = [];
    if (filterValue === 'all') {
      filteredPhotos = allPhotos;
    } else if (filterType === 'category') {
      filteredPhotos = allPhotos.filter(photo => 
        photo.event && photo.event.toLowerCase() === filterValue.toLowerCase()
      );
    } else {
      filteredPhotos = allPhotos.filter(photo => photo.albumId === filterValue);
    }
    
    setPhotos(filteredPhotos);
    
    // Make all filtered photos visible immediately
    const allVisible = {};
    filteredPhotos.forEach((_, index) => {
      allVisible[index] = true;
    });
    setVisibleItems(allVisible);
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

  // Get category image count
  const getCategoryCount = (categoryName) => {
    return allPhotos.filter(p => p.event && p.event.toLowerCase() === categoryName.toLowerCase()).length;
  };

  // Get album image count
  const getAlbumCount = (albumId) => {
    return allPhotos.filter(p => p.albumId === albumId).length;
  };

  // Build combined filter options
  const getFilterOptions = () => {
    const options = [
      { id: 'all', label: 'All Photos', type: 'all', count: allPhotos.length }
    ];
    
    // Add categories
    categories.forEach(cat => {
      const count = getCategoryCount(cat.name);
      if (count > 0) {
        options.push({ 
          id: cat.name, 
          label: cat.name, 
          type: 'category', 
          count: count 
        });
      }
    });
    
    // Add albums
    albums.forEach(album => {
      const count = getAlbumCount(album._id);
      if (count > 0) {
        options.push({ 
          id: album._id, 
          label: album.clientName, 
          type: 'album', 
          count: count 
        });
      }
    });
    
    return options;
  };

  const filterOptions = getFilterOptions();

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading gallery...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Get current filter label
  const getCurrentFilterLabel = () => {
    if (activeFilter === 'all') return 'All Photos';
    const option = filterOptions.find(opt => opt.id === activeFilter);
    return option ? option.label : 'All Photos';
  };

  // Get random photos for header background (max 4)
  const getHeaderPhotos = () => {
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const headerPhotos = getHeaderPhotos();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
        <main className="gallery-page">
          {/* ===== GALLERY HEADER - CLEAN & ELEGANT ===== */}
          <div className="gallery-header-modern">
            <div className="gallery-header-bg">
              {headerPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className="header-bg-item" 
                  style={{ backgroundImage: `url(${photo.url})` }}
                ></div>
              ))}
              <div className="header-bg-overlay"></div>
            </div>
            
            <div className="gallery-header-inner">
              <span className="header-subtitle">Portfolio</span>
              <h1>Gallery</h1>
              <p>{photos.length} {photos.length === 1 ? 'photo' : 'photos'} • {getCurrentFilterLabel()}</p>
            </div>
          </div>

          {/* Combined Filters - All in One */}
          <div className="gallery-filters">
            <div className="container">
              <div className="filter-buttons">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`filter-btn ${activeFilter === option.id ? 'active' : ''}`}
                    onClick={() => handleFilterClick(option.id, option.type)}
                  >
                    {option.label}
                    <span className="filter-count">{option.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="gallery-grid">
            <div className="container">
              {photos.length === 0 ? (
                <div className="no-photos">
                  <p>No photos found.</p>
                </div>
              ) : (
                <div className="gallery-masonry">
                  {photos.map((photo, index) => (
                    <motion.div
                      key={photo._id}
                      ref={(el) => (itemRefs.current[index] = el)}
                      data-index={index}
                      className="gallery-item"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{
                        opacity: visibleItems[index] !== undefined ? (visibleItems[index] ? 1 : 0) : 1,
                        y: visibleItems[index] !== undefined ? (visibleItems[index] ? 0 : 30) : 0
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      onClick={() => openLightbox(photo, index)}
                    >
                      <div className="gallery-image-wrap">
                        <img
                          src={photo.url}
                          alt={photo.event || 'Gallery image'}
                          loading="lazy"
                        />
                        {photo.event && (
                          <span className="gallery-tag">{photo.event}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Lightbox */}
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
              
              <div className="lightbox-info">
                {selectedPhoto.event && <p>{selectedPhoto.event}</p>}
                <small>{selectedIndex + 1} of {photos.length}</small>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </motion.div>
    </>
  );
}

export default Gallery;