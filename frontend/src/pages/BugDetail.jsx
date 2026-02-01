import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Calendar, User, AlertCircle, RefreshCw, Image } from 'lucide-react';
import API_URL from '../config/api';

const BugDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBugDetails();
    }, [id]);

    const fetchBugDetails = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/bugs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setBug(data.bug);
            } else {
                setError('Bug not found');
            }
        } catch (error) {
            console.error('Error fetching bug:', error);
            setError('Failed to load bug details');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-green-100 text-green-800 border-green-200',
            MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
            CRITICAL: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusColor = (status) => {
        const colors = {
            OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
            IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
            RESOLVED: 'bg-green-100 text-green-800 border-green-200',
            CLOSED: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    if (error || !bug) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
            <AlertCircle size={48} className="mb-4 text-red-400" />
            <p className="text-xl font-medium mb-4">{error || 'Bug not found'}</p>
            <button
                onClick={() => navigate('/manage-bugs')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
                Back to Bugs
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/manage-bugs')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{bug.title}</h1>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        Reported on {new Date(bug.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <User size={14} className="mr-1" />
                                        by {bug.reporter ? `${bug.reporter.firstName} ${bug.reporter.lastName}` : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getPriorityColor(bug.priority)}`}>
                                    {bug.priority}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(bug.status)}`}>
                                    {bug.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                            <div className="prose max-w-none text-gray-800 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                {bug.description}
                            </div>
                        </div>

                        {bug.screenshot && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                                    <Image size={16} className="mr-2" /> Screenshot
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={bug.screenshot}
                                        alt="Bug Screenshot"
                                        className="w-full h-auto max-h-[600px] object-contain bg-gray-900"
                                    />
                                </div>
                                <a
                                    href={bug.screenshot}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Open original image ↗
                                </a>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Reporter Details</h4>
                                <div className="flex items-center">
                                    {bug.reporter?.profileImage ? (
                                        <img src={bug.reporter.profileImage} alt="" className="w-10 h-10 rounded-full mr-3" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {bug.reporter ? `${bug.reporter.firstName} ${bug.reporter.lastName}` : 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500">{bug.reporter?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">System Info</h4>
                                <p className="text-sm text-gray-600">ID: <span className="font-mono text-xs">{bug._id}</span></p>
                                <p className="text-sm text-gray-600">Last Updated: {new Date(bug.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BugDetail;
