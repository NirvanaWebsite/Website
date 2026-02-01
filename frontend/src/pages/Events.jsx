import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, ArrowRight, Image } from 'lucide-react';
import API_URL from '../config/api';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/api/events`);
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

    const upcomingEvents = events.filter(event => new Date(event.startDate) >= new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const pastEvents = events.filter(event => new Date(event.startDate) < new Date()).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-600">
                            Club Events
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Join us for workshops, hackathons, and community gatherings.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'past'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Past Events
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                {displayedEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                        <p className="text-gray-500">Check back later for updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedEvents.map((event) => (
                            <div key={event._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Image Info */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {event.image ? (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
                                            <Calendar size={32} className="text-orange-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/50">
                                        {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={14} className="mr-2 text-orange-500" />
                                            {new Date(event.startDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin size={14} className="mr-2 text-orange-500" />
                                            {event.location}
                                        </div>
                                    </div>

                                    {activeTab === 'upcoming' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/events/${event._id}`)}
                                                className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors flex items-center justify-center group-hover:shadow-lg focus:ring-4 focus:ring-gray-200"
                                            >
                                                View Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            {event.photosLink && (
                                                <a
                                                    href={event.photosLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-3 bg-pink-50 text-pink-600 border border-pink-100 rounded-xl font-medium hover:bg-pink-100 transition-colors flex items-center justify-center"
                                                    title="View Photos"
                                                >
                                                    <Image size={18} />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/events/${event._id}`)}
                                                className="flex-1 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Details
                                            </button>
                                            {event.photosLink && (
                                                <a
                                                    href={event.photosLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2.5 rounded-xl font-medium hover:bg-pink-100 transition-colors flex items-center justify-center"
                                                >
                                                    <Image size={16} className="mr-2" /> Photos
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
