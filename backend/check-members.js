const mongoose = require('mongoose');
require('dotenv').config();
const Member = require('./models/Member');

const checkMembers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Member.countDocuments();
        console.log(`Number of members: ${count}`);

        if (count > 0) {
            const members = await Member.find().limit(3);
            console.log('Sample members:', members);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkMembers();
