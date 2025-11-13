const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import all models to ensure they are registered with Mongoose
require('./models/User');
require('./models/Base');
require('./models/AssetType');
require('./models/AssetInventory');
require('./models/Purchase');
require('./models/Transfer');
require('./models/Assignment');
require('./models/Expenditure');
require('./models/AuditLog');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Database connection with proper event handling
const connectDB = async () => {
  try {
    mongoose.connection.on('connecting', () => {
      console.log('🔄 MongoDB: Connecting...');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB: Connected successfully');
      console.log(`💾 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🏷️  Cluster: ${mongoose.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB: Disconnected');
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// API Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const dataRoutes = require('./routes/dataRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/data', dataRoutes);

// Health Check Endpoint with proper DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusText = 'Unknown';
  
  switch(dbStatus) {
    case 0: dbStatusText = 'Disconnected'; break;
    case 1: dbStatusText = 'Connected'; break;
    case 2: dbStatusText = 'Connecting'; break;
    case 3: dbStatusText = 'Disconnecting'; break;
  }

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatusText,
    environment: process.env.NODE_ENV
  });
});

// API Welcome Endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Military Asset Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      purchases: '/api/purchases',
      transfers: '/api/transfers',
      assignments: '/api/assignments',
      data: '/api/data',
      health: '/api/health'
    }
  });
});

// Data endpoints for dropdowns (public for development)
app.get('/api/bases', async (req, res) => {
  try {
    const Base = require('./models/Base');
    const bases = await Base.find({ isActive: true }).select('name code');
    res.json(bases);
  } catch (error) {
    console.error('Error fetching bases:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/asset-types', async (req, res) => {
  try {
    const AssetType = require('./models/AssetType');
    const assetTypes = await AssetType.find({ isActive: true }).select('name category unit');
    res.json(assetTypes);
  } catch (error) {
    console.error('Error fetching asset types:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/personnel', async (req, res) => {
  try {
    const User = require('./models/User');
    const personnel = await User.find({ 
      isActive: true,
      role: { $in: ['logistics_officer', 'base_commander'] }
    }).select('username email');
    res.json(personnel);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Military Asset Management System API',
    description: 'Secure military asset tracking and management system',
    version: '1.0.0',
    status: 'Operational',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`,
      timestamp: new Date().toISOString()
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please provide a valid authentication token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Please login again'
    });
  }
  
  // Default error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack
    }),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Start server only after DB connection is established
const startServer = async () => {
  try {
    console.log('🔄 Starting server initialization...');
    
    // Connect to database first
    await connectDB();
    
    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚀 Military Asset Management System Server Started');
      console.log('='.repeat(60));
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
      console.log('='.repeat(60));
      
      console.log('\n📋 Available Endpoints:');
      console.log('   POST   /api/auth/login     - User login');
      console.log('   POST   /api/auth/register  - User registration');
      console.log('   GET    /api/dashboard      - Dashboard data');
      console.log('   GET    /api/purchases      - Get purchases');
      console.log('   POST   /api/purchases      - Create purchase');
      console.log('   GET    /api/transfers      - Get transfers');
      console.log('   POST   /api/transfers      - Create transfer');
      console.log('   GET    /api/assignments    - Get assignments');
      console.log('   POST   /api/assignments    - Create assignment');
      console.log('   GET    /api/data/*         - Data for dropdowns');
      console.log('   GET    /api/bases          - Get bases (public)');
      console.log('   GET    /api/asset-types    - Get asset types (public)');
      console.log('   GET    /api/personnel      - Get personnel (public)');
      console.log('='.repeat(60));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          console.log('👋 Process terminated');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close();
        console.log('👋 Server stopped');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

module.exports = app;