const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, checkRole } = require('../middleware/auth');

router.route('/')
    .get(getServices)
    .post(protect, checkRole(['SuperAdmin', 'Admin']), createService);

router.route('/:id')
    .put(protect, checkRole(['SuperAdmin', 'Admin']), updateService)
    .delete(protect, checkRole(['SuperAdmin', 'Admin']), deleteService);

module.exports = router;
