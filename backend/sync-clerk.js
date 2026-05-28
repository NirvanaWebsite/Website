require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function syncAndGrantAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        if (!clerkSecretKey) {
            console.error('❌ CLERK_SECRET_KEY not found in .env');
            process.exit(1);
        }

        // Fetch users from Clerk
        console.log('Fetching users from Clerk...');
        const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
            headers: {
                'Authorization': `Bearer ${clerkSecretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Clerk API error: ${response.status} ${err}`);
        }

        const clerkUsers = await response.json();
        console.log(`Found ${clerkUsers.length} users in Clerk.`);

        const targetEmail = 'karmanya.p24@iiits.in';
        let foundTarget = false;

        // Sync to MongoDB
        for (const cUser of clerkUsers) {
            const primaryEmailObj = cUser.email_addresses.find(e => e.id === cUser.primary_email_address_id) || cUser.email_addresses[0];
            const email = primaryEmailObj ? primaryEmailObj.email_address : `user_${cUser.id}@nirvanaclub.com`;
            const firstName = cUser.first_name || 'User';
            const lastName = cUser.last_name || 'Member';
            const profileImage = cUser.image_url || '';

            let dbUser = await User.findOne({ clerkId: cUser.id });
            
            if (!dbUser) {
                dbUser = new User({
                    clerkId: cUser.id,
                    email,
                    firstName,
                    lastName,
                    profileImage
                });
                console.log(`➕ Added new user from Clerk to DB: ${email}`);
            }

            // Check if this is the target user
            if (email.toLowerCase() === targetEmail.toLowerCase()) {
                dbUser.role = 'SUPER_ADMIN';
                console.log(`👑 Granted SUPER_ADMIN to ${email}`);
                foundTarget = true;
            }

            await dbUser.save();
        }

        if (!foundTarget) {
            console.log(`\n❌ User ${targetEmail} was NOT found in Clerk. They haven't signed up yet.`);
        } else {
            console.log(`\n✅ Successfully synced users and granted SUPER_ADMIN to ${targetEmail}`);
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

syncAndGrantAdmin();
