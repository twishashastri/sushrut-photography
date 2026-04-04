import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { fetchEvents, fetchPhotos, fetchPhotosBySection } from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [featuredPhotos, setFeaturedPhotos] = useState({});
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
      // Load events
      const { data: eventsData } = await fetchEvents();
      setEvents(eventsData);
      
      // Load cover photo for each event
      const photoPromises = eventsData.map(async (event) => {
        const { data: photos } = await fetchPhotos(event.name);
        return { event: event.name, photo: photos[0] };
      });
      
      const photos = await Promise.all(photoPromises);
      const photoMap = {};
      photos.forEach(p => {
        if (p.photo) photoMap[p.event] = p.photo.url;
      });
      setFeaturedPhotos(photoMap);
      
      // Load parallax image for events page
      const parallaxData = await fetchPhotosBySection('events-parallax');
      if (parallaxData.data.length > 0) {
        setParallaxImage(parallaxData.data[0].url);
      }
      
    } catch (error) {
      console.error('Error loading events:', error);
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
    <>
        <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        >
      <Header />
      <main>
        {/* Parallax Section for Events Page */}
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

        {/* Events Grid Section */}
        <div className="events-page-container">
          <div className="container">
            <div className="events-grid-large">
              {events.map(event => (
                <Link 
                  key={event._id} 
                  to={`/gallery/${event.name.toLowerCase()}`} 
                  className="event-card-large"
                >
                  <div className="event-image">
                    <img 
                      src={featuredPhotos[event.name] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                      alt={event.name} 
                    />
                    <div className="event-overlay-large">
                      <h2>{event.name} Photography</h2>
                      <p>{event.imageCount || 0} photos • View Album →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </motion.div>
    </>
  );
}

export default EventsPage;