import { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const ApplicationForm = ({ onSuccess, onCancel }) => {
    const { getToken } = useAuth();
    const { user } = useUser();

    const [formData, setFormData] = useState({
        applicantName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        branch: '',
        year: 'UG1',
        desiredRole: 'CORE_MEMBER',
        domain: 'Leadership'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        🎯 Apply for Nirvana Club Membership
                    </h2>
                    <p className="text-gray-600">
                        Join our amazing team and contribute to the community!
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="font-medium">❌ {error}</p>
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                {/* Branch and Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch *
                        </label>
                        <input
                            type="text"
                            value={formData.branch}
                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            placeholder="e.g., CSE, ECE, EEE"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                        </label>
                        <select
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        >
                            <option value="UG1">UG1 (First Year)</option>
                            <option value="UG2">UG2 (Second Year)</option>
                            <option value="UG3">UG3 (Third Year)</option>
                            <option value="UG4">UG4 (Fourth Year)</option>
                        </select>
                    </div>
                </div>

                {/* Desired Role and Domain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Desired Role *
                        </label>
                        <select
                            value={formData.desiredRole}
                            onChange={(e) => setFormData({ ...formData, desiredRole: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        >
                            <option value="MEMBER">Core Member</option>
                            <option value="DOMAIN_LEAD">Domain Lead</option>
                            <option value="CO_LEAD">Co-Lead</option>
                            <option value="LEAD">Lead</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain *
                        </label>
                        <select
                            value={formData.domain}
                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                        >
                            <option value="Leadership">Leadership</option>
                            <option value="Research">Research</option>
                            <option value="Public-Relations">Public Relations</option>
                            <option value="Technical">Technical</option>
                            <option value="Management">Management</option>
                            <option value="Event & Outreach">Event & Outreach</option>
                            <option value="Design & Video">Design & Video</option>
                        </select>
                    </div>
                </div>



                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            '🚀 Submit Application'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
