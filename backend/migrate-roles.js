require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

/**
 * Migration Script: Update existing users to new role system
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Updates all users with old 'user' role to 'USER'
 * 3. Updates all users with old 'admin' role to 'SUPER_ADMIN'
 * 4. Sets isIIITSEmail flag for all users
 * 5. Sets roleLevel for all users
 */

async function migrateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate`);

    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      let needsUpdate = false;
      
      // Migrate old roles to new roles
      if (user.role === 'user') {
        user.role = 'USER';
        needsUpdate = true;
      } else if (user.role === 'admin') {
        user.role = 'SUPER_ADMIN';
        needsUpdate = true;
      }
      
      // The pre-save middleware will automatically set:
      // - roleLevel based on role
      // - isIIITSEmail based on email
      
      if (needsUpdate) {
        await user.save();
        console.log(`✅ Updated user: ${user.email} (${user.role})`);
        updated++;
      } else {
        console.log(`⏭️  Skipped user: ${user.email} (already migrated)`);
        skipped++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateUsers();
