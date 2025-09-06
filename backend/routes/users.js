const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const User = require('../models/User');

// Get current user profile
router.get('/profile', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Create user if doesn't exist (first time login)
      // Get user data from Clerk
      const clerkUser = req.auth.sessionClaims;
      
      user = new User({
        clerkId: userId,
        email: clerkUser?.email || '',
        firstName: clerkUser?.first_name || clerkUser?.given_name || '',
        lastName: clerkUser?.last_name || clerkUser?.family_name || '',
        profileImage: clerkUser?.image_url || ''
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
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
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

// Get all users
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

module.exports = router;
