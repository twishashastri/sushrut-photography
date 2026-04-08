const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  coverPhoto: {
    type: String,
    default: '',
  },
  photoCount: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Album', albumSchema);