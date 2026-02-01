import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Calendar, ExternalLink, Download } from 'lucide-react';
import API_URL from '../config/api';

const ManageEvents = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegistrations, setShowRegistrations] = useState(null);
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setEvents(events.filter(e => e._id !== id));
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    };

    const fetchRegistrations = async (eventId) => {
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/events/${eventId}/registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setRegistrations(data.registrations);
                setShowRegistrations(eventId);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const exportToCSV = (eventTitle) => {
        if (registrations.length === 0) {
            alert('No registrations to export');
            return;
        }

        // Create CSV header
        const headers = ['Name', 'Email', 'Registration Date'];

        // Create CSV rows
        const rows = registrations.map(reg => [
            `${reg.user?.firstName || ''} ${reg.user?.lastName || ''}`.trim(),
            reg.user?.email || '',
            new Date(reg.registeredAt).toLocaleString()
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_registrations.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">📅 Manage Events</h1>
                    <button
                        onClick={() => navigate('/create-event')}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-pink-700 shadow-lg transition-all"
                    >
                        <Plus size={20} className="mr-2" /> Create Event
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description.substring(0, 80)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(event.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {event.rsvpRequired ? (
                                            event.registrationLink ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    External
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => fetchRegistrations(event._id)}
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Users size={14} className="mr-1" />
                                                    {event.registrations?.length || 0}
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-xs text-gray-400">Not Required</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => navigate(`/create-event?id=${event._id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit Event"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Event"
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

                {/* Registrations Modal */}
                {showRegistrations && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">Event Registrations</h2>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-96">
                                {registrations.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No registrations yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {registrations.map((reg, idx) => (
                                            <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                {reg.user?.profileImage && (
                                                    <img src={reg.user.profileImage} alt="" className="w-12 h-12 rounded-full mr-4" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {reg.user?.firstName} {reg.user?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{reg.user?.email}</div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Registered: {new Date(reg.registeredAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t border-gray-200">
                                <div className="flex gap-3">
                                    {registrations.length > 0 && (
                                        <button
                                            onClick={() => {
                                                const event = events.find(e => e._id === showRegistrations);
                                                exportToCSV(event?.title || 'event');
                                            }}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                        >
                                            <Download size={18} className="mr-2" />
                                            Export to CSV
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowRegistrations(null)}
                                        className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageEvents;
