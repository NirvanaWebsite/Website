import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search, Save, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const ManageBlogs = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '', // Markdown
        summary: '',
        image: '',
        tags: '',
        isPublished: true
    });

    useEffect(() => {
        const checkAdmin = async () => {
            if (!isLoaded || !user) {
                if (isLoaded && !user) {
                    navigate('/blogs');
                }
                return;
            }

            try {
                const token = await getToken();
                const userRes = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();

                // Check if user is admin (SUPER_ADMIN, LEAD, or CO_LEAD) or has isAdmin flag
                const adminRoles = ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'];
                if (userData.success && (userData.user.isAdmin || adminRoles.includes(userData.user.role))) {
                    setIsAdmin(true);
                } else {
                    console.warn('Access denied. Role:', userData.user?.role, 'isAdmin:', userData.user?.isAdmin);
                    navigate('/blogs');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                navigate('/blogs');
            } finally {
                setIsCheckingAdmin(false);
            }
        };

        checkAdmin();
    }, [isLoaded, user, getToken, navigate]);

    const fetchBlogs = async () => {
        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS_MANAGE), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchBlogs();
        }
    }, [isAdmin]);

    if (!isLoaded || isCheckingAdmin) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openModal = (blog = null) => {
        if (blog) {
            setCurrentBlog(blog);
            setFormData({
                title: blog.title,
                content: blog.content,
                summary: blog.summary,
                image: blog.image || '',
                tags: blog.tags.join(', '),
                isPublished: blog.isPublished
            });
        } else {
            setCurrentBlog(null);
            setFormData({
                title: '',
                content: '',
                summary: '',
                image: '',
                tags: '',
                isPublished: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (currentBlog) {
                // Update
                await fetch(getApiUrl(API_ENDPOINTS.BLOG_BY_ID(currentBlog._id)), {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                await fetch(getApiUrl(API_ENDPOINTS.BLOGS), {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });
            }

            fetchBlogs();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Failed to save blog');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const token = await getToken();
            await fetch(getApiUrl(API_ENDPOINTS.BLOG_BY_ID(id)), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this blog for publication?')) return;

        try {
            const token = await getToken();
            await fetch(getApiUrl(API_ENDPOINTS.BLOG_APPROVE(id)), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Blog approved successfully!');
            fetchBlogs();
        } catch (error) {
            console.error('Error approving blog:', error);
            alert('Failed to approve blog');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason === null) return; // User cancelled

        try {
            const token = await getToken();
            await fetch(getApiUrl(API_ENDPOINTS.BLOG_REJECT(id)), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });
            alert('Blog rejected');
            fetchBlogs();
        } catch (error) {
            console.error('Error rejecting blog:', error);
            alert('Failed to reject blog');
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isLoaded || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/blogs')} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20 font-medium"
                    >
                        <Plus size={20} />
                        Create New Blog
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search blogs by title or summary..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={blog.title}>{blog.title}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{blog.summary}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.status === 'PENDING' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock size={12} /> Pending Review
                                                </span>
                                            )}
                                            {blog.status === 'APPROVED' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle size={12} /> Approved
                                                </span>
                                            )}
                                            {blog.status === 'REJECTED' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle size={12} /> Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {blog.author?.firstName} {blog.author?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {blog.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(blog._id)}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(blog._id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => openModal(blog)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {currentBlog ? 'Edit Blog' : 'Create New Blog'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter blog title"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Image URL <span className="text-gray-400 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                            <input
                                                name="tags"
                                                value={formData.tags}
                                                onChange={handleInputChange}
                                                placeholder="News, Event, Tech"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                                            <textarea
                                                name="summary"
                                                value={formData.summary}
                                                onChange={handleInputChange}
                                                required
                                                rows={2}
                                                placeholder="Brief summary used for the preview card"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                                            <textarea
                                                name="content"
                                                value={formData.content}
                                                onChange={handleInputChange}
                                                required
                                                rows={12}
                                                placeholder="# Write your blog content here..."
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none font-mono text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="isPublished"
                                                    checked={formData.isPublished}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                                                />
                                                <span className="text-gray-700 font-medium">Publish immediately</span>
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                                If unchecked, the blog will be saved as a draft and visible only to admins.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="blogForm"
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {currentBlog ? 'Update Blog' : 'Create Blog'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBlogs;
