import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchEvents, fetchPhotos } from '../services/api';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch events from database
      const eventsData = await fetchEvents();
      setEvents(eventsData.data);
      
      const photosData = await fetchPhotos();
      setHeroImages(photosData.data.slice(0, 5));
      
      // Fetch featured photos
      setFeaturedPhotos(photosData.data.slice(0, 8));
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [heroImages]);

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
      <main>
        {/* Hero Section */}
        <section className="hero">
          {heroImages.map((img, index) => (
            <div key={img._id || index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
              <img src={img.url} alt={`Sushrut Shastri Photography - Edmonton Photographer`} />
            </div>
          ))}
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
                <img src={heroImages[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'} alt="Sushrut Shastri - Edmonton Photographer" />
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
                <Link key={event._id} to={`/gallery/${event.name.toLowerCase()}`} className="event-card">
                  <img src={event.coverImage || heroImages[0]?.url} alt={`Edmonton ${event.name} Photography`} />
                  <div className="event-overlay">
                    <h3>{event.name} Photography</h3>
                    <p>{event.imageCount || 0} photos • Edmonton, AB</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Photos Grid */}
        <section className="featured-section" style={{ padding: 'var(--space-xl) 0', background: '#fff' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Recent Work</h2>
            <div className="gallery-grid">
              {featuredPhotos.map(photo => (
                <div key={photo._id} className="gallery-item">
                  <img src={photo.url} alt={photo.event} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO*/}
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
    </>
  );
}

export default Home;