
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

const checkBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const blogs = await Blog.find({});
        console.log(`Found ${blogs.length} blogs.`);

        if (blogs.length > 0) {
            blogs.forEach(b => {
                console.log(`- ${b.title} (Slug: ${b.slug}, Published: ${b.isPublished})`);
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkBlogs();
