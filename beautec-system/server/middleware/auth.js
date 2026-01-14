const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    // Support both header types

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.id ? decoded : decoded.user; // Adjust based on how token was signed (id vs user object)
        // In authController I signed with { id }, so verified token will be { id, iat, exp }
        // Let's standardise on attaching the whole user or just ID.
        // authController: jwt.sign({ id }, ...)
        // so decoded is { id: ... }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const checkRole = (roles) => {
    return async (req, res, next) => {
        // We only have ID in req.user, need to fetch user role?
        // OR we can embed role in token.
        // For efficiency, let's look up user or embed role.
        // Given current AuthController signs only ID, we need to fetch User here if we want to check role.
        const User = require('../models/User');
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(401).json({ msg: 'User not found' });

            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Access denied: Insufficient privileges' });
            }
            req.user = user; // Attach full user object for controller use
            next();
        } catch (err) {
            res.status(500).json({ msg: 'Server Error in Role Check' });
        }
    };
};

module.exports = { protect, checkRole };
