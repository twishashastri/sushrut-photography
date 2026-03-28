import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact/send', {
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
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-header">
        <div className="container">
          <h1>Contact Sushrut Shastri</h1>
          <p>Edmonton, Alberta • Let's create something beautiful together</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Based in Edmonton, Alberta, I'm available for photography sessions throughout Alberta. Whether you're planning a wedding, need professional portraits, or have a commercial project, I'd love to hear from you.</p>
              
              <div className="contact-details">
                <div>
                  <strong>Location</strong>
                  <p>Edmonton, Alberta, Canada</p>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>sushrut@photography.com</p>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>(780) 555-0123</p>
                </div>
                <div>
                  <strong> Hours</strong>
                  <p>Monday - Friday: 9am - 6pm<br />Weekends: By appointment</p>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link"> Facebook</a>
                <a href="#" className="social-link"> Twitter</a>
              </div>
            </div>

            <div className="contact-form">
              {submitted ? (
                <div className="success-message">
                  <h3>Thank you for reaching out!</h3>
                  <p>I'll get back to you within 24-48 hours. A confirmation email has been sent to your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="error-message" style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
                      {error}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Event Type *</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select event type</option>
                      <option value="Wedding">Wedding Photography</option>
                      <option value="Portrait">Portrait Session</option>
                      <option value="Commercial">Commercial Work</option>
                      <option value="Family">Family Session</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
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
      <Footer />
    </>
  );
}

export default Contact;