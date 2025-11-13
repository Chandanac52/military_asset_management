const mongoose = require('mongoose');

const assetTypeSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['weapon', 'vehicle', 'ammunition', 'equipment'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  model: String,
  specifications: mongoose.Schema.Types.Mixed,
  unit: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssetType', assetTypeSchema);