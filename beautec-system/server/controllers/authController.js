const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'beautec_fallback_secret_2024', {
        expiresIn: '365d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (or Admin only later)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        console.log('Password provided:', password);

        // Check for user email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);

            if (isMatch) {
                res.json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                });
                return;
            }
        }

        res.status(401).json({ message: 'Invalid credentials (User found: ' + (user ? 'Yes' : 'No') + ')' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create a new user (Admin/SuperAdmin only)
// @route   POST /api/auth/users
// @access  Private (Admin/SuperAdmin)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, permissions, position, phone } = req.body;

        // Validation: Only SuperAdmin can create Admins
        if (role === 'SuperAdmin' || role === 'Admin') {
            if (req.user.role !== 'SuperAdmin') {
                // Check if the requester is trying to create a privilege higher or equal to themselves?
                // Simple rule: Only SuperAdmin can create 'Admin' or 'SuperAdmin'.
                // Actually the prompt says: "limited access for admin... he can create users"
                // So Admin can create 'User' (Staff) but not 'SuperAdmin' or other 'Admin's maybe?
                // Let's allow SuperAdmin to do anything.
                // Allow Admin to create 'User', 'Staff', 'Manager'?
                if (req.user.role !== 'SuperAdmin') {
                    return res.status(403).json({ message: 'Only SuperAdmin can create Admin accounts' });
                }
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'User',
            permissions: permissions || [],
            position,
            phone,
            status: 'Active'
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin/SuperAdmin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin/SuperAdmin)
exports.deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. PROTECTION: No one can delete a Super Admin
        if (userToDelete.role === 'SuperAdmin') {
            return res.status(403).json({ message: 'CRITICAL: Cannot delete a Super Admin account.' });
        }

        // 2. PROTECTION: Admins cannot delete other Admins
        if (req.user.role !== 'SuperAdmin' && userToDelete.role === 'Admin') {
            return res.status(403).json({ message: 'Admins cannot delete other Admin accounts. Contact Super Admin.' });
        }

        await userToDelete.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/users/:id
// @access  Private (Admin/SuperAdmin)
exports.updateUser = async (req, res) => {
    try {
        const userToUpdate = await User.findById(req.params.id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, role, permissions, status, position, phone } = req.body;

        // 1. PROTECTION: No one can edit a Super Admin (except maybe the Super Admin themselves, but let's restrict for now to be safe)
        if (userToUpdate.role === 'SuperAdmin' && req.user.role !== 'SuperAdmin') {
            return res.status(403).json({ message: 'Cannot edit a Super Admin account.' });
        }

        // 2. PROTECTION: Admins cannot promote/demote or edit other Admins
        if (req.user.role !== 'SuperAdmin') {
            if (userToUpdate.role === 'Admin') {
                return res.status(403).json({ message: 'Admins cannot edit other Admin accounts.' });
            }
            if (role === 'Admin' || role === 'SuperAdmin') {
                return res.status(403).json({ message: 'Admins cannot promote users to Admin/SuperAdmin.' });
            }
        }

        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;
        userToUpdate.role = role || userToUpdate.role;
        userToUpdate.permissions = permissions || userToUpdate.permissions;
        userToUpdate.status = status || userToUpdate.status;
        userToUpdate.position = position || userToUpdate.position;
        userToUpdate.phone = phone || userToUpdate.phone;

        await userToUpdate.save();

        res.status(200).json({
            _id: userToUpdate._id,
            name: userToUpdate.name,
            email: userToUpdate.email,
            role: userToUpdate.role,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
