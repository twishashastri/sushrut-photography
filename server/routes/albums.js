const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const Photo = require('../models/Photo');
const auth = require('../middleware/auth');

// Helper function to generate slug from client name
function generateSlug(clientName) {
  return clientName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Get all albums (public)
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    
    // Calculate actual photo count for each album
    const albumsWithCount = await Promise.all(albums.map(async (album) => {
      const actualCount = await Photo.countDocuments({ albumId: album._id });
      return {
        ...album.toObject(),
        photoCount: actualCount  
      };
    }));
    
    res.json(albumsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get photos by album ID (for admin cover selection)
router.get('/photos-by-id/:id', async (req, res) => {
  try {
    const photos = await Photo.find({ albumId: req.params.id }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single album by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const album = await Album.findOne({ slug: req.params.slug });
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get photos for an album by slug (public)
router.get('/:slug/photos', async (req, res) => {
  try {
    const album = await Album.findOne({ slug: req.params.slug });
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    const photos = await Photo.find({ albumId: album._id }).sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create album (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { clientName, category, description, coverPhoto } = req.body;
    const slug = generateSlug(clientName);
    
    const existingAlbum = await Album.findOne({ slug });
    if (existingAlbum) {
      return res.status(400).json({ message: 'Album with similar name already exists' });
    }
    
    const album = new Album({ clientName, category, description, coverPhoto, slug });
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    console.error('Create album error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update album cover (admin only)
router.put('/:id/cover', auth, async (req, res) => {
  try {
    const { coverPhotoUrl } = req.body;
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    album.coverPhoto = coverPhotoUrl;
    await album.save();
    res.json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete album (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Photo.deleteMany({ albumId: req.params.id });
    await Album.findByIdAndDelete(req.params.id);
    res.json({ message: 'Album and all its photos deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;