const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
    try {
        if (!req.auth || !req.auth.userId) {
            console.log('Admin Auth Failed: No auth/userId in request');
            return res.status(401).json({ message: 'Unauthorized: No authentication token' });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });

        if (!user) {
            console.log('Admin Auth Failed: User not found in DB for clerkId:', req.auth.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log('Admin Auth Failed: User role is', user.role, 'expected admin');
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        // Attach user object to request for convenience
        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(500).json({ message: 'Internal server error during authorization' });
    }
};

module.exports = { requireAdmin };
