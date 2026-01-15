const express = require('express');
const router = express.Router();
const { register, login, getMe, createUser, getAllUsers, deleteUser, updateUser, changePassword, uploadAvatar } = require('../controllers/authController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// User Management Routes
router.post('/users', protect, checkRole(['SuperAdmin', 'Admin']), createUser);
router.get('/users', protect, checkRole(['SuperAdmin', 'Admin']), getAllUsers);
router.put('/users/:id', protect, checkRole(['SuperAdmin', 'Admin']), updateUser);
router.delete('/users/:id', protect, checkRole(['SuperAdmin', 'Admin']), deleteUser);

// Profile Management
router.put('/profile/password', protect, changePassword);
router.put('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
