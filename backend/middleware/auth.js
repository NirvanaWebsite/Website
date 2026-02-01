const User = require('../models/User');
const Member = require('../models/Member');

/**
 * Middleware to check if user has one of the required roles
 * @param {Array<string>} allowedRoles - Array of roles that can access the route
 * @returns {Function} Express middleware function
 */
const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.auth || !req.auth.userId) {
                console.log('Auth Failed: No auth/userId in request');
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: No authentication token'
                });
            }

            const user = await User.findOne({ clerkId: req.auth.userId });

            if (!user) {
                console.log('Auth Failed: User not found in DB for clerkId:', req.auth.userId);
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user's role is in allowed roles
            if (!allowedRoles.includes(user.role)) {
                console.log('Auth Failed: User role is', user.role, 'but requires one of:', allowedRoles);
                return res.status(403).json({
                    success: false,
                    message: `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`
                });
            }

            // Attach user object to request for convenience
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during authorization'
            });
        }
    };
};

/**
 * Legacy admin check (for backward compatibility)
 * Allows SUPER_ADMIN, LEAD, and CO_LEAD
 */
const requireAdmin = requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']);

/**
 * Middleware to check if user is a team member
 * Allows MEMBER, DOMAIN_LEAD, CO_LEAD, LEAD, and SUPER_ADMIN
 */
const requireMember = requireRole(['MEMBER', 'DOMAIN_LEAD', 'CO_LEAD', 'LEAD', 'SUPER_ADMIN']);

/**
 * Middleware to check if user can promote to a specific role
 * User can only promote to roles at or below their own level
 * @param {string} targetRole - The role to promote to
 * @returns {Function} Express middleware function
 */
const canPromoteTo = (targetRole) => {
    return async (req, res, next) => {
        try {
            const user = req.user; // Should be set by requireRole middleware

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const roleLevels = {
                'SUPER_ADMIN': 5,
                'LEAD': 4,
                'CO_LEAD': 3,
                'DOMAIN_LEAD': 2,
                'MEMBER': 1,
                'USER': 0
            };

            const userLevel = roleLevels[user.role] || 0;
            const targetLevel = roleLevels[targetRole] || 0;

            if (userLevel < targetLevel) {
                return res.status(403).json({
                    success: false,
                    message: `You cannot promote to ${targetRole}. Your role level (${user.role}) is insufficient.`
                });
            }

            next();
        } catch (error) {
            console.error('Promotion check error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

const requireBugManagementAccess = async (req, res, next) => {
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Get user (if not already attached by previous middleware, though usually used standalone)
        let user = req.user;
        if (!user) {
            user = await User.findOne({ clerkId: req.auth.userId });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 1. Check high-level roles
        const allowedRoles = ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'];
        if (allowedRoles.includes(user.role)) {
            req.user = user;
            return next();
        }

        // 2. Check if Member with Technical domain
        if (user.memberId) {
            const member = await Member.findById(user.memberId);
            if (member && member.domain === 'Technical') {
                req.user = user;
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. Requires Lead role or Technical Domain membership.'
        });

    } catch (error) {
        console.error('Bug management auth error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { requireRole, requireAdmin, requireMember, canPromoteTo, requireBugManagementAccess };

