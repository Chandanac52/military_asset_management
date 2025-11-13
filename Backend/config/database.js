const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(' Database connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('  MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error(' MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('  MongoDB connection disconnected');
});

module.exports = connectDB;