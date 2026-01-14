const express = require('express');
const router = express.Router();
const { getStats, getChartData } = require('../controllers/reportController');
const { protect, checkRole } = require('../middleware/auth');

// Protected Routes - Only Admin/SuperAdmin
router.get('/stats', protect, checkRole(['SuperAdmin', 'Admin']), getStats);
router.get('/chart', protect, checkRole(['SuperAdmin', 'Admin']), getChartData);

module.exports = router;
