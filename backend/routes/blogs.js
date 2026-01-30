const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { requireAdmin, requireMember } = require('../middleware/auth');

// @route   GET /api/blogs
// @desc    Get all APPROVED blogs (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { sort = 'latest' } = req.query;

        let sortOption = { createdAt: -1 }; // Default: latest first

        if (sort === 'popular') {
            sortOption = { upvoteCount: -1, createdAt: -1 };
        }

        const blogs = await Blog.find({ status: 'APPROVED' })
            .populate('author', 'firstName lastName profileImage')
            .populate('upvotes', '_id')
            .sort(sortOption);

        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/blogs/my-blogs
// @desc    Get current user's blogs
// @access  Authenticated
router.get('/my-blogs', requireAuth(), async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });

        const blogs = await Blog.find({ author: user._id })
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/blogs/pending
// @desc    Get all pending blogs for review (admin only)
// @access  Admin
router.get('/pending', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'PENDING' })
            .populate('author', 'firstName lastName profileImage email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching pending blogs:', error);
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
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: blogs.length, blogs });
    } catch (error) {
        console.error('Error fetching blogs for admin:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID or Slug
// @access  Public (only if APPROVED) / Admin (any status)
router.get('/:id', async (req, res) => {
    try {
        const isId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        const query = isId ? { _id: req.params.id } : { slug: req.params.id };

        const blog = await Blog.findOne(query)
            .populate('author', 'firstName lastName profileImage')
            .populate('reviewedBy', 'firstName lastName')
            .populate('upvotes', '_id');

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Check if blog is approved or if user is admin
        if (blog.status !== 'APPROVED') {
            // Only allow access if user is authenticated and is admin or author
            if (!req.auth) {
                return res.status(403).json({ success: false, message: 'Blog is not published yet' });
            }

            const user = await User.findOne({ clerkId: req.auth.userId });
            const isAuthor = user && blog.author._id.equals(user._id);
            const isAdmin = user && ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'].includes(user.role);

            if (!isAuthor && !isAdmin) {
                return res.status(403).json({ success: false, message: 'Blog is not published yet' });
            }
        }

        res.json({ success: true, blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/blogs
// @desc    Create a new blog (any authenticated user can submit)
// @access  Authenticated
router.post('/', requireAuth(), async (req, res) => {
    try {
        const { title, content, summary, image, tags, isPublished } = req.body;

        const user = await User.findOne({ clerkId: req.auth.userId });

        // Check if user is admin - they can publish directly
        const isAdmin = ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'].includes(user.role);

        const blog = new Blog({
            title,
            content,
            summary,
            image,
            tags,
            author: user._id,
            status: isAdmin && isPublished ? 'APPROVED' : 'PENDING', // Admins can approve directly
            isPublished
        });

        await blog.save();

        res.status(201).json({
            success: true,
            blog,
            message: isAdmin ? 'Blog published successfully' : 'Blog submitted for review'
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   PUT /api/blogs/:id/approve
// @desc    Approve a pending blog
// @access  Admin
router.put('/:id/approve', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (blog.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Blog has already been reviewed'
            });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });

        blog.status = 'APPROVED';
        blog.reviewedBy = user._id;
        blog.reviewedAt = new Date();
        blog.isPublished = true;

        await blog.save();

        res.json({
            success: true,
            message: 'Blog approved successfully',
            blog
        });
    } catch (error) {
        console.error('Error approving blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   PUT /api/blogs/:id/reject
// @desc    Reject a pending blog
// @access  Admin
router.put('/:id/reject', requireAuth(), requireAdmin, async (req, res) => {
    try {
        const { reason } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (blog.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Blog has already been reviewed'
            });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });

        blog.status = 'REJECTED';
        blog.reviewedBy = user._id;
        blog.reviewedAt = new Date();
        blog.rejectionReason = reason || '';
        blog.isPublished = false;

        await blog.save();

        res.json({
            success: true,
            message: 'Blog rejected',
            blog
        });
    } catch (error) {
        console.error('Error rejecting blog:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/blogs/:id/upvote
// @desc    Toggle upvote on a blog
// @access  Authenticated
router.post('/:id/upvote', requireAuth(), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (blog.status !== 'APPROVED') {
            return res.status(403).json({
                success: false,
                message: 'Cannot upvote unpublished blog'
            });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });

        const upvoteIndex = blog.upvotes.indexOf(user._id);

        if (upvoteIndex > -1) {
            // Remove upvote
            blog.upvotes.splice(upvoteIndex, 1);
            blog.upvoteCount = blog.upvotes.length;
            await blog.save();

            res.json({
                success: true,
                message: 'Upvote removed',
                upvoted: false,
                upvoteCount: blog.upvoteCount
            });
        } else {
            // Add upvote
            blog.upvotes.push(user._id);
            blog.upvoteCount = blog.upvotes.length;
            await blog.save();

            res.json({
                success: true,
                message: 'Blog upvoted',
                upvoted: true,
                upvoteCount: blog.upvoteCount
            });
        }
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Admin or Author (if REJECTED)
router.put('/:id', requireAuth(), async (req, res) => {
    try {
        const { title, content, summary, image, tags, isPublished } = req.body;

        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });
        const isAdmin = ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'].includes(user.role);
        const isAuthor = blog.author.equals(user._id);

        // Only admin can edit any blog, or author can edit if REJECTED
        if (!isAdmin && (!isAuthor || blog.status !== 'REJECTED')) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit rejected blogs'
            });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.summary = summary || blog.summary;
        blog.image = image !== undefined ? image : blog.image;
        blog.tags = tags || blog.tags;

        // If author is editing a rejected blog, reset to PENDING
        if (isAuthor && blog.status === 'REJECTED') {
            blog.status = 'PENDING';
            blog.reviewedBy = null;
            blog.reviewedAt = null;
            blog.rejectionReason = '';
        }

        // Admin can change publish status
        if (isAdmin && isPublished !== undefined) {
            blog.isPublished = isPublished;
            if (isPublished && blog.status === 'PENDING') {
                blog.status = 'APPROVED';
                blog.reviewedBy = user._id;
                blog.reviewedAt = new Date();
            }
        }

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
