require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test creating a user
    const testUser = new User({
      clerkId: 'test_user_123',
      email: 'test@nirvanaclub.com',
      firstName: 'Test',
      lastName: 'User',
      profileImage: 'https://example.com/avatar.jpg'
    });

    await testUser.save();
    console.log('✅ Test user created:', testUser._id);

    // Test finding the user
    const foundUser = await User.findOne({ clerkId: 'test_user_123' });
    console.log('✅ Test user found:', foundUser.email);

    // Test updating the user
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: 'test_user_123' },
      { firstName: 'Updated' },
      { new: true }
    );
    console.log('✅ Test user updated:', updatedUser.firstName);

    // Clean up - delete test user
    await User.deleteOne({ clerkId: 'test_user_123' });
    console.log('✅ Test user deleted');

    // Get collection stats
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    console.log('🎉 All database operations successful!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testDatabase();
