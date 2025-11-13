const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/purchases', require('./purchaseRoutes'));
router.use('/transfers', require('./transferRoutes'));
router.use('/assignments', require('./assignmentRoutes'));
router.use('/data', require('./dataRoutes')); 

module.exports = router;