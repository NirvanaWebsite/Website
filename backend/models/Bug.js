const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'MEDIUM'
    },
    screenshot: {
        type: String, // URL to image
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bug', bugSchema);
