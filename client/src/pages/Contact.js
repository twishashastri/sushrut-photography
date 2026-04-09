import React, { useState, useEffect,useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchPhotosBySection } from '../services/api';
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [parallaxImage, setParallaxImage] = useState(''); 
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
    
  // Load parallax image from database
  useEffect(() => {
    loadParallaxImage();
  }, []);

  const loadParallaxImage = async () => {
    try {
      const data = await fetchPhotosBySection('contact-parallax');
      if (data.data.length > 0) {
        setParallaxImage(data.data[0].url);
      }
    } catch (error) {
      console.error('Error loading parallax image:', error);
    }
  };

  // Validation Functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain?.toLowerCase())) {
      return 'Please use a valid email address';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^(\+?1\s?)?\(?[2-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid Canadian phone number (e.g., 780-555-0123)';
    }
    return '';
  };

  const validateEventType = (eventType) => {
    if (!eventType) return 'Please select an event type';
    return '';
  };

  const validateMessage = (message) => {
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    if (message.length > 1000) return 'Message must be less than 1000 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      eventType: validateEventType(formData.eventType),
      message: validateMessage(formData.message)
    };
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSending(true);
    setSubmitError('');
    
    try {
      const response = await fetch(`${API_URL}/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0,3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0,3)}-${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

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
       {/* Parallax Hero Section */}
        <section className="parallax-section contact-hero" ref={ref}>
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
            <h1>Let's Create Together</h1>
            <p>Available for weddings, portraits, and commercial work in Edmonton and across Alberta.</p>
        </div>
        </section>

        {/* Contact Form with Parallax Background */}
        <div className="contact-form-parallax" ref={ref}>
        {parallaxImage ? (
            <div 
            className="contact-form-bg" 
            style={{ 
                backgroundImage: `url(${parallaxImage})`,
                transform: `translateY(${offset * 0.15}px)`
            }}
            ></div>
        ) : (
            <div className="contact-form-bg-placeholder"></div>
        )}
        <div className="contact-form-overlay"></div>
        <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Get in Touch</h2>
                <p>Based in Edmonton, Alberta, I'm available for photography sessions throughout Alberta. Whether you're planning a wedding, need professional portraits, or have a commercial project, I'd love to hear from you.</p>
                
                <div className="contact-details">
                  <div>
                    <strong> Location</strong>
                    <p>Edmonton, Alberta, Canada</p>
                  </div>
                  <div>
                    <strong> Email</strong>
                    <p>sushrutshastriphotography@gmail.com</p>
                  </div>
                  <div>
                    <strong> Phone</strong>
                    <p>(780) 893-5919</p>
                  </div>
                  <div>
                    <strong>Hours</strong>
                    <p>Monday - Friday: 9am - 6pm<br />Weekends: By appointment</p>
                  </div>
                </div>

                <div className="social-links">
                  <a href="https://www.instagram.com/sushrutshastriphotography/" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                  <a href="https://www.facebook.com/people/Sushrut-Shastri-Photography/61580716311894/" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                </div>
              </div>

              <div className="contact-form-card">
                {submitted ? (
                  <div className="success-message">
                    <h3>Thank you for reaching out!</h3>
                    <p>I'll get back to you within 24-48 hours. A confirmation email has been sent to your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {submitError && (
                      <div className="error-message">{submitError}</div>
                    )}
                    
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone * (Canadian format)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Event Type *</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className={errors.eventType ? 'error' : ''}
                      >
                        <option value="">Select event type</option>
                        <option value="Wedding">Wedding Photography</option>
                        <option value="Portrait">Portrait Session</option>
                        <option value="Commercial">Commercial Work</option>
                        <option value="Family">Family Session</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.eventType && <span className="field-error">{errors.eventType}</span>}
                    </div>

                    <div className="form-group">
                      <label>Message *</label>
                      <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className={errors.message ? 'error' : ''}
                        placeholder="Tell me about your vision, event details, or any questions you have..."
                      />
                      {errors.message && <span className="field-error">{errors.message}</span>}
                    </div>

                    <button type="submit" className="btn-submit" disabled={sending}>
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </motion.div>
    </>
  );
}

export default Contact;