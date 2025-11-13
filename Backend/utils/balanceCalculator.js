const AssetInventory = require('../models/AssetInventory');

const calculateDailyBalances = async (baseId, assetTypeId, date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  
  const previousDay = new Date(startDate);
  previousDay.setDate(previousDay.getDate() - 1);
  
  const previousBalance = await AssetInventory.findOne({
    baseId,
    assetTypeId,
    date: previousDay
  });

  const openingBalance = previousBalance ? previousBalance.closingBalance : 0;

  return {
    openingBalance,
    date: startDate
  };
};

const updateInventoryBalance = async (baseId, assetTypeId, date, updates) => {
  const { openingBalance } = await calculateDailyBalances(baseId, assetTypeId, date);
  
  const closingBalance = openingBalance + 
    (updates.purchases || 0) + 
    (updates.transfersIn || 0) - 
    (updates.transfersOut || 0) - 
    (updates.expended || 0);

  await AssetInventory.findOneAndUpdate(
    {
      baseId,
      assetTypeId,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    {
      openingBalance,
      closingBalance,
      ...updates
    },
    { upsert: true, new: true }
  );
};

module.exports = { calculateDailyBalances, updateInventoryBalance };