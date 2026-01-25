/**
 * API Configuration
 * Centralized API endpoint configuration for the application
 */

// Get the API base URL from environment variable
// In development: http://localhost:5000
// In production: http://your-ec2-public-ip:5000 or https://api.yourdomain.com
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the full API endpoint URL
 * @param {string} endpoint - The API endpoint path (e.g., '/api/users/profile')
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
    // User endpoints
    USER_PROFILE: '/api/users/profile',
    USER_REFRESH: '/api/users/refresh',
    USER_ALL: '/api/users/all',

    // Blog endpoints
    BLOGS: '/api/blogs',
    BLOGS_MANAGE: '/api/blogs/manage',
    BLOG_BY_ID: (id) => `/api/blogs/${id}`,

    // Member endpoints
    MEMBERS: '/api/members',
    MEMBER_BY_ID: (id) => `/api/members/${id}`,

    // Health check
    HEALTH: '/api/health',
};

export default API_BASE_URL;
