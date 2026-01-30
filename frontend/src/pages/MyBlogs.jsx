import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const MyBlogs = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [myBlogs, setMyBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        summary: '',
        image: '',
        tags: []
    });

    useEffect(() => {
        if (isLoaded && user) {
            fetchMyBlogs();
        }
    }, [isLoaded, user]);

    const fetchMyBlogs = async () => {
        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS_MY), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMyBlogs(data.blogs);
            }
        } catch (error) {
            console.error('Error fetching my blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, newTag]
                });
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            // Use local state tags directly, they are already an array
            const payload = {
                ...formData
            };

            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message || 'Blog submitted for review!');
                setShowForm(false);
                setFormData({ title: '', content: '', summary: '', image: '', tags: [] });
                setTagInput('');
                fetchMyBlogs();
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            alert('Failed to submit blog');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PENDING': { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
            'APPROVED': { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
            'REJECTED': { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' }
        };
        const badge = badges[status] || badges['PENDING'];
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
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
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
                    >
                        <Send size={20} />
                        {showForm ? 'Cancel' : 'Write New Blog'}
                    </button>
                </div>

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-8 shadow-lg mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Submit New Blog</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                    placeholder="Enter blog title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                                    placeholder="Brief summary for preview"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown) *</label>
                                <textarea
                                    required
                                    rows={12}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none font-mono text-sm"
                                    placeholder="# Write your blog content here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                            placeholder="Type tag and press Enter"
                                        />
                                        {formData.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.tags.map((tag, index) => (
                                                    <span key={index} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="hover:text-orange-900 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    Submit for Review
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {myBlogs.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                            <p className="text-gray-500 text-lg">You haven't submitted any blogs yet</p>
                            <p className="text-gray-400 mt-2">Click "Write New Blog" to get started!</p>
                        </div>
                    ) : (
                        myBlogs.map((blog) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
                                    {getStatusBadge(blog.status)}
                                </div>

                                <p className="text-gray-600 mb-4">{blog.summary}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Submitted: {new Date(blog.createdAt).toLocaleDateString()}</span>
                                    {blog.reviewedAt && (
                                        <span>Reviewed: {new Date(blog.reviewedAt).toLocaleDateString()}</span>
                                    )}
                                </div>

                                {blog.status === 'REJECTED' && blog.rejectionReason && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                                        <p className="text-sm text-red-700">{blog.rejectionReason}</p>
                                    </div>
                                )}

                                {blog.status === 'APPROVED' && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                                        <CheckCircle size={16} />
                                        <span>Published • {blog.upvoteCount} upvotes</span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBlogs;
