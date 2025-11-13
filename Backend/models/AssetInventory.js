const mongoose = require('mongoose');

const assetInventorySchema = new mongoose.Schema({
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
  openingBalance: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  transfersIn: {
    type: Number,
    default: 0
  },
  transfersOut: {
    type: Number,
    default: 0
  },
  assigned: {
    type: Number,
    default: 0
  },
  expended: {
    type: Number,
    default: 0
  },
  closingBalance: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

assetInventorySchema.index({ baseId: 1, assetTypeId: 1, date: 1 });

module.exports = mongoose.model('AssetInventory', assetInventorySchema);