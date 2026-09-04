const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const cloudinary = require('cloudinary').v2;
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all photos (public)
router.get('/', async (req, res) => {
  try {
    const { event } = req.query;
    let query = {};
    if (event) query.event = event;
    
    const photos = await Photo.find(query).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get photos by section (updated to check sections array too)
router.get('/section/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const photos = await Photo.find({ 
      $or: [
        { section: section },
        { sections: { $in: [section] } }
      ]
    }).sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get photos by category
router.get('/category/:category', async (req, res) => {
  try {
    const photos = await Photo.find({ 
      event: { $regex: new RegExp(`^${req.params.category}$`, 'i') } 
    }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get photos by event (public)
router.get('/event/:event', async (req, res) => {
  try {
    const photos = await Photo.find({ 
      event: req.params.event 
    }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// NEW: Assign photo to a section (no duplicate upload needed)
// ============================================================
router.put('/:id/assign-section', auth, async (req, res) => {
  try {
    const { section } = req.body;
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Validate section
    const validSections = ['hero', 'home-parallax', 'contact-parallax', 'events-parallax', 'featured', 'none'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    
    // Update the primary section
    photo.section = section;
    
    // Add to sections array if not already present
    if (section !== 'none' && photo.sections) {
      if (!photo.sections.includes(section)) {
        photo.sections.push(section);
      }
    }
    
    await photo.save();
    
    res.json({ 
      success: true,
      message: `Photo assigned to "${section}" successfully`,
      photo: photo 
    });
    
  } catch (error) {
    console.error('Assign section error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// NEW: Remove photo from a section
// ============================================================
router.put('/:id/remove-section', auth, async (req, res) => {
  try {
    const { section } = req.body;
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Remove from sections array
    if (photo.sections) {
      photo.sections = photo.sections.filter(s => s !== section);
    }
    
    // If the primary section matches, reset it
    if (photo.section === section) {
      photo.section = photo.sections.length > 0 ? photo.sections[0] : 'none';
    }
    
    await photo.save();
    
    res.json({ 
      success: true,
      message: `Photo removed from "${section}" successfully`,
      photo: photo 
    });
    
  } catch (error) {
    console.error('Remove section error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete photo (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // First find the photo to get the Cloudinary URL
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Extract Cloudinary public ID from the URL
    const urlParts = photo.url.split('/');
    const filename = urlParts[urlParts.length - 1].split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename}`;
    
    console.log('Deleting from Cloudinary:', publicId);
    
    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary deletion result:', result);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
    }
    
    // Delete from MongoDB
    await Photo.findByIdAndDelete(req.params.id);
    
    // Update event image count (only if event exists)
    if (photo.event && photo.event !== 'Uncategorized') {
      await Event.findOneAndUpdate(
        { name: photo.event },
        { $inc: { imageCount: -1 } }
      );
    }
    
    res.json({ message: 'Photo deleted from database and Cloudinary' });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;