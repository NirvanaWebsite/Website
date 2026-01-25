require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const fs = require('fs');
const path = require('path');

const membersJsonPath = path.join(__dirname, '../frontend/src/data/members.json');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error(err));

const importData = async () => {
    try {
        const rawData = fs.readFileSync(membersJsonPath);
        const jsonData = JSON.parse(rawData);

        // Transform data from hierarchical to flat list
        const flatMembers = jsonData.flatMap(yearGroup => {
            return yearGroup.members.map(member => ({
                name: member.name,
                role: member.role,
                domain: member.domain,
                year: yearGroup.year,
                image: member.image,
                linkedin: member.linkedin
            }));
        });

        console.log(`Found ${flatMembers.length} members to import.`);

        await Member.deleteMany(); // Clear existing
        await Member.insertMany(flatMembers);

        console.log('✅ Data Imported!');
        process.exit();
    } catch (error) {
        console.error('❌ Error with data import', error);
        process.exit(1);
    }
};

importData();
