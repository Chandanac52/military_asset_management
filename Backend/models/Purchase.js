const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: [true, 'Base is required']
  },
  assetTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetType',
    required: [true, 'Asset type is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitCost: {
    type: Number,
    required: [true, 'Unit cost is required'],
    min: [0, 'Unit cost cannot be negative']
  },
  totalCost: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
    default: Date.now
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true
  },
  purchaseOrder: {
    type: String,
    trim: true
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'cancelled'],
    default: 'received'
  }
}, {
  timestamps: true
});


purchaseSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('unitCost')) {
    this.totalCost = this.quantity * this.unitCost;
    console.log(` Purchase cost calculation: ${this.quantity} × ₹${this.unitCost} = ₹${this.totalCost}`);
  }
  next();
});


purchaseSchema.pre('validate', function(next) {
  if (!this.totalCost && this.quantity && this.unitCost) {
    this.totalCost = this.quantity * this.unitCost;
  }
  next();
});


purchaseSchema.index({ baseId: 1, purchaseDate: -1 });
purchaseSchema.index({ assetTypeId: 1 });
purchaseSchema.index({ status: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);