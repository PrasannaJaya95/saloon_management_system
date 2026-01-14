const express = require('express');
const router = express.Router();
const { getChairs, getChair, createChair, updateChair, deleteChair } = require('../controllers/chairController');
const { protect, checkRole } = require('../middleware/auth');

router.route('/')
    .get(getChairs)
    .post(protect, checkRole(['SuperAdmin', 'Admin']), createChair);

router.route('/:id')
    .get(getChair)
    .put(protect, checkRole(['SuperAdmin', 'Admin']), updateChair)
    .delete(protect, checkRole(['SuperAdmin', 'Admin']), deleteChair);

module.exports = router;
