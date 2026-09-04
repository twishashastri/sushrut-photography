const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    default: 'Uncategorized',
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null,
  },
  photographer: {
    type: String,
    default: 'Sushrut Shastri',
  },
  description: {
    type: String,
    default: '',
  },
  // Primary section (for backward compatibility)
  section: {
    type: String,
    enum: ['hero', 'home-parallax', 'contact-parallax', 'events-parallax', 'featured', 'none'],
    default: 'none',
  },
  // NEW: Allow multiple sections for the same photo
  sections: {
    type: [String],
    enum: ['hero', 'home-parallax', 'contact-parallax', 'events-parallax', 'featured', 'none'],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Photo', photoSchema);