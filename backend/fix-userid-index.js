const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

async function fixUserIdIndex() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const membersCollection = db.collection('members');

        // Check existing indexes
        console.log('\n📋 Current indexes:');
        const indexes = await membersCollection.indexes();
        indexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key));
        });

        // Drop the old userId index if it exists
        try {
            await membersCollection.dropIndex('userId_1');
            console.log('\n✅ Dropped old userId_1 index');
        } catch (error) {
            if (error.code === 27) {
                console.log('\n⚠️  userId_1 index does not exist, skipping drop');
            } else {
                throw error;
            }
        }

        // Create new sparse unique index on userId
        await membersCollection.createIndex(
            { userId: 1 },
            {
                unique: true,
                sparse: true,  // Allows multiple null values
                name: 'userId_1'
            }
        );
        console.log('✅ Created new sparse unique index on userId');

        // Verify new indexes
        console.log('\n📋 Updated indexes:');
        const newIndexes = await membersCollection.indexes();
        newIndexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.sparse ? '(sparse)' : '');
        });

        console.log('\n✅ Index migration completed successfully!');
        console.log('You can now add multiple members without userId.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the migration
fixUserIdIndex();
