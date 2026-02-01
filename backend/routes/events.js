const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { requireAuth } = require('@clerk/express');
const Event = require('../models/Event');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events.
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ startDate: 1 });
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event
 *     description: Retrieve a specific event by ID.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin Routes

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Create an event. Restricted to Admins.
 *     tags: [Events]
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
 *               - startDate
 *               - location
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const event = new Event({
            ...req.body,
            createdBy: user._id
        });

        await event.save();

        res.status(201).json({ success: true, message: 'Event created successfully', event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     description: Update an existing event. Restricted to Admins.
 *     tags: [Events]
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
 *         description: Event updated successfully
 */
router.put('/:id', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event. Restricted to Admins.
 *     tags: [Events]
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
 *         description: Event deleted successfully
 */
router.delete('/:id', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Registration Routes

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     description: Register the authenticated user for an event.
 *     tags: [Events]
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
 *         description: Registered successfully
 */
router.post('/:id/register', requireAuth(), async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        // Check if already registered
        const alreadyRegistered = event.registrations.some(
            reg => reg.user.toString() === user._id.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({ success: false, message: 'Already registered' });
        }

        event.registrations.push({ user: user._id });
        await event.save();

        res.json({ success: true, message: 'Registered successfully' });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/events/{id}/registrations:
 *   get:
 *     summary: Get event registrations
 *     description: Get list of registered users. Restricted to Admins.
 *     tags: [Events]
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
 *         description: List of registrations
 */
router.get('/:id/registrations', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('registrations.user', 'firstName lastName email profileImage');

        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        res.json({ success: true, registrations: event.registrations });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
