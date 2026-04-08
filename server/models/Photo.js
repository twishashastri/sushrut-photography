const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  albumId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null,
  },
  photographer: {
    type: String,
    default: 'Sushrut Shastri',
  },
  description: String,
  isHero: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  section: {
    type: String,
    enum: ['hero', 'home-parallax', 'contact-parallax','events-parallax', 'featured', 'none'],
    default: 'none',
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