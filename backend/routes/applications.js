const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const Member = require('../models/Member');
const { requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit application for team membership
 *     description: Allows @iiits.in users to apply for Nirvana Club membership
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - branch
 *               - year
 *               - desiredRole
 *               - domain
 *               - motivation
 *               - skills
 *             properties:
 *               applicantName:
 *                 type: string
 *               branch:
 *                 type: string
 *               year:
 *                 type: string
 *                 enum: [UG1, UG2, UG3, UG4]
 *               desiredRole:
 *                 type: string
 *                 enum: [MEMBER, DOMAIN_LEAD, CO_LEAD, LEAD]
 *               domain:
 *                 type: string
 *               motivation:
 *                 type: string
 *               skills:
 *                 type: string
 *               portfolioLinks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request (already applied or already a member)
 *       403:
 *         description: Not eligible (non-IIITS email)
 */
router.post('/', requireAuth(), async (req, res) => {
    try {
        const auth = req.auth();
        const { userId } = auth;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user email is from IIITS
        if (!user.isIIITSEmail) {
            return res.status(403).json({
                success: false,
                message: 'Only @iiits.in email addresses can apply for team membership'
            });
        }

        // Check if user already has a pending application
        const existingApplication = await Application.findOne({
            userId: user._id,
            status: 'PENDING'
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending application. Please wait for admin review.'
            });
        }

        // Check if user is already a member
        if (user.memberId) {
            return res.status(400).json({
                success: false,
                message: 'You are already a team member'
            });
        }

        const application = new Application({
            userId: user._id,
            applicantName: req.body.applicantName,
            email: user.email,
            branch: req.body.branch,
            year: req.body.year,
            desiredRole: req.body.desiredRole,
            domain: req.body.domain,

        });

        await application.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! You will be notified once reviewed.',
            application
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/applications/my-application:
 *   get:
 *     summary: Get current user's application status
 *     description: Returns the most recent application for the authenticated user
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 */
router.get('/my-application', requireAuth(), async (req, res) => {
    try {
        const auth = req.auth();
        const { userId } = auth;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const application = await Application.findOne({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('reviewedBy', 'firstName lastName');

        res.json({
            success: true,
            application
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (admin only)
 *     description: Returns all applications, optionally filtered by status
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       403:
 *         description: Forbidden (requires admin role)
 */
router.get('/', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const applications = await Application.find(filter)
            .populate('userId', 'firstName lastName email profileImage')
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/applications/{id}/approve:
 *   put:
 *     summary: Approve application and create member
 *     description: Approves the application and creates a member record
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application approved successfully
 *       404:
 *         description: Application not found
 *       400:
 *         description: Application already reviewed
 */
router.put('/:id/approve', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Application has already been reviewed'
            });
        }

        // Get user data to retrieve profile image
        const user = await User.findById(application.userId);

        // Create Member record
        const member = new Member({
            userId: application.userId,
            name: application.applicantName,
            role: application.desiredRole,
            domain: application.domain,
            year: application.year,
            branch: application.branch,
            email: application.email,
            image: user.profileImage || '', // Use Google/Clerk profile image
            linkedin: application.portfolioLinks,
            status: 'ACTIVE'
        });

        await member.save();

        // Update User record
        await User.findByIdAndUpdate(application.userId, {
            memberId: member._id,
            role: application.desiredRole
        });

        // Update Application
        application.status = 'APPROVED';
        application.reviewedBy = req.user._id;
        application.reviewedAt = new Date();
        application.adminNotes = req.body.adminNotes || '';
        await application.save();

        res.json({
            success: true,
            message: 'Application approved and member created successfully',
            member
        });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/applications/{id}/reject:
 *   put:
 *     summary: Reject application
 *     description: Rejects the application with optional admin notes
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application rejected successfully
 */
router.put('/:id/reject', requireAuth(), requireRole(['SUPER_ADMIN', 'LEAD', 'CO_LEAD']), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Application has already been reviewed'
            });
        }

        application.status = 'REJECTED';
        application.reviewedBy = req.user._id;
        application.reviewedAt = new Date();
        application.adminNotes = req.body.adminNotes || '';
        await application.save();

        res.json({
            success: true,
            message: 'Application rejected'
        });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
