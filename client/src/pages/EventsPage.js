import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchPhotosBySection } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EventsPage() {
  const [albums, setAlbums] = useState([]);
  const [parallaxImage, setParallaxImage] = useState('');
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  
  // Store font mappings for each album
  const [fontMaps, setFontMaps] = useState({});

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

  // Generate font map for a title
  const generateFontMap = (title) => {
    if (!title) return {};
    const words = title.split(' ');
    const map = {};
    words.forEach((word, index) => {
      map[index] = getRandomFont();
    });
    return map;
  };

  // Function to render title with consistent fonts
  const renderTitleWithFonts = (title, fontMap) => {
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
      const albumsRes = await fetch(`${API_URL}/albums`);
      const albumsData = await albumsRes.json();
      setAlbums(albumsData);
      
      // Generate font maps for each album
      const maps = {};
      albumsData.forEach(album => {
        if (album.clientName) {
          maps[album._id] = generateFontMap(album.clientName);
        }
      });
      setFontMaps(maps);
      
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
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading albums...</p>
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
      transition={{ duration: 0.6 }}
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
          <div className="parallax-overlay"></div>
          <div className="parallax-content">
            <h1>Client Albums</h1>
            <p>Explore our collection of beautiful moments captured in Edmonton and across Alberta</p>
          </div>
        </section>

        {/* Albums Grid Section */}
        <div className="events-page-container">
          <div className="container">
            {albums.length === 0 ? (
              <div className="no-albums-message">
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
                        src={album.coverPhoto || '/default-album.jpg'} 
                        alt={album.clientName}
                        loading="lazy"
                      />
                      <div className="event-overlay-large">
                        <h2>{renderTitleWithFonts(album.clientName, fontMaps[album._id] || {})}</h2>
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