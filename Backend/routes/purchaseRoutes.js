const express = require('express');
const { getPurchases, createPurchase, getPurchaseOptions } = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize, baseAccess } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.get('/', authMiddleware, baseAccess, getPurchases);
router.get('/options', authMiddleware, getPurchaseOptions);
router.post('/', authMiddleware, authorize(['admin', 'logistics_officer']), createPurchase);


router.use((error, req, res, next) => {
  console.error('Purchase route error:', error);
  res.status(500).json({ error: 'Internal server error in purchase routes' });
});

module.exports = router;