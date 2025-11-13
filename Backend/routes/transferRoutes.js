const express = require('express');
const { getTransfers, createTransfer, updateTransfer, getTransferOptions } = require('../controllers/transferController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTransfers);
router.get('/options', authMiddleware, getTransferOptions);
router.post('/', authMiddleware, authorize(['admin', 'logistics_officer']), createTransfer);
router.put('/:id', authMiddleware, authorize(['admin', 'logistics_officer']), updateTransfer);

module.exports = router;