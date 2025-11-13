const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true
  },
  assetTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetType',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  expenditureDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  authorizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  missionId: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Expenditure', expenditureSchema);