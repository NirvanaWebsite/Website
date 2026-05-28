require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to DB');

        const targetEmail = 'karmanya.p24@iiits.in';
        
        // Find by email (case-insensitive)
        const user = await User.findOne({ email: new RegExp('^' + targetEmail + '$', 'i') });

        if (user) {
            user.role = 'SUPER_ADMIN';
            await user.save();
            console.log(`✅ Successfully granted SUPER_ADMIN permission to ${user.email}`);
        } else {
            console.log(`❌ User ${targetEmail} not found in the database.`);
            console.log(`⚠️ Please ask the user to sign in to the website at least once so their account is created, then run this script again.`);
            
            // Also list available users to see who is registered
            const users = await User.find({}).select('email role');
            console.log('\nCurrently registered users:');
            users.forEach((u, i) => console.log(`${i + 1}. ${u.email} (${u.role})`));
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

makeAdmin();
