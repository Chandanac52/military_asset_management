const Transfer = require('../models/Transfer');
const AssetInventory = require('../models/AssetInventory');
const mongoose = require('mongoose');

const getTransfers = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let filter = {};
    
    
    if (req.user.role === 'base_commander') {
      filter.$or = [
        { fromBaseId: req.user.baseId },
        { toBaseId: req.user.baseId }
      ];
    }
    
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.transferDate = {};
      if (startDate) filter.transferDate.$gte = new Date(startDate);
      if (endDate) filter.transferDate.$lte = new Date(endDate);
    }

    console.log(' Transfer filter:', filter);

    const transfers = await Transfer.find(filter)
      .populate('fromBaseId', 'name code')
      .populate('toBaseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('initiatedBy', 'username')
      .populate('approvedBy', 'username')
      .sort({ transferDate: -1 });

    console.log(' Found transfers:', transfers.length);

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransfer = async (req, res) => {
  try {
   
    const transferData = {
      ...req.body,
      fromBaseId: new mongoose.Types.ObjectId(req.body.fromBaseId),
      toBaseId: new mongoose.Types.ObjectId(req.body.toBaseId),
      assetTypeId: new mongoose.Types.ObjectId(req.body.assetTypeId),
      initiatedBy: req.user._id
    };

    console.log(' Creating transfer with data:', transferData);

    const transfer = await Transfer.create(transferData);

    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate('fromBaseId', 'name code')
      .populate('toBaseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('initiatedBy', 'username');

    res.status(201).json(populatedTransfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status === 'completed') {
      updateData.approvedBy = req.user._id;
    }

    const transfer = await Transfer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('fromBaseId', 'name code')
      .populate('toBaseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('initiatedBy', 'username')
      .populate('approvedBy', 'username');

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

   
    if (updateData.status === 'completed') {
      await updateTransferInventory(transfer);
    }

    res.json(transfer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTransferInventory = async (transfer) => {
  try {
    const transferDate = new Date(transfer.transferDate);
    const dateKey = new Date(transferDate.getFullYear(), transferDate.getMonth(), transferDate.getDate());

    console.log(' Updating transfer inventory for:', {
      fromBase: transfer.fromBaseId,
      toBase: transfer.toBaseId,
      assetType: transfer.assetTypeId,
      quantity: transfer.quantity,
      date: dateKey
    });

   
    let fromInventory = await AssetInventory.findOne({
      baseId: transfer.fromBaseId,
      assetTypeId: transfer.assetTypeId,
      date: dateKey
    });

    if (fromInventory) {
      fromInventory.transfersOut += transfer.quantity;
      
      fromInventory.closingBalance = fromInventory.purchases + 
                                    fromInventory.transfersIn - 
                                    fromInventory.transfersOut - 
                                    fromInventory.assigned - 
                                    fromInventory.expended;
      await fromInventory.save();
    } else {
      fromInventory = await AssetInventory.create({
        baseId: transfer.fromBaseId,
        assetTypeId: transfer.assetTypeId,
        date: dateKey,
        openingBalance: 0, 
        purchases: 0,
        transfersIn: 0,
        transfersOut: transfer.quantity,
        assigned: 0,
        expended: 0,
        closingBalance: -transfer.quantity 
      });
    }

   
    let toInventory = await AssetInventory.findOne({
      baseId: transfer.toBaseId,
      assetTypeId: transfer.assetTypeId,
      date: dateKey
    });

    if (toInventory) {
      toInventory.transfersIn += transfer.quantity;
      
      toInventory.closingBalance = toInventory.purchases + 
                                  toInventory.transfersIn - 
                                  toInventory.transfersOut - 
                                  toInventory.assigned - 
                                  toInventory.expended;
      await toInventory.save();
    } else {
      toInventory = await AssetInventory.create({
        baseId: transfer.toBaseId,
        assetTypeId: transfer.assetTypeId,
        date: dateKey,
        openingBalance: 0, 
        purchases: 0,
        transfersIn: transfer.quantity,
        transfersOut: 0,
        assigned: 0,
        expended: 0,
        closingBalance: transfer.quantity 
      });
    }

    console.log(' Transfer inventory updated successfully');
    console.log(' From base - Transfers Out:', fromInventory.transfersOut, 'Closing Balance:', fromInventory.closingBalance);
    console.log(' To base - Transfers In:', toInventory.transfersIn, 'Closing Balance:', toInventory.closingBalance);
  } catch (error) {
    console.error(' Error updating transfer inventory:', error);
    throw error;
  }
};

const getTransferOptions = async (req, res) => {
  try {
    const Base = require('../models/Base');
    const AssetType = require('../models/AssetType');
    
    const bases = await Base.find({ isActive: true });
    const assetTypes = await AssetType.find({ isActive: true });
    
    res.json({
      bases,
      assetTypes
    });
  } catch (error) {
    console.error('Error fetching transfer options:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTransfers, createTransfer, updateTransfer, getTransferOptions };