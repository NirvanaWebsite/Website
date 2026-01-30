import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const MemberForm = ({ member, onClose, onSuccess }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        academicYear: '2025-26',
        year: 'UG1',
        role: 'MEMBER',
        domain: 'Technical',
        branch: '',
        linkedin: '',
        image: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                email: member.email || '',
                phone: member.phone || '',
                academicYear: member.academicYear || '2025-26',
                year: member.year || 'UG1',
                role: member.role || 'MEMBER',
                domain: member.domain || 'Technical',
                branch: member.branch || '',
                linkedin: member.linkedin || '',
                image: member.image || '',
                status: member.status || 'ACTIVE'
            });
        }
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Prevent direct addition of ACTIVE members for current academic year
        const currentAcademicYear = '2025-26'; // You can make this dynamic if needed

        if (!member && formData.status === 'ACTIVE' && formData.academicYear === currentAcademicYear) {
            alert(
                '⚠️ Cannot Add Active Member Directly\n\n' +
                'For ACTIVE members in the current academic year, please follow the proper application process:\n\n' +
                '1. The user must create an account on the website\n' +
                '2. They should submit a membership application from their profile\n' +
                '3. Lead or Co-Lead will review and approve the application\n\n' +
                'You can only add members directly for:\n' +
                '• Previous academic years (alumni/historical records)\n' +
                '• Members with INACTIVE or ALUMNI status'
            );
            return;
        }

        setLoading(true);

        try {
            const token = await getToken();
            const url = member
                ? getApiUrl(`${API_ENDPOINTS.MEMBERS}/${member._id}`)
                : getApiUrl(API_ENDPOINTS.MEMBERS);

            const method = member ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert(member ? 'Member updated successfully!' : 'Member created successfully!');
                onSuccess();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Failed to save member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {member ? 'Edit Member' : 'Add New Member'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="john@iiits.in"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="+91 1234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="CSE, ECE, etc."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Academic Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    required
                                    pattern="\d{4}-\d{2}"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="2025-26"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: YYYY-YY (e.g., 2025-26)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UG Year <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="UG1">UG1</option>
                                    <option value="UG2">UG2</option>
                                    <option value="UG3">UG3</option>
                                    <option value="UG4">UG4</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Team Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="LEAD">Lead</option>
                                    <option value="CO_LEAD">Co-Lead</option>
                                    <option value="DOMAIN_LEAD">Domain Lead</option>
                                    <option value="MEMBER">Member</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Domain <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="Leadership">Leadership</option>
                                    <option value="Research">Research</option>
                                    <option value="Public-Relations">Public-Relations</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Management">Management</option>
                                    <option value="Event & Outreach">Event & Outreach</option>
                                    <option value="Design & Video">Design & Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="ALUMNI">Alumni</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social & Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                        {formData.image && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (member ? 'Update Member' : 'Create Member')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberForm;
