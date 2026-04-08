import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchPhotosBySection } from '../services/api';

function EventsPage() {
  const [albums, setAlbums] = useState([]);
  const [parallaxImage, setParallaxImage] = useState('');
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset(rect.top);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load albums from API
      const albumsRes = await fetch('http://localhost:5000/api/albums');
      const albumsData = await albumsRes.json();
      setAlbums(albumsData);
      
      // Load parallax image
      const parallaxData = await fetchPhotosBySection('events-parallax');
      if (parallaxData.data.length > 0) {
        setParallaxImage(parallaxData.data[0].url);
      }
    } catch (error) {
      console.error('Error loading albums:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Loading albums...</div>
        <Footer />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Header />
      <main>
        {/* Parallax Section */}
        <section className="parallax-section events-parallax" ref={ref}>
          {parallaxImage ? (
            <div 
              className="parallax-bg" 
              style={{ 
                backgroundImage: `url(${parallaxImage})`,
                transform: `translateY(${offset * 0.15}px)`
              }}
            ></div>
          ) : (
            <div className="parallax-bg-placeholder"></div>
          )}
          <div className="parallax-content">
            <h1>Client Albums</h1>
            <p>Explore our collection of beautiful moments captured in Edmonton and across Alberta</p>
          </div>
        </section>

        {/* Albums Grid Section */}
        <div className="events-page-container">
          <div className="container">
            {albums.length === 0 ? (
              <div className="loading" style={{ textAlign: 'center', padding: '60px 0' }}>
                <h3>No albums yet</h3>
                <p>Check back soon for client galleries!</p>
              </div>
            ) : (
              <div className="events-grid-large">
                {albums.map(album => (
                  <Link 
                    key={album._id} 
                    to={`/album/${album.slug}`} 
                    className="event-card-large"
                  >
                    <div className="event-image">
                      <img 
                        src={album.coverPhoto || 'https://via.placeholder.com/600x400?text=No+Image'} 
                        alt={album.clientName} 
                      />
                      <div className="event-overlay-large">
                        <h2>{album.clientName}</h2>
                        <p>{album.category} • {album.photoCount || 0} photos →</p>
                        {album.description && <p className="album-desc">{album.description}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}

export default EventsPage;