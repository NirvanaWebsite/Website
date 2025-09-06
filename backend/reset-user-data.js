require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetUserData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete the existing user with fallback data
    const deletedUser = await User.findOneAndDelete({ 
      clerkId: 'user_32K4OuG4Jy0L6vIEDqKgv8MOivR' 
    });

    if (deletedUser) {
      console.log('🗑️  Deleted existing user with fallback data:');
      console.log(`   MongoDB ID: ${deletedUser._id}`);
      console.log(`   Clerk ID: ${deletedUser.clerkId}`);
      console.log(`   Email: ${deletedUser.email}`);
      console.log(`   Name: ${deletedUser.firstName} ${deletedUser.lastName}`);
    } else {
      console.log('ℹ️  No user found with that Clerk ID');
    }

    // Check remaining users
    const remainingUsers = await User.find();
    console.log(`📊 Remaining users in database: ${remainingUsers.length}`);

    console.log('\n✅ User data reset complete!');
    console.log('💡 Next steps:');
    console.log('1. Sign in again through the frontend');
    console.log('2. The system will now fetch proper user data from Clerk API');
    console.log('3. Check the backend logs for debugging info');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

resetUserData();
