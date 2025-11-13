const mongoose = require('mongoose');
const Base = require('../models/Base');
const AssetType = require('../models/AssetType');
require('dotenv').config();

const testData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    
    const bases = await Base.find();
    console.log(` Found ${bases.length} bases:`);
    bases.forEach(base => {
      console.log(`   - ${base.name} (${base.code}) - ID: ${base._id}`);
    });

    
    const assetTypes = await AssetType.find();
    console.log(` Found ${assetTypes.length} asset types:`);
    assetTypes.forEach(asset => {
      console.log(`   - ${asset.name} (${asset.category}) - ID: ${asset._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
};

testData();