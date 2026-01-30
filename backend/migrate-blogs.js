require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const migrateBlogsToReviewSystem = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('\n📊 Fetching existing blogs...');
        const blogs = await Blog.find({});
        console.log(`Found ${blogs.length} blogs to migrate`);

        if (blogs.length === 0) {
            console.log('✅ No blogs to migrate');
            process.exit(0);
        }

        console.log('\n🔄 Migrating blogs...');
        let migratedCount = 0;

        for (const blog of blogs) {
            // Set default values for new fields if not already set
            if (!blog.status) {
                blog.status = 'APPROVED'; // Existing blogs are considered approved
            }
            if (!blog.upvotes) {
                blog.upvotes = [];
            }
            if (blog.upvoteCount === undefined) {
                blog.upvoteCount = 0;
            }

            await blog.save();
            migratedCount++;
            console.log(`  ✓ Migrated: ${blog.title}`);
        }

        console.log(`\n✅ Successfully migrated ${migratedCount} blogs`);
        console.log('\n📋 Migration Summary:');
        console.log(`   - All existing blogs set to APPROVED status`);
        console.log(`   - Upvotes initialized to empty array`);
        console.log(`   - Upvote count set to 0`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
console.log('🚀 Starting Blog Review System Migration\n');
migrateBlogsToReviewSystem();
