import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchEvents, fetchPhotos } from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [featuredPhotos, setFeaturedPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data: eventsData } = await fetchEvents();
      setEvents(eventsData);
      
      // Load a cover photo for each event
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
      <Header />
      <div className="events-header">
        <div className="container">
          <h1>Client Albums</h1>
          <p>Explore our collection of beautiful moments captured in Edmonton and across Alberta</p>
        </div>
      </div>

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
                    src={featuredPhotos[event.name] || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600'} 
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
      <Footer />
    </>
  );
}

export default EventsPage;