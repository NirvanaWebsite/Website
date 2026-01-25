require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = 'karmanyabelsare@gmail.com';

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const user = await User.findOne({ email });
            if (user) {
                console.log(`User found: ${user.email}, Role: ${user.role}, ClerkID: ${user.clerkId}`);
                user.role = 'admin';
                await user.save();
                console.log('SUCCESS: User role updated to ADMIN.');
            } else {
                console.log('ERROR: User not found with email:', email);
            }
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));
