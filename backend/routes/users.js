const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const User = require('../models/User');
const { getClerkUserData } = require('../utils/clerkHelper');

// Get current user profile
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

// Refresh user data from Clerk
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
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error refreshing user data:', error);
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
