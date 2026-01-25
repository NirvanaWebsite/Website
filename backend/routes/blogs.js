const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const Blog = require('../models/Blog');
const { requireAdmin } = require('../middleware/auth');

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = req.auth ? {} : { isPublished: true }; // Admin/Auth logic could be refined, for now public sees published
        // Actually, let's keep it simple: Public sees published. Admin sees all?
        // User request: "admin has the permission to manage".
        // Let's just return all published for now, or all if admin?
        // Let's return all, and frontend filters or backend filters based on auth.
        // For simplicity: Return all published.

        // Improvement: If query parameter ?all=true and user is admin, return all.

        let filter = { isPublished: true };
        // We can't easily check admin status in a public route without middleware, 
        // but we can make a separate route for admin or just check auth if present.
        // Let's just return all published blogs for public.

        const blogs = await Blog.find(filter)
            .populate('author', 'firstName lastName profileImage')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/blogs/manage
// @desc    Get all blogs (including unpublished) for admin
// @access  Admin
router.get('/manage', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('author', 'firstName lastName profileImage')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching blogs for admin:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID or Slug
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const isId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        const query = isId ? { _id: req.params.id } : { slug: req.params.id };

        const blog = await Blog.findOne(query).populate('author', 'firstName lastName profileImage');

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Admin
router.post('/', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const { title, content, summary, image, tags, isPublished } = req.body;

        const blog = new Blog({
            title,
            content,
            summary,
            image,
            tags,
            isPublished,
            author: req.user._id // req.user set by requireAdmin middleware
        });

        await blog.save();

        res.status(201).json({ success: true, blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Admin
router.put('/:id', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const { title, content, summary, image, tags, isPublished } = req.body;

        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.summary = summary || blog.summary;
        blog.image = image || blog.image;
        blog.tags = tags || blog.tags;
        if (isPublished !== undefined) blog.isPublished = isPublished;

        await blog.save();

        res.json({ success: true, blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Admin
router.delete('/:id', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        await blog.deleteOne();

        res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
