const Purchase = require('../models/Purchase');
const AssetInventory = require('../models/AssetInventory');
const Base = require('../models/Base');
const AssetType = require('../models/AssetType');

const getPurchases = async (req, res) => {
  try {
    const { startDate, endDate, baseId, assetTypeId } = req.query;
    
    let filter = {};
    
    if (req.baseFilter.baseId) {
      filter.baseId = req.baseFilter.baseId;
    } else if (baseId) {
      filter.baseId = baseId;
    }
    
    if (assetTypeId) filter.assetTypeId = assetTypeId;
    
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.purchaseDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.purchaseDate.$lte = end;
      }
    }

    console.log('🔍 Purchase filter:', filter);

    const purchases = await Purchase.find(filter)
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('receivedBy', 'username')
      .sort({ purchaseDate: -1 });

    console.log(' Found purchases:', purchases.length);
    
   
    purchases.forEach(p => {
      console.log(`   - ${p.assetTypeId?.name}: ${p.quantity} × ₹${p.unitCost} = ₹${p.totalCost}`);
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: error.message });
  }
};

const createPurchase = async (req, res) => {
  try {
    const purchaseData = {
      ...req.body,
      receivedBy: req.user._id
    };

    console.log('🛒 Creating purchase with data:', purchaseData);

    const purchase = await Purchase.create(purchaseData);

    console.log(' Purchase created with total cost: ₹', purchase.totalCost);

    
    await updateInventory(purchase);

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('receivedBy', 'username');

    res.status(201).json(populatedPurchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(400).json({ error: error.message });
  }
};

const getPurchaseOptions = async (req, res) => {
  try {
    console.log('🔄 Fetching purchase options...');
    
    const bases = await Base.find({ isActive: true });
    const assetTypes = await AssetType.find({ isActive: true });
    
    console.log(' Purchase options fetched:', {
      bases: bases.length,
      assetTypes: assetTypes.length
    });
    
    res.json({
      bases,
      assetTypes
    });
  } catch (error) {
    console.error(' Error fetching purchase options:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateInventory = async (purchase) => {
  try {
    if (purchase.status !== 'received') return;

    const purchaseDate = new Date(purchase.purchaseDate);
    const dateKey = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());

    console.log('📦 Updating inventory for purchase:', {
      baseId: purchase.baseId,
      assetTypeId: purchase.assetTypeId,
      date: dateKey,
      quantity: purchase.quantity
    });

    const result = await AssetInventory.findOneAndUpdate(
      {
        baseId: purchase.baseId,
        assetTypeId: purchase.assetTypeId,
        date: dateKey
      },
      {
        $inc: { 
          purchases: purchase.quantity, 
          closingBalance: purchase.quantity 
        },
        $setOnInsert: {
          openingBalance: 0,
          transfersIn: 0,
          transfersOut: 0,
          assigned: 0,
          expended: 0
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    console.log(' Inventory updated successfully:', {
      purchases: result.purchases,
      closingBalance: result.closingBalance
    });
  } catch (error) {
    console.error(' Error updating inventory:', error);
    throw error;
  }
};

module.exports = { getPurchases, createPurchase, getPurchaseOptions };