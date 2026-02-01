const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String, // Markdown supported
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL to image
        required: false
    },
    rsvpRequired: {
        type: Boolean,
        default: true
    },
    registrationLink: {
        type: String, // Optional, for External Google Forms etc.
        required: false
    },
    registrations: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    photosLink: {
        type: String, // Optional, Google Drive link for past events
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
