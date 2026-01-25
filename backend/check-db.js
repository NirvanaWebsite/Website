require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const count = await Member.countDocuments();
        console.log(`Member count in DB: ${count}`);
        if (count > 0) {
            const sample = await Member.findOne();
            console.log('Sample member:', sample);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
