const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Photo = require('../models/Photo');  
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all events with photo count
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ name: 1 });
    
    // Add photo count for each event
    const eventsWithCount = await Promise.all(events.map(async (event) => {
      const photoCount = await Photo.countDocuments({ event: event.name });
      return {
        ...event.toObject(),
        imageCount: photoCount
      };
    }));
    
    res.json(eventsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event and all its photos (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const photos = await Photo.find({ event: event.name });

    for (const photo of photos) {
      try {
        // Extract Cloudinary public ID from the URL
        const urlParts = photo.url.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filename}`;
        
        console.log('Deleting from Cloudinary:', publicId);
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error for photo:', photo._id, cloudinaryError);
        // Continue with other photos even if one fails
      }
    }
    
    // Delete all photos in this category
    await Photo.deleteMany({ event: event.name });
    
    // Delete the event
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ message: `Category "${event.name}" and all its photos deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;