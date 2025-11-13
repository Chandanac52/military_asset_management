const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  location: {
    type: String,
    required: true
  },
  commanderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contact: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Base', baseSchema);