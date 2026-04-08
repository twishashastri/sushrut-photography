const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Photo = require('../models/Photo');
const Event = require('../models/Event');
const Album = require('../models/Album'); 
const auth = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of Cloudinary storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image!'), false);
    }
  }
});

// Upload multiple photos
router.post('/photos', auth, upload.array('images', 10), async (req, res) => {
  
  try {
    const { event, photographer } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    if (!event) {
      return res.status(400).json({ message: 'Event is required' });
    }
    
    console.log(`Processing ${files.length} files for event: ${event}`);
    
    const photos = [];
    
    // Upload each file to Cloudinary
    for (const file of files) {
      try {
        // Convert buffer to base64
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        console.log(`Uploading to Cloudinary: ${file.originalname}`);
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'sushrut-photography',
          transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
          format: 'webp',
        });
        
        console.log(`Uploaded to Cloudinary:`, result.secure_url);
        
        // Save to database
        const photo = new Photo({
          url: result.secure_url,
          event,
          albumId: req.body.albumId || null,
          photographer: photographer || 'Sushrut Shastri',
          location: 'Edmonton, Alberta',
          isHero: req.body.isHero === 'true', 
          isFeatured: req.body.isFeatured === 'true', 
          section: req.body.section || 'none',
        });
        
        await photo.save();
        console.log(`Saved to database:`, photo._id);
        photos.push(photo);
        
      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname}:`, uploadError);
        
      }
    }
    
    // Update event image count 
    if (photos.length > 0 && !req.body.albumId) {
      await Event.findOneAndUpdate(
        { name: event },
        { $inc: { imageCount: photos.length } }
      );
    }
    
    // Update album photo count if photos were added to an album
    if (photos.length > 0 && req.body.albumId) {
      await Album.findByIdAndUpdate(
        req.body.albumId,
        { $inc: { photoCount: photos.length } }
      );
      
      // Set cover photo if album doesn't have one
      const album = await Album.findById(req.body.albumId);
      if (album && !album.coverPhoto && photos.length > 0) {
        album.coverPhoto = photos[0].url;
        await album.save();
      }
    }
    
    console.log(`Successfully uploaded ${photos.length} photos`);
    res.status(201).json({ 
      success: true, 
      uploaded: photos.length,
      photos: photos 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: error.message || 'Upload failed'
    });
  }
});

module.exports = router;