const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const { baseAccess } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.get('/', authMiddleware, baseAccess, getDashboardData);

module.exports = router;