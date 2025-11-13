const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
require('dotenv').config();

const testPurchase = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    
    const testData = {
      baseId: new mongoose.Types.ObjectId(),
      assetTypeId: new mongoose.Types.ObjectId(),
      quantity: 10,
      unitCost: 50000,
      purchaseDate: new Date(),
      supplier: 'Test Supplier',
      receivedBy: new mongoose.Types.ObjectId(),
      status: 'received'
    };

    console.log(' Testing purchase creation...');
    const purchase = new Purchase(testData);
    
    console.log('Before save - totalCost:', purchase.totalCost);
    
    await purchase.save();
    
    console.log('After save - totalCost:', purchase.totalCost);
    console.log(' Purchase test successful!');
    
    process.exit(0);
  } catch (error) {
    console.error(' Purchase test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};

testPurchase();