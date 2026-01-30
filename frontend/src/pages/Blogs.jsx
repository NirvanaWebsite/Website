import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Clock, User, Settings, Heart } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const Blogs = () => {
    const { getToken, userId } = useAuth();
    const navigate = useNavigate();
    const { user } = useUser();
    const [blogs, setBlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Fetch blogs and user role
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();

                // Fetch User Role
                if (userId) {
                    const userRes = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userData = await userRes.json();
                    console.log('User Data Fetch:', userData); // DEBUG
                    if (userData.success) {
                        setCurrentUserId(userData.user.id || userData.user._id);
                        const adminRoles = ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'];
                        if (userData.user.isAdmin || adminRoles.includes(userData.user.role)) {
                            setIsAdmin(true);
                        }
                    }
                }

                // Fetch Blogs (Public)
                const blogsRes = await fetch(getApiUrl(API_ENDPOINTS.BLOGS));
                const blogsData = await blogsRes.json();
                if (blogsData.success) {
                    setBlogs(blogsData.blogs);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getToken, userId]);

    const handleUpvote = async (e, blogId) => {
        e.stopPropagation(); // Prevent navigation to blog detail

        if (!userId) {
            alert('Please sign in to upvote blogs');
            return;
        }

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOG_UPVOTE(blogId)), {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setBlogs(prevBlogs => prevBlogs.map(blog => {
                    if (blog._id === blogId) {
                        let newUpvotes;
                        if (data.upvoted) {
                            // Add upvote - store as object to match populated structure
                            newUpvotes = [...(blog.upvotes || []), { _id: currentUserId }];
                        } else {
                            // Remove upvote
                            newUpvotes = (blog.upvotes || []).filter(upvote => {
                                const upvoteId = typeof upvote === 'string' ? upvote : upvote._id;
                                return upvoteId !== currentUserId;
                            });
                        }

                        return {
                            ...blog,
                            upvotes: newUpvotes,
                            upvoteCount: data.upvoteCount
                        };
                    }
                    return blog;
                }));
            }
        } catch (error) {
            console.error('Error upvoting blog:', error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative bg-white pt-24 pb-16 shadow-sm overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white opacity-80"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto relative">


                        <span className="text-secondary font-semibold tracking-wider uppercase text-sm mb-2 block text-orange-600">Nirvana Club Blogs</span>
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Latest Blogs
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Discover the latest news, events, and community blogs from Nirvana Club.
                        </p>
                        {isAdmin && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => navigate('/manage-blogs')}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-gray-900/20 text-base font-medium"
                                >
                                    <Settings size={18} />
                                    Manage Blogs
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Typically, it's quite busy here...</h3>
                        <p className="text-gray-500">No blogs have been published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <article key={blog._id} className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full cursor-pointer relative" onClick={() => navigate(`/blogs/${blog._id}`)}>
                                <div className="relative overflow-hidden h-56">
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                            <span className="text-orange-300">
                                                <Clock size={48} />
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        {blog.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 px-3 py-1 rounded-full shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 p-6 flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {blog.summary}
                                    </p>

                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {blog.author && blog.author.profileImage ? (
                                                <img src={blog.author.profileImage} alt="Author" className="w-8 h-8 rounded-full border border-gray-200" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <User size={14} />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-700">
                                                {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Nirvana Team'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => handleUpvote(e, blog._id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${blog.upvotes?.some(upvote => {
                                                if (!upvote) return false;
                                                const upvoteId = upvote._id || upvote;
                                                return String(upvoteId) === String(currentUserId);
                                            })
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Heart
                                                size={16}
                                                fill={blog.upvotes?.some(upvote => {
                                                    if (!upvote) return false;
                                                    const upvoteId = upvote._id || upvote;
                                                    return String(upvoteId) === String(currentUserId);
                                                }) ? 'currentColor' : 'none'}
                                            />
                                            <span className="text-sm font-medium">{blog.upvoteCount || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
