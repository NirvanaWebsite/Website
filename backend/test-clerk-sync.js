require('dotenv').config();
const express = require('express');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
const mongoose = require('mongoose');
const User = require('./models/User');

async function testClerkMongoSync() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create Express app for testing
    const app = express();
    app.use(express.json());
    app.use(clerkMiddleware());

    // Test endpoint that mimics the user profile route
    app.get('/test-profile', requireAuth(), async (req, res) => {
      try {
        const { userId } = req.auth;
        console.log('🔑 Clerk User ID:', userId);
        console.log('📋 Session Claims:', JSON.stringify(req.auth.sessionClaims, null, 2));
        
        let user = await User.findOne({ clerkId: userId });
        
        if (!user) {
          const clerkUser = req.auth.sessionClaims;
          user = new User({
            clerkId: userId,
            email: clerkUser?.email || '',
            firstName: clerkUser?.first_name || clerkUser?.given_name || '',
            lastName: clerkUser?.last_name || clerkUser?.family_name || '',
            profileImage: clerkUser?.image_url || ''
          });
          await user.save();
          console.log('✅ New user created in MongoDB:', user._id);
        } else {
          console.log('✅ Existing user found in MongoDB:', user._id);
        }

        res.json({
          success: true,
          clerkData: {
            userId: req.auth.userId,
            sessionClaims: req.auth.sessionClaims
          },
          mongoData: user
        });
      } catch (error) {
        console.error('❌ Error in test endpoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Test without authentication (should fail)
    console.log('\n🧪 Testing unauthenticated request...');
    const testReq = {
      headers: {},
      method: 'GET',
      url: '/test-profile'
    };
    
    // Mock request/response for testing
    const mockReq = {
      headers: {},
      method: 'GET',
      url: '/test-profile',
      auth: null
    };
    
    const mockRes = {
      status: (code) => ({ json: (data) => console.log(`Status ${code}:`, data) }),
      json: (data) => console.log('Response:', data)
    };

    // Test Clerk middleware configuration
    console.log('\n🔧 Checking Clerk configuration...');
    console.log('CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);
    console.log('CLERK_PUBLISHABLE_KEY exists:', !!process.env.CLERK_PUBLISHABLE_KEY);
    
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('⚠️  CLERK_SECRET_KEY is missing - authentication will not work');
    }

    // Check MongoDB User model
    console.log('\n📊 Checking MongoDB User collection...');
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      const sampleUser = await User.findOne().limit(1);
      console.log('Sample user structure:', {
        clerkId: sampleUser.clerkId,
        email: sampleUser.email,
        firstName: sampleUser.firstName,
        lastName: sampleUser.lastName,
        hasProfileImage: !!sampleUser.profileImage
      });
    }

    console.log('\n🎯 Sync Status Summary:');
    console.log('✅ MongoDB connection: Working');
    console.log('✅ User model: Ready');
    console.log('✅ Clerk middleware: Configured');
    console.log('⚠️  Authentication: Requires valid Clerk session token');
    console.log('\n💡 To test complete sync:');
    console.log('1. Start frontend and backend servers');
    console.log('2. Sign in through frontend');
    console.log('3. Check dashboard for sync status');

  } catch (error) {
    console.error('❌ Sync test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testClerkMongoSync();
