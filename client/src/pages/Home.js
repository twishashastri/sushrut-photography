import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchEvents, fetchPhotosBySection } from '../services/api';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryCovers, setCategoryCovers] = useState({});
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

  // Auto-rotate hero slideshow
  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages]);

  const loadData = async () => {
    try {
      // Fetch events from database
      const eventsData = await fetchEvents();
      const events = eventsData.data;
      
      // Fetch a cover image for each event
      const covers = {};
      for (const event of events) {
        try {
          // Fetch photos for this specific category
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/photos/category/${event.name}`);
          const photos = await response.json();
          
          // Use the first photo as cover, or keep existing coverImage
          if (photos.length > 0) {
            covers[event.name] = photos[0].url;
          } else if (event.coverImage) {
            covers[event.name] = event.coverImage;
          }
        } catch (err) {
          console.error(`Error fetching cover for ${event.name}:`, err);
        }
      }
      
      setEvents(events);
      setCategoryCovers(covers);
      
      // Fetch hero images (section: "hero")
      const heroData = await fetchPhotosBySection('hero');
      if (heroData.data.length > 0) {
        setHeroImages(heroData.data);
      }
      
      // Fetch homepage parallax image (section: "home-parallax")
      const parallaxData = await fetchPhotosBySection('home-parallax');
      if (parallaxData.data.length > 0) {
        setParallaxImage(parallaxData.data[0].url);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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
      <main>
        {/* Hero Section - Slideshow from database */}
        <section className="hero">
          {heroImages.map((img, index) => (
              <div key={img._id} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
                <img src={img.url} alt={`Sushrut Shastri Photography - Edmonton`} />
              </div>
            ))
          }
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Sushrut Shastri Photography</h1>
            <p>Edmonton Wedding & Portrait Photographer • Capturing Alberta's Beautiful Moments</p>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Edmonton's Premier Photographer</h2>
                <p>Based in Edmonton, Alberta, Sushrut Shastri specializes in wedding photography, portrait sessions, and commercial work throughout Edmonton and surrounding areas. With an eye for natural light and genuine moments, each photograph tells a unique story.</p>
                <p>Whether you're looking for a wedding photographer in Edmonton, need professional portraits, or want to capture your family's precious moments, Sushrut brings creativity and professionalism to every shoot. Serving clients across Alberta including Calgary, Red Deer, and throughout the Edmonton region.</p>
              </div>
              <div className="about-image">
                <img src="/sushrut-photo.jpg" alt="Sushrut Shastri - Edmonton Photographer" />
              </div>
            </div>
          </div>
        </section>

        {/* Events/Categories Section */}
        <section className="events-section">
          <div className="container">
            <h2>Photography Services in Edmonton</h2>
            <div className="events-grid">
              {events.map(event => (
                <Link key={event._id} to={`/gallery/category/${event.name.toLowerCase()}`} className="event-card">
                  <img src={categoryCovers[event.name] || heroImages[0]?.url} alt={`Edmonton ${event.name} Photography`} />
                  <div className="event-overlay">
                    <h3>{event.name} Photography</h3>
                    <p>{event.imageCount || 0} photos • Edmonton, AB</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section className="parallax-section" ref={ref}>
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
            <h2>Your Story, Captured</h2>
            <p>Wedding • Portrait • Commercial Photography in Edmonton & Alberta</p>
            <Link to="/contact" className="parallax-btn">Let's Connect →</Link>
          </div>
        </section>

        {/* SEO Section */}
        <section style={{ padding: '40px 0', background: '#f5f5f5' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>Edmonton Wedding & Portrait Photographer</h2>
              <p style={{ color: '#666', lineHeight: '1.8' }}>
                Sushrut Shastri Photography serves Edmonton, Alberta and surrounding areas including St. Albert, Sherwood Park, Spruce Grove, and Leduc. Specializing in wedding photography, engagement sessions, portraits, and commercial photography. With a passion for capturing authentic moments and beautiful light, Sushrut creates stunning imagery for clients throughout Alberta.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      </motion.div>
    </>
  );
}

export default Home;