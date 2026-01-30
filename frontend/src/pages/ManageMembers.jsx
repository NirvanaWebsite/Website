import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, ArrowLeft, ClipboardList } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import MemberForm from '../components/MemberForm';

const ManageMembers = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        academicYear: 'all',
        role: 'all',
        domain: 'all',
        status: 'all'
    });
    const [academicYears, setAcademicYears] = useState([]);

    useEffect(() => {
        fetchMembers();
        fetchAcademicYears();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [members, searchTerm, filters]);

    const fetchMembers = async () => {
        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.MEMBERS));
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const response = await fetch(getApiUrl('/api/members/academic-years'));
            const data = await response.json();
            if (data.success) {
                setAcademicYears(data.academicYears);
            }
        } catch (error) {
            console.error('Error fetching academic years:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...members];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.domain.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Academic year filter
        if (filters.academicYear !== 'all') {
            filtered = filtered.filter(m => m.academicYear === filters.academicYear);
        }

        // Role filter
        if (filters.role !== 'all') {
            filtered = filtered.filter(m => m.role === filters.role);
        }

        // Domain filter
        if (filters.domain !== 'all') {
            filtered = filtered.filter(m => m.domain === filters.domain);
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(m => m.status === filters.status);
        }

        setFilteredMembers(filtered);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This will also update their user account.`)) {
            return;
        }

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(`${API_ENDPOINTS.MEMBERS}/${id}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                alert('Member deleted successfully');
                fetchMembers();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Failed to delete member');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingMember(null);
        fetchMembers();
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'LEAD': 'bg-purple-100 text-purple-800 border-purple-200',
            'CO_LEAD': 'bg-blue-100 text-blue-800 border-blue-200',
            'DOMAIN_LEAD': 'bg-orange-100 text-orange-800 border-orange-200',
            'MEMBER': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[role] || colors.MEMBER;
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'ACTIVE': 'bg-green-100 text-green-800',
            'INACTIVE': 'bg-yellow-100 text-yellow-800',
            'ALUMNI': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || colors.ACTIVE;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-600 hover:text-orange-600 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Member Management</h1>
                            <p className="text-gray-600 mt-2">Manage team members across all academic years</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/manage-applications')}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <ClipboardList size={20} />
                                <span className="hidden sm:inline">Manage Applications</span>
                            </button>
                            <button
                                onClick={() => { setEditingMember(null); setShowForm(true); }}
                                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                <Plus size={20} />
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, domain..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Academic Year */}
                        <select
                            value={filters.academicYear}
                            onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">All Years</option>
                            {academicYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        {/* Role */}
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="LEAD">Lead</option>
                            <option value="CO_LEAD">Co-Lead</option>
                            <option value="DOMAIN_LEAD">Domain Lead</option>
                            <option value="MEMBER">Member</option>
                        </select>

                        {/* Status */}
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="ALUMNI">Alumni</option>
                        </select>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Academic Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No members found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => (
                                        <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={member.image || 'https://via.placeholder.com/40'}
                                                        alt={member.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                        <div className="text-sm text-gray-500">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{member.academicYear}</span>
                                                <span className="text-xs text-gray-500 ml-2">({member.year})</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {member.domain}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(member.status)}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingMember(member); setShowForm(true); }}
                                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(member._id, member.name)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600 text-center">
                    Showing {filteredMembers.length} of {members.length} members
                </div>
            </div>

            {/* Member Form Modal */}
            {showForm && (
                <MemberForm
                    member={editingMember}
                    onClose={() => { setShowForm(false); setEditingMember(null); }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default ManageMembers;
