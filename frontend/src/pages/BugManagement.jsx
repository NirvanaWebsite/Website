import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import API_URL from '../config/api';

const BugManagement = () => {
    const { getToken } = useAuth();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ status: 'ALL', priority: 'ALL' });

    useEffect(() => {
        fetchBugs();
    }, []);

    const fetchBugs = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/bugs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 403) {
                setError('Access denied. You do not have permission to view this page.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setBugs(data.bugs || []);
        } catch (error) {
            console.error('Error fetching bugs:', error);
            setError('Failed to load bugs');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bugId, newStatus) => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/bugs/${bugId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchBugs(); // Refresh list
            }
        } catch (error) {
            console.error('Error updating bug:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (bugId) => {
        if (!window.confirm('Are you sure you want to delete this bug report? This action cannot be undone.')) return;

        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/bugs/${bugId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setBugs(bugs.filter(bug => bug._id !== bugId));
            } else {
                alert('Failed to delete bug');
            }
        } catch (error) {
            console.error('Error deleting bug:', error);
            alert('Error deleting bug');
        }
    };

    const filteredBugs = bugs.filter(bug => {
        const statusMatch = filters.status === 'ALL' || bug.status === filters.status;
        const priorityMatch = filters.priority === 'ALL' || bug.priority === filters.priority;
        return statusMatch && priorityMatch;
    });

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-green-100 text-green-800',
            MEDIUM: 'bg-yellow-100 text-yellow-800',
            HIGH: 'bg-orange-100 text-orange-800',
            CRITICAL: 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            OPEN: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-purple-100 text-purple-800',
            RESOLVED: 'bg-green-100 text-green-800',
            CLOSED: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">🛠️ Bug Management</h1>

                    <div className="flex gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="ALL">All Priority</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBugs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No bugs found matching current filters.
                                    </td>
                                </tr>
                            )}
                            {filteredBugs.map((bug) => (
                                <tr key={bug._id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{bug.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{bug.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {bug.reporter?.profileImage && (
                                                <img className="h-8 w-8 rounded-full mr-2" src={bug.reporter.profileImage} alt="" />
                                            )}
                                            <div className="text-sm text-gray-900">
                                                {bug.reporter ? `${bug.reporter.firstName} ${bug.reporter.lastName}` : 'Unknown'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(bug.priority)}`}>
                                            {bug.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {bug.screenshot ? (
                                            <a
                                                href={bug.screenshot}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                            >
                                                📷 View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bug.status)}`}>
                                            {bug.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-3">
                                            <select
                                                value={bug.status}
                                                onChange={(e) => handleUpdateStatus(bug._id, e.target.value)}
                                                className="block w-full pl-3 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                                            >
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="CLOSED">Closed</option>
                                            </select>

                                            <button
                                                onClick={() => handleDelete(bug._id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Bug Report"
                                            >
                                                🗑️
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
    );
};

export default BugManagement;
