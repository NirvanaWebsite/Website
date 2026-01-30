const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Application Details
    applicantName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return v.toLowerCase().endsWith('@iiits.in');
            },
            message: 'Email must be from @iiits.in domain'
        }
    },

    branch: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: String,
        required: true,
        enum: ['UG1', 'UG2', 'UG3', 'UG4']
    },

    desiredRole: {
        type: String,
        required: true,
        enum: ['MEMBER', 'DOMAIN_LEAD', 'CO_LEAD', 'LEAD']
    },

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
        ]
    },

    // Application Status
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },

    // Admin who reviewed
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    reviewedAt: {
        type: Date,
        default: null
    },

    // Admin's notes/feedback
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes for performance
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
