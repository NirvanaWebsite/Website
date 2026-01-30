import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag, Heart } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken, userId } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // Fetch user ID if logged in
                if (userId) {
                    const token = await getToken();
                    const userRes = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userData = await userRes.json();
                    if (userData.success) {
                        setCurrentUserId(userData.user.id || userData.user._id);
                    }
                }

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
    }, [id, userId, getToken]);

    const handleUpvote = async () => {
        if (!userId) {
            alert('Please sign in to upvote this blog');
            return;
        }

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.BLOG_UPVOTE(blog._id)), {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
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

                setBlog({
                    ...blog,
                    upvotes: newUpvotes,
                    upvoteCount: data.upvoteCount
                });
            }
        } catch (error) {
            console.error('Error upvoting blog:', error);
        }
    };

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

                        {/* Upvote Button */}
                        <div className="mb-8 flex justify-center">
                            <button
                                onClick={handleUpvote}
                                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg ${blog.upvotes?.some(upvote => {
                                    if (!upvote) return false;
                                    const upvoteId = upvote._id || upvote;
                                    return String(upvoteId) === String(currentUserId);
                                })
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                                    }`}
                            >
                                <Heart
                                    size={24}
                                    fill={blog.upvotes?.some(upvote => {
                                        if (!upvote) return false;
                                        const upvoteId = upvote._id || upvote;
                                        return String(upvoteId) === String(currentUserId);
                                    }) ? 'currentColor' : 'none'}
                                />
                                <span className="font-semibold text-lg">
                                    {blog.upvoteCount || 0} {blog.upvoteCount === 1 ? 'Upvote' : 'Upvotes'}
                                </span>
                            </button>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Code blocks with syntax highlighting
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="my-6 rounded-xl overflow-hidden shadow-lg">
                                                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                                    <span className="text-gray-300 text-sm font-mono">{match[1]}</span>
                                                    <span className="text-gray-500 text-xs">CODE</span>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        borderRadius: 0,
                                                        fontSize: '0.95rem',
                                                        padding: '1.5rem'
                                                    }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-sm font-mono border border-orange-100" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    // Enhanced headings
                                    h1: ({ children }) => (
                                        <h1 className="text-4xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b-4 border-orange-500">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-5 pb-2 border-b-2 border-gray-200">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children }) => (
                                        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                                            {children}
                                        </h4>
                                    ),
                                    // Beautiful blockquotes
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-orange-500 bg-orange-50 pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <span className="text-orange-500 text-4xl leading-none">"</span>
                                                <div className="flex-1">{children}</div>
                                            </div>
                                        </blockquote>
                                    ),
                                    // Styled paragraphs
                                    p: ({ children }) => (
                                        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                            {children}
                                        </p>
                                    ),
                                    // Enhanced lists
                                    ul: ({ children }) => (
                                        <ul className="space-y-3 my-6 ml-6">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="space-y-3 my-6 ml-6 list-decimal">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-gray-700 text-lg leading-relaxed pl-2">
                                            <span className="inline-flex items-start gap-3">
                                                <span className="text-orange-500 mt-1.5">•</span>
                                                <span className="flex-1">{children}</span>
                                            </span>
                                        </li>
                                    ),
                                    // Styled links
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-2 font-medium transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    // Enhanced images
                                    img: ({ src, alt }) => (
                                        <div className="my-8">
                                            <img
                                                src={src}
                                                alt={alt}
                                                className="rounded-2xl shadow-xl w-full object-cover"
                                            />
                                            {alt && (
                                                <p className="text-center text-gray-500 text-sm mt-3 italic">
                                                    {alt}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                    // Horizontal rules
                                    hr: () => (
                                        <hr className="my-12 border-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                    ),
                                    // Tables
                                    table: ({ children }) => (
                                        <div className="my-8 overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-gray-50">
                                            {children}
                                        </thead>
                                    ),
                                    th: ({ children }) => (
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="px-6 py-4 text-gray-700 text-base">
                                            {children}
                                        </td>
                                    ),
                                    // Strong/Bold text
                                    strong: ({ children }) => (
                                        <strong className="font-bold text-gray-900">
                                            {children}
                                        </strong>
                                    ),
                                    // Emphasis/Italic
                                    em: ({ children }) => (
                                        <em className="italic text-gray-800">
                                            {children}
                                        </em>
                                    ),
                                }}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
