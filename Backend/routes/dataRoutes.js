const express = require('express');
const Base = require('../models/Base');
const AssetType = require('../models/AssetType');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/bases', authMiddleware, async (req, res) => {
  try {
    const bases = await Base.find({ isActive: true }).select('name code');
    res.json(bases);
  } catch (error) {
    console.error('Error fetching bases:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/asset-types', authMiddleware, async (req, res) => {
  try {
    const assetTypes = await AssetType.find({ isActive: true }).select('name category unit');
    res.json(assetTypes);
  } catch (error) {
    console.error('Error fetching asset types:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/personnel', authMiddleware, async (req, res) => {
  try {
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

module.exports = router;