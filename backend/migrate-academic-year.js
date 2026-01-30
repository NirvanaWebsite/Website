const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Migration Script: Add academicYear field to existing members
 * This script updates all existing Member documents to include the academicYear field
 */

async function migrateAcademicYear() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Member = require('./models/Member');

        // Get all members without academicYear
        const members = await Member.find({ academicYear: { $exists: false } });
        console.log(`📊 Found ${members.length} members to migrate`);

        if (members.length === 0) {
            console.log('✅ All members already have academicYear field');
            process.exit(0);
        }

        // Update each member with default academic year
        let updated = 0;
        for (const member of members) {
            try {
                member.academicYear = '2025-26'; // Current academic year
                await member.save();
                console.log(`✅ Updated member: ${member.name} (${member.email})`);
                updated++;
            } catch (error) {
                console.error(`❌ Error updating member ${member.name}:`, error.message);
            }
        }

        console.log('\n📈 Migration Summary:');
        console.log(`   Total members: ${members.length}`);
        console.log(`   Updated: ${updated}`);
        console.log(`   Failed: ${members.length - updated}`);

        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateAcademicYear();
