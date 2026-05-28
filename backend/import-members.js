require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const fs = require('fs');
const path = require('path');

const membersJsonPath = path.join(__dirname, '../frontend/src/data/members.json');

// Map JSON roles to model enum values: ['LEAD', 'CO_LEAD', 'DOMAIN_LEAD', 'MEMBER']
const mapRole = (role) => {
    const r = role.toLowerCase();
    if (r.includes('club lead') && !r.includes('co')) return 'LEAD';
    if (r.includes('co-lead') || r.includes('colead') || r.includes('co lead')) return 'CO_LEAD';
    if (r.includes('domain lead') || r.includes('lead')) return 'DOMAIN_LEAD';
    // advisor, core, member all map to MEMBER
    return 'MEMBER';
};

// Map JSON domains to model enum values:
// ['Leadership', 'Research', 'Public-Relations', 'Technical', 'Management', 'Event & Outreach', 'Design & Video']
const mapDomain = (domain) => {
    const d = domain.toLowerCase();
    if (d.includes('leadership') || d.includes('club lead')) return 'Leadership';
    if (d.includes('research')) return 'Research';
    if (d.includes('pr') || d.includes('public')) return 'Public-Relations';
    if (d.includes('tech')) return 'Technical';
    if (d.includes('management')) return 'Management';
    if (d.includes('event') || d.includes('outreach')) return 'Event & Outreach';
    if (d.includes('design') || d.includes('video')) return 'Design & Video';
    return 'Technical'; // fallback
};

// Map year group string to an individual year enum: ['UG1','UG2','UG3','UG4']
// We don't have individual student years in the JSON, default to UG1
const mapYear = () => 'UG1';

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        const rawData = fs.readFileSync(membersJsonPath);
        const jsonData = JSON.parse(rawData);

        const flatMembers = [];

        for (const yearGroup of jsonData) {
            const academicYear = yearGroup.year; // e.g. "2025-26"

            for (const member of yearGroup.members) {
                const mappedRole = mapRole(member.role);
                const mappedDomain = mapDomain(member.domain);

                flatMembers.push({
                    name: member.name,
                    role: mappedRole,
                    domain: mappedDomain,
                    year: mapYear(),
                    academicYear: academicYear,
                    branch: 'CSE', // default — not in JSON
                    image: member.image || '',
                    linkedin: member.linkedin || '',
                    status: 'ACTIVE'
                });
            }
        }

        console.log(`Found ${flatMembers.length} members to import.`);

        await Member.deleteMany({});
        console.log('🗑️  Cleared existing members');

        await Member.insertMany(flatMembers);
        console.log(`✅ Successfully imported ${flatMembers.length} members!`);

        // Quick summary
        const byYear = {};
        flatMembers.forEach(m => {
            byYear[m.academicYear] = (byYear[m.academicYear] || 0) + 1;
        });
        console.log('📊 Imported by academic year:', byYear);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error importing members:', error);
        process.exit(1);
    }
};

importData();
