import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Calendar, MapPin, ArrowLeft, ExternalLink, Users, Image as ImageIcon } from 'lucide-react';
import API_URL from '../config/api';

// Simple markdown parser for event descriptions
const parseMarkdown = (text) => {
    if (!text) return '';

    return text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
        // Line breaks
        .replace(/\n/g, '<br />');
};

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await fetch(`${API_URL}/api/events/${id}`);
            const data = await response.json();
            if (data.success) {
                setEvent(data.event);
                // Check if user is already registered
                if (isSignedIn) {
                    try {
                        const token = await getToken();
                        const userResponse = await fetch(`${API_URL}/api/users/profile`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const userData = await userResponse.json();
                        if (userData.success) {
                            const registered = data.event.registrations?.some(
                                reg => reg.user === userData.user._id
                            );
                            setIsRegistered(registered);
                        }
                    } catch (err) {
                        console.error('Error checking registration:', err);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!isSignedIn) {
            alert('Please sign in to register for this event.');
            return;
        }

        if (event.registrationLink) {
            // External registration
            window.open(event.registrationLink, '_blank');
            return;
        }

        // Internal RSVP
        setRegistering(true);
        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/events/${id}/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setIsRegistered(true);
                alert('Successfully registered for the event!');
            } else {
                alert(data.message || 'Failed to register');
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Error registering for event');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
                    <button onClick={() => navigate('/events')} className="text-orange-500 hover:text-orange-600">
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const isPastEvent = new Date(event.startDate) < new Date();

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Events
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Hero Image */}
                    {event.image && (
                        <div className="w-full bg-gray-100">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Title and Date */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-600">
                                <div className="flex items-center">
                                    <Calendar size={20} className="mr-2 text-orange-500" />
                                    <span className="font-medium">
                                        {new Date(event.startDate).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin size={20} className="mr-2 text-orange-500" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                            <div
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(event.description) }}
                            />
                        </div>

                        {/* Photos Link for Past Events */}
                        {isPastEvent && event.photosLink && (
                            <div className="mb-8 p-6 bg-pink-50 border border-pink-100 rounded-xl">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                    <ImageIcon size={20} className="mr-2 text-pink-600" />
                                    Event Photos
                                </h3>
                                <p className="text-gray-600 mb-4">Check out the highlights from this event!</p>
                                <a
                                    href={event.photosLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors"
                                >
                                    View Photos <ExternalLink size={16} className="ml-2" />
                                </a>
                            </div>
                        )}

                        {/* Registration Section */}
                        {!isPastEvent && event.rsvpRequired && (
                            <div className="border-t border-gray-100 pt-8">
                                {isRegistered ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                        <div className="text-green-600 text-lg font-bold mb-2">✓ You're Registered!</div>
                                        <p className="text-green-700">We look forward to seeing you at the event.</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Register for This Event</h3>
                                        <p className="text-gray-600 mb-6">
                                            {event.registrationLink
                                                ? 'Click below to complete your registration.'
                                                : 'Reserve your spot with a single click!'}
                                        </p>
                                        <button
                                            onClick={handleRegister}
                                            disabled={registering}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {registering ? (
                                                'Processing...'
                                            ) : event.registrationLink ? (
                                                <>
                                                    Register Now <ExternalLink size={20} className="ml-2" />
                                                </>
                                            ) : (
                                                <>
                                                    RSVP Now <Users size={20} className="ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {!isPastEvent && !event.rsvpRequired && (
                            <div className="border-t border-gray-100 pt-8 text-center">
                                <p className="text-gray-600">
                                    No registration required. Just show up and join us!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
