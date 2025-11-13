const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log(' Testing MongoDB connection...');
    
    if (!process.env.MONGODB_URI) {
      console.error(' MONGODB_URI is not defined in .env file');
      process.exit(1);
    }
    
    
    const maskedUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log('📡 Connection string:', maskedUri);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(' Connected to MongoDB successfully!');
    console.log(` Database: ${mongoose.connection.db.databaseName}`);
    console.log(`  Cluster: ${mongoose.connection.host}`);
    console.log(` Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(` Collections found: ${collections.length}`);
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(' Connection test failed:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log(' Tips:');
      console.log('   - Check your internet connection');
      console.log('   - Verify MongoDB Atlas cluster is running');
      console.log('   - Check IP whitelist in MongoDB Atlas');
      console.log('   - Verify connection string format');
    }
    
    process.exit(1);
  }
};

testConnection();