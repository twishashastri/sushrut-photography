const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Send contact form
router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, eventType, message } = req.body;
    
    // Email 
    const mailToPhotographer = {
      from: process.env.EMAIL_USER,
      to: 'sushrutshastriphotography@gmail.com', 
      subject: `New Contact Form: ${eventType} Inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };
    
    // Auto-reply to the customer
    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Sushrut Shastri Photography',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>I've received your message regarding ${eventType} photography. I'll get back to you within 24-48 hours.</p>
        <p>Best regards,<br>Sushrut Shastri</p>
        <p>Sushrut Shastri Photography<br>Edmonton, Alberta</p>
      `,
    };
    
    // Send both emails
    await transporter.sendMail(mailToPhotographer);
    await transporter.sendMail(mailToCustomer);
    
    res.json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;