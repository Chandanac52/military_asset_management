const express = require('express');
const { getAssignments, createAssignment, updateAssignment, getAssignmentOptions } = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { baseAccess } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.get('/', authMiddleware, baseAccess, getAssignments);
router.get('/options', authMiddleware, getAssignmentOptions);
router.post('/', authMiddleware, baseAccess, createAssignment);
router.put('/:id', authMiddleware, baseAccess, updateAssignment);

module.exports = router;