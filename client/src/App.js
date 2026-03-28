import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import EventsPage from './pages/EventsPage';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:event" element={<Gallery />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin-ssp/login" element={<AdminLogin />} />
        <Route path="/admin-ssp/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;