const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    // Link to User account (optional for alumni/previous members)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        unique: true,
        sparse: true // Allows multiple null values
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    // Use enum for role (team roles only, not SUPER_ADMIN or USER)
    role: {
        type: String,
        required: true,
        enum: ['LEAD', 'CO_LEAD', 'DOMAIN_LEAD', 'MEMBER'],
        trim: true
    },

    // Use enum for domain
    domain: {
        type: String,
        required: true,
        enum: [
            'Leadership',
            'Research',
            'Public-Relations',
            'Technical',
            'Management',
            'Event & Outreach',
            'Design & Video'
        ],
        default: 'Technical'
    },

    // Use enum for year
    year: {
        type: String,
        required: true,
        enum: ['UG1', 'UG2', 'UG3', 'UG4'],
        trim: true
    },

    // Academic Year for team organization (e.g., "2025-26", "2024-25")
    academicYear: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}$/,
        trim: true,
        default: '2025-26'
    },

    // Branch (e.g., CSE, ECE)
    branch: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        default: ''
    },

    linkedin: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    // Status field
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'ALUMNI'],
        default: 'ACTIVE'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
memberSchema.index({ userId: 1 });
memberSchema.index({ academicYear: 1, role: 1 });
memberSchema.index({ academicYear: 1, domain: 1 });
memberSchema.index({ role: 1 });
memberSchema.index({ status: 1 });

module.exports = mongoose.model('Member', memberSchema);

