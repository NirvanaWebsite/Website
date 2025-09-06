require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkMiddleware, requireAuth } = require('@clerk/express');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Clerk authentication middleware (only if secret key exists)
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  console.warn('⚠️  CLERK_SECRET_KEY not found - authentication disabled');
  // Mock auth middleware for development
  app.use((req, res, next) => {
    req.auth = null;
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Nirvana Club Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      users: '/api/users',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Legacy protected route for testing
app.get('/api/protected', (req, res) => {
    if (req.auth) {
        res.json({ 
          message: 'You are accessing a protected route!', 
          userId: req.auth.userId,
          timestamp: new Date().toISOString()
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
} else {
  console.warn('⚠️  MONGODB_URI not found in environment variables');
}

app.listen(port, () => {
  console.log(`🚀 Nirvana Club Backend running on port: ${port}`);
  console.log(`🌐 API Base URL: http://localhost:${port}`);
  console.log(`📋 Health Check: http://localhost:${port}/api/health`);
});
