const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', protect, checkRole(['SuperAdmin', 'Admin']), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'heroBackground', maxCount: 1 }, { name: 'aboutImage', maxCount: 1 }, { name: 'contactHero', maxCount: 1 }]), updateSettings);

module.exports = router;
