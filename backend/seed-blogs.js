
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');
require('dotenv').config();

const seedBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find the admin user to be the author
        const author = await User.findOne({ role: 'admin' });
        if (!author) {
            console.log('No admin user found. Please run make-admin.js first.');
            return;
        }

        const testBlog = {
            title: "Welcome to Nirvana Club",
            content: "# Welcome to Nirvana Club\n\nWe are thrilled to launch our new platform. Here you will find the latest updates, events, and stories from our community.\n\n## What to expect\n\n- Weekly gatherings\n- Expert workshops\n- Community spotlights\n\nStay tuned for more!",
            summary: "An introduction to the new Nirvana Club platform and what you can expect from our community.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            author: author._id,
            tags: ["Community", "Launch", "News"],
            isPublished: true
        };

        const blog = new Blog(testBlog);
        await blog.save();

        console.log('Test blog created successfully!');
        console.log('Title:', blog.title);
        console.log('Slug:', blog.slug);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

seedBlogs();
