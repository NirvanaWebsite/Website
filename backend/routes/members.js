const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const User = require('../models/User');
const { requireAuth } = require('@clerk/express');
const { requireRole } = require('../middleware/auth');

// Get all members (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { academicYear, role, domain, status } = req.query;
        const filter = {};

        if (academicYear) filter.academicYear = academicYear;
        if (role) filter.role = role;
        if (domain) filter.domain = domain;
        if (status) filter.status = status;

        const members = await Member.find(filter)
            .populate('userId', 'firstName lastName email profileImage')
            .sort({ academicYear: -1, role: 1, domain: 1 });

        // Map members to include profileImage from User if member.image is empty
        const membersWithImages = members.map(member => {
            const memberObj = member.toObject();
            // Use Google profile image if member doesn't have a custom image
            if (!memberObj.image && memberObj.userId?.profileImage) {
                memberObj.image = memberObj.userId.profileImage;
            }
            return memberObj;
        });

        res.json(membersWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get list of all academic years
router.get('/academic-years', async (req, res) => {
    try {
        const years = await Member.distinct('academicYear');
        // Sort in descending order (newest first)
        years.sort().reverse();
        res.json({ success: true, academicYears: years });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get members by academic year
router.get('/by-year/:year', async (req, res) => {
    try {
        const members = await Member.find({ academicYear: req.params.year })
            .populate('userId', 'firstName lastName email profileImage')
            .sort({ role: 1, domain: 1 });

        const membersWithImages = members.map(member => {
            const memberObj = member.toObject();
            if (!memberObj.image && memberObj.userId?.profileImage) {
                memberObj.image = memberObj.userId.profileImage;
            }
            return memberObj;
        });

        res.json({ success: true, members: membersWithImages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a member (Admin only)
router.post('/', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const member = new Member(req.body);
        const newMember = await member.save();

        // If userId is provided, update the User's role and memberId
        if (member.userId) {
            await User.findByIdAndUpdate(member.userId, {
                role: member.role,
                memberId: newMember._id
            });
        }

        res.status(201).json({ success: true, member: newMember });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update a member (Admin only)
router.put('/:id', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        Object.assign(member, req.body);
        const updatedMember = await member.save();

        // Update User role if it changed
        if (member.userId && req.body.role) {
            await User.findByIdAndUpdate(member.userId, { role: req.body.role });
        }

        res.json({ success: true, member: updatedMember });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete a member (Admin only)
router.delete('/:id', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        // Update linked User to remove member reference
        if (member.userId) {
            await User.findByIdAndUpdate(member.userId, {
                role: 'USER',
                $unset: { memberId: 1 }
            });
        }

        await member.deleteOne();
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
