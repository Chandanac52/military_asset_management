const mongoose = require('mongoose');
const { initializeDailyInventory } = require('../controllers/dashboardController');
require('dotenv').config();

const initDailyInventory = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    console.log(' Initializing daily inventory...');
    await initializeDailyInventory();
    
    console.log(' Daily inventory initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error(' Error initializing daily inventory:', error);
    process.exit(1);
  }
};

initDailyInventory();