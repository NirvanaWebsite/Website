
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        if (users.length === 0) {
            console.log("No users found. Please login first.");
            return;
        }

        // List users
        users.forEach((u, i) => console.log(`${i + 1}. ${u.email} (${u.role})`));

        // Target specific user
        const targetEmail = 'karmanyabelsare@gmail.com';
        const target = users.find(u => u.email === targetEmail);

        if (target) {
            target.role = 'admin';
            await target.save();
            console.log(`Updated ${target.email} to admin.`);
        } else {
            console.log(`User ${targetEmail} not found. Please login with this email first.`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

makeAdmin();
