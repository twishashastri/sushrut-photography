import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { fetchEvents, fetchPhotosBySection } from '../services/api';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryCovers, setCategoryCovers] = useState({});
  const [parallaxImage, setParallaxImage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Refs for scroll effects
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const imageRef = useRef(null);

  // Intersection Observer for scroll animations
  const [aboutRef, aboutInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [eventsRef, eventsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [parallaxRef, parallaxInView] = useInView({ threshold: 0.3, triggerOnce: true });

  // 3D Tilt effect for image
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'transform 0.1s ease-out',
      boxShadow: `${(rotateY / 10) * 10}px ${(rotateX / 10) * 10}px 30px rgba(0,0,0,0.2)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-out',
      boxShadow: 'none'
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
      const eventsData = await fetchEvents();
      const events = eventsData.data;
      
      const covers = {};
      for (const event of events) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/photos/category/${event.name}`);
          const photos = await response.json();
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
      
      const heroData = await fetchPhotosBySection('hero');
      if (heroData.data.length > 0) {
        setHeroImages(heroData.data);
      }
      
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

  // ===== ABOUT CONTENT =====
  const aboutParagraph1 = "Hi, I'm Sushrut Shastri — a wedding and portrait photographer based in Edmonton, Alberta. I believe every moment tells a story, and my passion is capturing those stories through my lens. Whether it's the joy of a wedding day, the connection between families, or the confidence in a portrait session, I'm there to preserve it all.";
  
  const aboutParagraph2 = "I work throughout Edmonton and across Alberta, bringing creativity, professionalism, and a genuine love for what I do to every shoot. I know that choosing a photographer is personal — you're inviting someone into your most cherished moments. That's why I focus on making every session feel natural, comfortable, and truly unforgettable.";

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
        <main>
          {/* ===== HERO SECTION - MARQUEE STYLE ===== */}
          <section className="hero-marquee">
            <div className="hero-marquee-track">
              {[...heroImages, ...heroImages, ...heroImages].map((img, index) => (
                <div key={index} className="hero-marquee-slide">
                  <img 
                    src={img.url} 
                    alt={`Sushrut Shastri Photography - Edmonton`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            <div className="hero-marquee-overlay"></div>
            
            <div className="hero-marquee-content">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="hero-title">Sushrut Shastri Photography</h1>
              </motion.div>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Edmonton Wedding & Portrait Photographer • Capturing Alberta's Beautiful Moments
              </motion.p>
              
              <div className="hero-buttons">
                <Link to="/gallery" className="hero-btn primary">View Gallery</Link>
                <Link to="/contact" className="hero-btn secondary">Book Now</Link>
              </div>
            </div>
          </section>

          {/* ===== ABOUT SECTION - CLEAN ANIMATIONS ===== */}
          <section className="about-section" ref={aboutRef}>
            <div className="container">
              <div className="about-grid">
                <motion.div 
                  className="about-content"
                  initial={{ opacity: 0, x: -60 }}
                  animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.span 
                    className="section-tag"
                    initial={{ opacity: 0, x: -20 }}
                    animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    About Me
                  </motion.span>
                  
                  <motion.h2 
                    className="about-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    I'm Sushrut Shastri
                  </motion.h2>
                  
                  <motion.p 
                    className="about-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {aboutParagraph1}
                  </motion.p>
                  
                  <motion.p 
                    className="about-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {aboutParagraph2}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Link to="/contact" className="about-btn">Let's Work Together →</Link>
                  </motion.div>
                </motion.div>
                
                {/* ===== IMAGE WITH 3D TILT EFFECT ===== */}
                <motion.div 
                  className="about-image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={tiltStyle}
                >
                  <div className="image-wrapper">
                    <img src="/sushrut-photo.jpg" alt="Sushrut Shastri - Edmonton Photographer" />
                    <div className="image-glow-effect"></div>
                    <div className="image-border-animation"></div>
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                  </div>
                  <div className="image-shine"></div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ===== EVENTS/CATEGORIES SECTION ===== */}
          <section className="events-section" ref={eventsRef}>
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="section-tag center">What I Do</span>
                <h2 className="events-heading">Photography Services in Edmonton</h2>
                <p className="section-subtitle">Explore my portfolio of beautiful moments captured across Alberta</p>
              </motion.div>
              
              <div className="events-grid">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Link to={`/gallery/category/${event.name.toLowerCase()}`} className="event-card">
                      <div className="event-image-wrapper">
                        <img src={categoryCovers[event.name]} alt={`Edmonton ${event.name} Photography`} loading="lazy" />
                        <div className="event-image-overlay"></div>
                      </div>
                      <div className="event-overlay">
                        <h3>{event.name} Photography</h3>
                        <p>{event.imageCount || 0} photos • Edmonton, AB</p>
                        <span className="event-arrow">→</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== PARALLAX SECTION ===== */}
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
            <div className="parallax-overlay"></div>
            
            <motion.div 
              className="parallax-content"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Your Story, Captured</h2>
              <p>Wedding • Portrait • Commercial Photography in Edmonton & Alberta</p>
              <Link to="/contact" className="parallax-btn">
                Let's Connect →
              </Link>
            </motion.div>
          </section>

          {/* ===== SEO SECTION ===== */}
          <section className="seo-section">
            <div className="container">
              <motion.div 
                className="seo-content"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2>Edmonton Wedding & Portrait Photographer</h2>
                <p>
                  I'm Sushrut Shastri, a wedding and portrait photographer serving Edmonton, Alberta and surrounding areas including St. Albert, Sherwood Park, Spruce Grove, and Leduc. I specialize in wedding photography, engagement sessions, portraits, and commercial work. My passion is capturing authentic moments and beautiful light, creating stunning imagery that my clients across Alberta will cherish forever.
                </p>
                <p style={{ marginTop: '15px' }}>
                  Whether you're planning your dream wedding in Edmonton, looking for a portrait session in Calgary, or need professional photography for your business anywhere in Alberta — I'm here to bring your vision to life. Every click of my camera is driven by a love for storytelling and a commitment to excellence.
                </p>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </>
  );
}

export default Home;