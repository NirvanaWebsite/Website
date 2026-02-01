import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, Link as LinkIcon, FileText } from 'lucide-react';
import API_URL from '../config/api';

const CreateEvent = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        image: '',
        rsvpRequired: true,
        registrationLink: '',
        photosLink: ''
    });
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (eventId) {
            setIsEdit(true);
            fetchEvent();
        }
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`);
            const data = await response.json();
            if (data.success) {
                const event = data.event;
                setFormData({
                    title: event.title,
                    description: event.description,
                    startDate: new Date(event.startDate).toISOString().slice(0, 16),
                    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
                    location: event.location,
                    image: event.image || '',
                    rsvpRequired: event.rsvpRequired,
                    registrationLink: event.registrationLink || '',
                    photosLink: event.photosLink || ''
                });
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();
            const url = isEdit ? `${API_URL}/api/events/${eventId}` : `${API_URL}/api/events`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
                navigate('/manage-events');
            } else {
                alert(data.message || 'Failed to save event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/manage-events')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Manage Events
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        {isEdit ? '✏️ Edit Event' : '➕ Create New Event'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText size={16} className="inline mr-2" />
                                Event Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Annual Tech Summit 2024"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Markdown Supported) *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                                placeholder="## About the Event&#10;&#10;Join us for an exciting day of...&#10;&#10;### What to Expect&#10;- Keynote speakers&#10;- Hands-on workshops&#10;- Networking opportunities"
                            />
                            <p className="text-xs text-gray-500 mt-1">You can use Markdown formatting (headings, lists, bold, etc.)</p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Start Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin size={16} className="inline mr-2" />
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Main Auditorium, IIIT Sri City"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <ImageIcon size={16} className="inline mr-2" />
                                Event Image URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://example.com/event-banner.jpg"
                            />
                        </div>

                        {/* RSVP Required */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rsvpRequired"
                                checked={formData.rsvpRequired}
                                onChange={handleChange}
                                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label className="ml-3 text-sm font-medium text-gray-700">
                                RSVP Required (Users must register to attend)
                            </label>
                        </div>

                        {/* Registration Link */}
                        {formData.rsvpRequired && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <LinkIcon size={16} className="inline mr-2" />
                                    External Registration Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="registrationLink"
                                    value={formData.registrationLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://forms.google.com/... (Leave empty for internal RSVP)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    If provided, users will be redirected to this link instead of using internal RSVP
                                </p>
                            </div>
                        )}

                        {/* Photos Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <ImageIcon size={16} className="inline mr-2" />
                                Google Drive Photos Link (For Past Events)
                            </label>
                            <input
                                type="url"
                                name="photosLink"
                                value={formData.photosLink}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://drive.google.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Add this after the event to share photos with attendees
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/manage-events')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
