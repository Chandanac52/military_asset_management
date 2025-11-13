const AssetInventory = require('../models/AssetInventory');
const Purchase = require('../models/Purchase');
const Assignment = require('../models/Assignment');
const Transfer = require('../models/Transfer');

const getDashboardData = async (req, res) => {
  try {
    const { date, baseId, assetTypeId } = req.query;
    
    
    let filterDate = date ? new Date(date) : new Date();
    
    
    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log(' Dashboard date range:', {
      input: date,
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString()
    });
    
    let inventoryFilter = { 
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    };
    
    
    if (req.baseFilter.baseId) {
      inventoryFilter.baseId = req.baseFilter.baseId;
    } else if (baseId) {
      inventoryFilter.baseId = baseId;
    }
    
    if (assetTypeId) {
      inventoryFilter.assetTypeId = assetTypeId;
    }

    console.log('🔍 Inventory filter:', inventoryFilter);

  
    const inventoryData = await AssetInventory.find(inventoryFilter)
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit');

    console.log('📦 Found inventory records:', inventoryData.length);

    
    const purchaseFilter = {
      purchaseDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: 'received'
    };
    
    if (inventoryFilter.baseId) purchaseFilter.baseId = inventoryFilter.baseId;
    if (assetTypeId) purchaseFilter.assetTypeId = assetTypeId;

    const purchases = await Purchase.find(purchaseFilter)
      .populate('assetTypeId', 'name category');

    const totalPurchaseCost = purchases.reduce((total, purchase) => {
      return total + (purchase.totalCost || 0);
    }, 0);

    console.log('💰 Purchases today:', purchases.length, 'Total cost: ₹', totalPurchaseCost);

    
    let summary = {
      openingBalance: 0,
      closingBalance: 0,
      purchases: 0,
      transfersIn: 0,
      transfersOut: 0,
      assigned: 0,
      expended: 0,
      netMovement: 0,
      totalPurchaseCost: totalPurchaseCost
    };

    if (inventoryData.length > 0) {
      summary = inventoryData.reduce((acc, item) => {
        acc.openingBalance += item.openingBalance || 0;
        acc.closingBalance += item.closingBalance || 0;
        acc.purchases += item.purchases || 0;
        acc.transfersIn += item.transfersIn || 0;
        acc.transfersOut += item.transfersOut || 0;
        acc.assigned += item.assigned || 0;
        acc.expended += item.expended || 0;
        acc.netMovement += (item.purchases || 0) + (item.transfersIn || 0) - (item.transfersOut || 0);
        return acc;
      }, summary);
    } else {
      
      console.log('🔄 Calculating from actual transactions...');
      
      
      const assignmentFilter = {
        assignmentDate: { $gte: startOfDay, $lte: endOfDay }
      };
      if (inventoryFilter.baseId) assignmentFilter.baseId = inventoryFilter.baseId;
      if (assetTypeId) assignmentFilter.assetTypeId = assetTypeId;
      
      const assignments = await Assignment.find(assignmentFilter);
      summary.assigned = assignments.reduce((sum, a) => sum + a.quantity, 0);
      
     
      const transferFilter = {
        transferDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'completed'
      };
      
      const transfersOut = await Transfer.find({
        ...transferFilter,
        fromBaseId: inventoryFilter.baseId
      });
      summary.transfersOut = transfersOut.reduce((sum, t) => sum + t.quantity, 0);
      
      const transfersIn = await Transfer.find({
        ...transferFilter,
        toBaseId: inventoryFilter.baseId
      });
      summary.transfersIn = transfersIn.reduce((sum, t) => sum + t.quantity, 0);
      
      summary.purchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
      summary.netMovement = summary.purchases + summary.transfersIn - summary.transfersOut;
    }

    console.log('📈 FINAL Dashboard summary:', summary);

    res.json({
      summary,
      detailed: inventoryData,
      recentPurchases: purchases.slice(0, 5), 
      recentActivities: {
        purchases: purchases.length,
        transfers: summary.transfersIn + summary.transfersOut,
        assignments: summary.assigned
      }
    });
  } catch (error) {
    console.error(' Error fetching dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardData };