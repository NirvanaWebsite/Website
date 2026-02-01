const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const Bug = require('../models/Bug');
const User = require('../models/User');
const { requireBugManagementAccess } = require('../middleware/auth');

/**
 * @swagger
 * /api/bugs:
 *   post:
 *     summary: Report a new bug
 *     description: Submit a new bug report.
 *     tags: [Bugs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               screenshot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bug reported successfully
 */
router.post('/', requireAuth(), async (req, res) => {
    try {
        const auth = req.auth();
        const user = await User.findOne({ clerkId: auth.userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const bug = new Bug({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority || 'MEDIUM',
            screenshot: req.body.screenshot || '',
            reporter: user._id
        });

        await bug.save();

        res.status(201).json({
            success: true,
            message: 'Bug reported successfully',
            bug
        });
    } catch (error) {
        console.error('Error creating bug:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/bugs:
 *   get:
 *     summary: List all bugs
 *     description: Retrieve all bugs. Restricted to Admins and Technical Domain members.
 *     tags: [Bugs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bugs
 *       403:
 *         description: Access denied
 */
router.get('/', requireAuth(), requireBugManagementAccess, async (req, res) => {
    try {
        const bugs = await Bug.find()
            .populate('reporter', 'firstName lastName email profileImage')
            .populate('assignedTo', 'name image domain')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bugs.length,
            bugs
        });
    } catch (error) {
        console.error('Error fetching bugs:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/bugs/{id}:
 *   put:
 *     summary: Update bug status/priority
 *     description: Update a bug. Restricted to Admins and Technical Domain members.
 *     tags: [Bugs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bug updated successfully
 */
router.put('/:id', requireAuth(), requireBugManagementAccess, async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.body;

        const bug = await Bug.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...(status && { status }),
                    ...(priority && { priority }),
                    ...(assignedTo && { assignedTo })
                }
            },
            { new: true }
        ).populate('reporter', 'firstName lastName')
            .populate('assignedTo', 'name');

        if (!bug) {
            return res.status(404).json({ success: false, message: 'Bug not found' });
        }

        // ... previous code
        res.json({
            success: true,
            message: 'Bug updated successfully',
            bug
        });
    } catch (error) {
        console.error('Error updating bug:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/bugs/{id}:
 *   delete:
 *     summary: Delete a bug
 *     description: Remove a bug report. Restricted to Admins and Technical Domain members.
 *     tags: [Bugs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bug deleted successfully
 */
router.delete('/:id', requireAuth(), requireBugManagementAccess, async (req, res) => {
    try {
        const bug = await Bug.findByIdAndDelete(req.params.id);

        if (!bug) {
            return res.status(404).json({ success: false, message: 'Bug not found' });
        }

        res.json({
            success: true,
            message: 'Bug deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting bug:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
