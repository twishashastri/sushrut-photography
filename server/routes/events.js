const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Photo = require('../models/Photo');  
const auth = require('../middleware/auth');

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