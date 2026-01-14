const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', protect, checkRole(['SuperAdmin', 'Admin']), upload.single('logo'), updateSettings);

module.exports = router;
