const express = require('express');
const { login, register, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;