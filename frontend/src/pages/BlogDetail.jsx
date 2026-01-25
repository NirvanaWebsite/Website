import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(getApiUrl(API_ENDPOINTS.BLOG_BY_ID(id)));
                const data = await res.json();
                if (data.success) {
                    setBlog(data.blog);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
                <button
                    onClick={() => navigate('/blogs')}
                    className="text-primary hover:text-orange-700 font-medium flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft size={20} /> Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-gray-50 pt-24 pb-20">
            {/* Header / Hero */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/blogs')}
                    className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back to All Blogs
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Image */}
                    {blog.image && (
                        <div className="aspect-w-16 aspect-h-9 w-full h-[400px] relative">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight shadow-sm">
                                    {blog.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        {blog.author?.profileImage ? (
                                            <img src={blog.author.profileImage} alt="Author" className="w-8 h-8 rounded-full border-2 border-white/50" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                <User size={16} />
                                            </div>
                                        )}
                                        <span>{blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Nirvana Team'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} />
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!blog.image && (
                        <div className="p-8 pb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm md:text-base border-b border-gray-100 pb-8">
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span>{blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Nirvana Team'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {blog.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    <Tag size={12} /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-orange-700 prose-img:rounded-xl">
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
