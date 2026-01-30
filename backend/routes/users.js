const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const User = require('../models/User');
const { getClerkUserData } = require('../utils/clerkHelper');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the authenticated user's profile information. Creates a new user record if this is the first login.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Create user if doesn't exist (first time login)
      // Get user data from Clerk API
      const clerkUserData = await getClerkUserData(userId);

      if (clerkUserData) {
        user = new User({
          clerkId: userId,
          email: clerkUserData.email || `user_${userId}@nirvanaclub.com`,
          firstName: clerkUserData.firstName || 'User',
          lastName: clerkUserData.lastName || 'Member',
          profileImage: clerkUserData.profileImage || ''
        });
      } else {
        // Fallback to session claims if API call fails
        const clerkUser = auth.sessionClaims;
        console.log('🔍 Fallback - Clerk Session Claims:', JSON.stringify(clerkUser, null, 2));

        user = new User({
          clerkId: userId,
          email: clerkUser?.email || clerkUser?.email_addresses?.[0]?.email_address || `user_${userId}@nirvanaclub.com`,
          firstName: clerkUser?.first_name || clerkUser?.given_name || clerkUser?.name?.split(' ')[0] || 'User',
          lastName: clerkUser?.last_name || clerkUser?.family_name || clerkUser?.name?.split(' ')[1] || 'Member',
          profileImage: clerkUser?.image_url || clerkUser?.picture || ''
        });
      }

      console.log('💾 Creating user with data:', {
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage
      });

      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        role: user.role, // Added role field
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile information (firstName and lastName)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '507f1f77bcf86cd799439011'
 *                     firstName:
 *                       type: string
 *                       example: 'John'
 *                     lastName:
 *                       type: string
 *                       example: 'Doe'
 *                     email:
 *                       type: string
 *                       example: 'user@nirvanaclub.com'
 *                     profileImage:
 *                       type: string
 *                       example: 'https://images.clerk.dev/oauth_google/img_example'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    const { firstName, lastName } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        firstName,
        lastName
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refresh user data from Clerk
 *     description: Fetches the latest user data from Clerk API and updates the MongoDB record
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'User data refreshed successfully'
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request - Could not fetch user data from Clerk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;

    // Get fresh data from Clerk
    const clerkUserData = await getClerkUserData(userId);

    if (!clerkUserData) {
      return res.status(400).json({ error: 'Could not fetch user data from Clerk' });
    }

    // Update or create user with fresh data
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        email: clerkUserData.email || `user_${userId}@nirvanaclub.com`,
        firstName: clerkUserData.firstName || 'User',
        lastName: clerkUserData.lastName || 'Member',
        profileImage: clerkUserData.profileImage || ''
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('🔄 User data refreshed:', {
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    res.json({
      success: true,
      message: 'User data refreshed successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        role: user.role, // Added role field
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error refreshing user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all registered users (requires authentication)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *                   description: Total number of users
 *                   example: 25
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/all', requireAuth(), async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/users/eligibility:
 *   get:
 *     summary: Check if user is eligible to apply for team membership
 *     description: Checks if user has @iiits.in email and is not already a member
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Eligibility status retrieved successfully
 */
router.get('/eligibility', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth();
    const { userId } = auth;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const eligible = user.isIIITSEmail && !user.memberId;

    res.json({
      success: true,
      eligible,
      isIIITSEmail: user.isIIITSEmail,
      isMember: !!user.memberId,
      currentRole: user.role,
      roleLevel: user.roleLevel
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

