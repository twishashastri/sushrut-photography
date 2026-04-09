import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles.css';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import EventsPage from './pages/EventsPage';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AlbumDetail from './pages/AlbumDetail';
import { AnimatePresence } from "framer-motion";

// component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/category/:category" element={<Gallery />} />
        <Route path="/gallery/:event" element={<Gallery />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/album/:slug" element={<AlbumDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin-ssp/login" element={<AdminLogin />} />
        <Route path="/admin-ssp/dashboard" element={<AdminDashboard />} />
      
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes /> 
    </Router>
  );
}

export default App;