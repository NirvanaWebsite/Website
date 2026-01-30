import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Eye, User } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const ReviewBlogs = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [pendingBlogs, setPendingBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (isLoaded && user) {
            fetchPendingBlogs();
        }
    }, [isLoaded, user]);

    const fetchPendingBlogs = async () => {
        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS_PENDING), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setPendingBlogs(data.blogs);
            }
        } catch (error) {
            console.error('Error fetching pending blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (blogId) => {
        if (!confirm('Are you sure you want to approve this blog?')) return;

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOG_APPROVE(blogId)), {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                alert('Blog approved successfully!');
                fetchPendingBlogs();
                setSelectedBlog(null);
            }
        } catch (error) {
            console.error('Error approving blog:', error);
            alert('Failed to approve blog');
        }
    };

    const handleReject = async (blogId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOG_REJECT(blogId)), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: rejectionReason })
            });

            const data = await response.json();
            if (data.success) {
                alert('Blog rejected');
                fetchPendingBlogs();
                setSelectedBlog(null);
                setRejectionReason('');
            }
        } catch (error) {
            console.error('Error rejecting blog:', error);
            alert('Failed to reject blog');
        }
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Review Blogs</h1>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {pendingBlogs.length} Pending
                    </span>
                </div>

                {pendingBlogs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <p className="text-gray-500 text-lg">No pending blogs to review</p>
                        <p className="text-gray-400 mt-2">All caught up! 🎉</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Blog List */}
                        <div className="space-y-4">
                            {pendingBlogs.map((blog) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => setSelectedBlog(blog)}
                                    className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${selectedBlog?._id === blog._id ? 'border-orange-500' : 'border-transparent'
                                        }`}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.summary}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>{blog.author?.firstName} {blog.author?.lastName}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Preview Panel */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            {selectedBlog ? (
                                <div className="bg-white rounded-2xl p-8 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Review Blog</h2>
                                        <button
                                            onClick={() => setSelectedBlog(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{selectedBlog.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                By {selectedBlog.author?.firstName} {selectedBlog.author?.lastName} • {selectedBlog.author?.email}
                                            </p>
                                        </div>

                                        {selectedBlog.image && (
                                            <img
                                                src={selectedBlog.image}
                                                alt={selectedBlog.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                                            <p className="text-gray-600">{selectedBlog.summary}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Content Preview</h4>
                                            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                                                    {selectedBlog.content.substring(0, 500)}
                                                    {selectedBlog.content.length > 500 && '...'}
                                                </pre>
                                            </div>
                                        </div>

                                        {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedBlog.tags.map((tag, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rejection Reason Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rejection Reason (optional for approval, required for rejection)
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                                            placeholder="Provide feedback to the author..."
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(selectedBlog._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                                        >
                                            <CheckCircle size={20} />
                                            Approve & Publish
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedBlog._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                                        >
                                            <XCircle size={20} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                    <Eye size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Select a blog to review</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewBlogs;
