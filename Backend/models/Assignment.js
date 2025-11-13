const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
  personnelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  assignmentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['active', 'returned', 'lost'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
});


assignmentSchema.post('save', async function(doc) {
  await updateInventoryForAssignment(doc);
});

assignmentSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await updateInventoryForAssignment(doc);
  }
});

const updateInventoryForAssignment = async (assignment) => {
  try {
    const AssetInventory = mongoose.model('AssetInventory');
    
    const populatedAssignment = await mongoose.model('Assignment').findById(assignment._id)
      .populate('baseId')
      .populate('assetTypeId');

    if (populatedAssignment) {
      const assignmentDate = new Date(populatedAssignment.assignmentDate);
      const dateKey = new Date(assignmentDate.getFullYear(), assignmentDate.getMonth(), assignmentDate.getDate());

     
      let inventory = await AssetInventory.findOne({
        baseId: populatedAssignment.baseId._id,
        assetTypeId: populatedAssignment.assetTypeId._id,
        date: dateKey
      });

      if (!inventory) {
       
        const yesterday = new Date(dateKey);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const yesterdayInventory = await AssetInventory.findOne({
          baseId: populatedAssignment.baseId._id,
          assetTypeId: populatedAssignment.assetTypeId._id,
          date: yesterday
        });

        const openingBalance = yesterdayInventory ? yesterdayInventory.closingBalance : 0;

        inventory = await AssetInventory.create({
          baseId: populatedAssignment.baseId._id,
          assetTypeId: populatedAssignment.assetTypeId._id,
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

      
      if (populatedAssignment.status === 'active') {
       
        inventory.assigned += populatedAssignment.quantity;
        await inventory.save();
        
        console.log(' Assignment created - Assigned:', populatedAssignment.quantity);
        
      } else if (populatedAssignment.status === 'lost') {
        
        inventory.expended += populatedAssignment.quantity;
        inventory.assigned -= populatedAssignment.quantity;
        inventory.closingBalance -= populatedAssignment.quantity;
        await inventory.save();
        
        console.log(' Asset expended/lost:', populatedAssignment.quantity);
        
      } else if (populatedAssignment.status === 'returned') {
        
        inventory.assigned -= populatedAssignment.quantity;
        await inventory.save();
        
        console.log(' Assets returned:', populatedAssignment.quantity);
      }

      console.log(' Inventory after assignment update:', {
        assigned: inventory.assigned,
        expended: inventory.expended,
        closing: inventory.closingBalance
      });
    }
  } catch (error) {
    console.error(' Error updating inventory for assignment:', error);
  }
};

module.exports = mongoose.model('Assignment', assignmentSchema);