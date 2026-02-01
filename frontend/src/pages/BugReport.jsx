import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Type, AlignLeft, AlertCircle, Image, Send, X } from 'lucide-react';
import API_URL from '../config/api';

const BugReport = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        screenshot: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/bugs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({ title: '', description: '', priority: 'MEDIUM', screenshot: '' });
                setTimeout(() => setSuccess(false), 5000);
            } else {
                alert('Failed to report bug');
            }
        } catch (error) {
            console.error('Error reporting bug:', error);
            alert('Error reporting bug');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50 relative">
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>

                <div className="p-8 sm:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 rounded-full bg-orange-100/50 mb-4">
                            <span className="text-4xl">🐛</span>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            Report a Bug
                        </h2>
                        <p className="mt-3 text-gray-600 text-lg">
                            Found something off? Help us squash it! 🛠️
                        </p>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-8 flex items-center animate-fade-in">
                            <span className="mr-3 text-xl">✅</span>
                            <span className="font-medium">Bug reported successfully! Thank you for your feedback.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Issue Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                    <Type size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                                    placeholder="Brief summary of the issue"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Description</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                    <AlignLeft size={18} />
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                                    placeholder="Steps to reproduce, expected behavior, etc."
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Priority</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <AlertCircle size={18} />
                                    </div>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="LOW">🟢 Low - Minor cosmetic issue</option>
                                        <option value="MEDIUM">🟡 Medium - Feature glitch</option>
                                        <option value="HIGH">🟠 High - Core broken</option>
                                        <option value="CRITICAL">🔴 Critical - System crash</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Screenshot URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <Image size={18} />
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.screenshot}
                                        onChange={e => setFormData({ ...formData, screenshot: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                                        placeholder="https://imgur.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                <X size={20} />
                                <span>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <span>Submit Report</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BugReport;
