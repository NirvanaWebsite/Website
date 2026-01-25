const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { requireAuth } = require('@clerk/express');
const { requireAdmin } = require('../middleware/auth');

// Get all members
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().sort({ year: -1, domain: 1, role: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a member (Admin only) - TEMP: Removed requireAuth for debugging
router.post('/', async (req, res) => {
    try {
        const member = new Member(req.body);
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a member (Admin only) - TEMP: Removed requireAuth for debugging
router.put('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        Object.assign(member, req.body);
        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a member (Admin only) - TEMP: Removed requireAuth for debugging
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await member.deleteOne();
        res.json({ message: 'Member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
