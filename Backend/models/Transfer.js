const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromBaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true
  },
  toBaseId: {
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
  transferDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'completed', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  notes: String
}, {
  timestamps: true
});


transferSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'completed') {
    await updateInventoryForTransfer(doc);
  }
});

const updateInventoryForTransfer = async (transfer) => {
  try {
    const AssetInventory = mongoose.model('AssetInventory');
    
    const populatedTransfer = await mongoose.model('Transfer').findById(transfer._id)
      .populate('fromBaseId')
      .populate('toBaseId')
      .populate('assetTypeId');

    if (populatedTransfer) {
      const transferDate = new Date(populatedTransfer.transferDate);
      const dateKey = new Date(transferDate.getFullYear(), transferDate.getMonth(), transferDate.getDate());

    
      let fromInventory = await AssetInventory.findOne({
        baseId: populatedTransfer.fromBaseId._id,
        assetTypeId: populatedTransfer.assetTypeId._id,
        date: dateKey
      });

      if (!fromInventory) {
        
        const yesterday = new Date(dateKey);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const yesterdayInventory = await AssetInventory.findOne({
          baseId: populatedTransfer.fromBaseId._id,
          assetTypeId: populatedTransfer.assetTypeId._id,
          date: yesterday
        });

        const openingBalance = yesterdayInventory ? yesterdayInventory.closingBalance : 0;

        fromInventory = await AssetInventory.create({
          baseId: populatedTransfer.fromBaseId._id,
          assetTypeId: populatedTransfer.assetTypeId._id,
          openingBalance: openingBalance,
          purchases: 0,
          transfersIn: 0,
          transfersOut: 0,
          assigned: 0,
          expended: 0,
          closingBalance: openingBalance,
          date: dateKey
        });
      }

      
      let toInventory = await AssetInventory.findOne({
        baseId: populatedTransfer.toBaseId._id,
        assetTypeId: populatedTransfer.assetTypeId._id,
        date: dateKey
      });

      if (!toInventory) {
       
        const yesterday = new Date(dateKey);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const yesterdayInventory = await AssetInventory.findOne({
          baseId: populatedTransfer.toBaseId._id,
          assetTypeId: populatedTransfer.assetTypeId._id,
          date: yesterday
        });

        const openingBalance = yesterdayInventory ? yesterdayInventory.closingBalance : 0;

        toInventory = await AssetInventory.create({
          baseId: populatedTransfer.toBaseId._id,
          assetTypeId: populatedTransfer.assetTypeId._id,
          openingBalance: openingBalance,
          purchases: 0,
          transfersIn: 0,
          transfersOut: 0,
          assigned: 0,
          expended: 0,
          closingBalance: openingBalance,
          date: dateKey
        });
      }

     
      fromInventory.transfersOut += populatedTransfer.quantity;
      fromInventory.closingBalance -= populatedTransfer.quantity;
      await fromInventory.save();

      toInventory.transfersIn += populatedTransfer.quantity;
      toInventory.closingBalance += populatedTransfer.quantity;
      await toInventory.save();

      console.log(' Inventory updated for completed transfer:', populatedTransfer._id);
      console.log(' FROM base after transfer:', {
        transfersOut: fromInventory.transfersOut,
        closing: fromInventory.closingBalance
      });
      console.log(' TO base after transfer:', {
        transfersIn: toInventory.transfersIn,
        closing: toInventory.closingBalance
      });
    }
  } catch (error) {
    console.error(' Error updating inventory for transfer:', error);
  }
};

module.exports = mongoose.model('Transfer', transferSchema); 