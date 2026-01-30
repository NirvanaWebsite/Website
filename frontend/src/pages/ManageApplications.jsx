import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ManageApplications = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await fetch(
                `http://localhost:5000/api/applications?status=${filter}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const data = await response.json();
            setApplications(data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appId) => {
        if (!confirm('Are you sure you want to approve this application?')) return;

        try {
            setActionLoading(appId);
            const token = await getToken();
            const response = await fetch(
                `http://localhost:5000/api/applications/${appId}/approve`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ adminNotes: '' })
                }
            );

            if (response.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error('Error approving application:', error);
            alert('Failed to approve application');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (appId) => {
        const adminNotes = prompt('Optional: Add feedback for the applicant');
        if (adminNotes === null) return; // User cancelled

        try {
            setActionLoading(appId);
            const token = await getToken();
            const response = await fetch(
                `http://localhost:5000/api/applications/${appId}/reject`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ adminNotes })
                }
            );

            if (response.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert('Failed to reject application');
        } finally {
            setActionLoading(null);
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'LEAD': 'bg-purple-100 text-purple-800',
            'CO_LEAD': 'bg-blue-100 text-blue-800',
            'DOMAIN_LEAD': 'bg-green-100 text-green-800',
            'MEMBER': 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-orange-600 hover:text-orange-700 mb-4 flex items-center"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📋 Manage Applications
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Review and manage team membership applications
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="flex space-x-2 p-4">
                        {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === status
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        <p className="mt-4 text-gray-600">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-xl text-gray-500">No {filter.toLowerCase()} applications</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        {app.userId?.profileImage && (
                                            <img
                                                src={app.userId.profileImage}
                                                alt={app.applicantName}
                                                className="w-16 h-16 rounded-full border-2 border-orange-200"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {app.applicantName}
                                            </h3>
                                            <p className="text-gray-600">{app.email}</p>
                                            <p className="text-sm text-gray-500">
                                                {app.branch} • {app.year}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(app.desiredRole)}`}>
                                            {app.desiredRole}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{app.domain}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>



                                {app.status === 'PENDING' && (
                                    <div className="flex space-x-4 pt-4 border-t">
                                        <button
                                            onClick={() => handleApprove(app._id)}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                        >
                                            {actionLoading === app._id ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                '✅ Approve'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(app._id)}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}

                                {app.status !== 'PENDING' && app.reviewedBy && (
                                    <div className="pt-4 border-t text-sm text-gray-600">
                                        Reviewed by {app.reviewedBy.firstName} {app.reviewedBy.lastName} on{' '}
                                        {new Date(app.reviewedAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageApplications;
