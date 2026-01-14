const express = require('express');
const router = express.Router();
const { register, login, getMe, createUser, getAllUsers, deleteUser, updateUser } = require('../controllers/authController');
const { protect, checkRole } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// User Management Routes
router.post('/users', protect, checkRole(['SuperAdmin', 'Admin']), createUser);
router.get('/users', protect, checkRole(['SuperAdmin', 'Admin']), getAllUsers);
router.put('/users/:id', protect, checkRole(['SuperAdmin', 'Admin']), updateUser);
router.delete('/users/:id', protect, checkRole(['SuperAdmin', 'Admin']), deleteUser);

module.exports = router;
