import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search, Save, ArrowLeft, User, Linkedin, LayoutGrid, ChevronDown, ChevronRight } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const ManageMembers = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        domain: '',
        year: '',
        image: '',
        linkedin: ''
    });

    // --- Admin Check ---
    useEffect(() => {
        const checkAdmin = async () => {
            if (!isLoaded || !user) {
                if (isLoaded && !user) navigate('/members');
                return;
            }
            try {
                const token = await getToken();
                const userRes = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();
                if (userData.success && userData.user.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    navigate('/members');
                }
            } catch (error) {
                console.error('Error checking admin:', error);
                navigate('/members');
            } finally {
                setIsCheckingAdmin(false);
            }
        };
        checkAdmin();
    }, [isLoaded, user, navigate]);

    // --- Fetch Members ---
    const fetchMembers = async () => {
        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.MEMBERS));
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchMembers();
    }, [isAdmin]);

    // --- Create/Update/Delete ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
            const payload = { ...formData, domain: formData.domain || 'Other' };

            let response;
            if (currentMember) {
                response = await fetch(getApiUrl(API_ENDPOINTS.MEMBER_BY_ID(currentMember._id)), {
                    method: 'PUT', headers, body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(getApiUrl(API_ENDPOINTS.MEMBERS), {
                    method: 'POST', headers, body: JSON.stringify(payload)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            fetchMembers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving member:', error);
            alert(`Failed to save member: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(API_ENDPOINTS.MEMBER_BY_ID(id)), {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
            alert(`Failed to delete member: ${error.message}`);
        }
    };

    const openModal = (member = null) => {
        if (member) {
            setCurrentMember(member);
            setFormData({
                name: member.name, role: member.role, domain: member.domain || '',
                year: member.year, image: member.image || '', linkedin: member.linkedin || ''
            });
        } else {
            setCurrentMember(null);
            setFormData({
                name: '', role: '', domain: '', year: '2025-26', image: '', linkedin: ''
            });
        }
        setIsModalOpen(true);
    };

    // --- Helpers ---
    const uniqueDomains = useMemo(() => {
        return [...new Set(members.map(m => m.domain || 'Other').filter(Boolean))].sort();
    }, [members]);

    // --- Hierarchical Grouping Logic (Matching YearSection.jsx) ---
    const hierarchicalData = useMemo(() => {
        const filtered = members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.year.includes(searchTerm)
        );

        // 1. Group by Year
        const years = {};
        filtered.forEach(m => {
            if (!years[m.year]) years[m.year] = [];
            years[m.year].push(m);
        });

        const sortedYears = Object.keys(years).sort().reverse().map(year => {
            const yearMembers = years[year];

            // Separate Club Leadership from Domains
            const clubLeadership = [];
            const domainMap = {};

            yearMembers.forEach(member => {
                const role = member.role.toLowerCase();
                const domainName = member.domain || 'Other';

                if (domainName === 'Club Leadership' || role.includes('president') || role.includes('vice president') || role === 'club lead' || role === 'club co-lead') {
                    clubLeadership.push(member);
                } else {
                    if (!domainMap[domainName]) {
                        domainMap[domainName] = [];
                    }
                    domainMap[domainName].push(member);
                }
            });

            // Sort Club Leadership
            clubLeadership.sort((a, b) => {
                const getPriority = (role) => {
                    const r = role.toLowerCase();
                    if (r.includes('president') || (r.includes('lead') && !r.includes('co-lead'))) return 3;
                    if (r.includes('vice') || r.includes('co-lead')) return 2;
                    return 1;
                };
                return getPriority(b.role) - getPriority(a.role);
            });

            // Sort Domains
            const sortedDomains = Object.entries(domainMap).sort((a, b) => a[0].localeCompare(b[0])).map(([name, members]) => {
                // Internal grouping for domains (Lead > Core > General)
                const { leads, core, general } = members.reduce((acc, member) => {
                    const r = member.role.toLowerCase();
                    if (r.includes('advisor')) acc.leads.push(member);
                    else if (r.includes('lead') || r.includes('head')) acc.leads.push(member);
                    else if (r.includes('core')) acc.core.push(member);
                    else acc.general.push(member);
                    return acc;
                }, { leads: [], core: [], general: [] });
                return { name, leads, core, general };
            });

            return { year, clubLeadership, domains: sortedDomains };
        });

        return sortedYears;
    }, [members, searchTerm]);


    if (!isLoaded || isCheckingAdmin || isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>;
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/members')} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-orange-600">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
                            <p className="text-gray-500 text-sm mt-1">Organize hierarchy: Year &gt; Domain &gt; Role</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-gray-900/10 font-medium"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Member</span>
                        </button>
                    </div>
                </div>

                {/* Hierarchical Content (Matching Style) */}
                <div className="space-y-32">
                    {hierarchicalData.length > 0 ? (
                        hierarchicalData.map(({ year, clubLeadership, domains }) => (
                            <div key={year} className="relative">
                                {/* Year Header Style */}
                                <div className="flex items-center justify-center mb-16 px-4">
                                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-xs opacity-50"></div>
                                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-orange-400 mx-4 md:mx-8 tracking-tighter drop-shadow-sm text-center">
                                        {year}
                                    </h2>
                                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-xs opacity-50"></div>
                                </div>

                                {/* Club Leadership */}
                                {clubLeadership.length > 0 && (
                                    <div className="mb-20">
                                        <div className="flex justify-center mb-10">
                                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30">Club Leadership</span>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto px-4">
                                            {clubLeadership.map((member) => (
                                                <div key={member._id} className="w-full md:w-96 transform hover:-translate-y-2 transition-transform duration-500">
                                                    <GlowCard
                                                        member={member}
                                                        onEdit={() => openModal(member)}
                                                        onDelete={() => handleDelete(member._id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Domains Grid */}
                                <div className="flex flex-col gap-8 px-4 max-w-7xl mx-auto">
                                    {domains.map(({ name, leads, core, general }) => (
                                        <DomainCard
                                            key={name}
                                            title={name}
                                            leads={leads}
                                            core={core}
                                            general={general}
                                            onEdit={openModal}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                            <p className="text-gray-500">No members found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Same as before */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentMember ? 'Edit Member' : 'Add New Member'}
            >
                <form id="memberForm" onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                <input
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Lead"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                                <input
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. 2025-26"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Domain</label>
                            <div className="relative">
                                <input
                                    list="domains"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleInputChange}
                                    placeholder="Select or type new domain..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                />
                                <datalist id="domains">
                                    {uniqueDomains.map(d => <option key={d} value={d} />)}
                                </datalist>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <LayoutGrid size={16} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image URL</label>
                            <input
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
                            <div className="relative">
                                <input
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                />
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">Cancel</button>
                    <button type="submit" form="memberForm" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-gray-900/10">
                        <Save size={18} />
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    );
};

// --- Updated Sub-Components (GlowCard + Admin Controls) ---

const GlowCard = ({ member, onEdit, onDelete }) => (
    <div className="relative group perspective-1000 w-full">
        {/* Soft Orange Glow Behind Card */}
        <div className="absolute -inset-1 bg-gradient-to-br from-orange-300 via-orange-100 to-transparent rounded-2xl opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>

        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50 h-full p-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]">

            {/* Admin Controls Overlay */}
            <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold shadow-sm border border-orange-100 transition-colors">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold shadow-sm border border-red-100 transition-colors">Delete</button>
            </div>

            <div className="flex items-center p-4">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mr-5 overflow-hidden border-4 border-white shadow-lg shadow-orange-100">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={28} className="text-orange-300" />
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0 pr-16 bg-gradient-to-r from-transparent via-transparent to-transparent">
                    <h4 className="font-bold text-gray-900 text-lg truncate leading-tight">{member.name}</h4>
                    <p className="text-sm font-bold text-orange-500 mb-0.5 truncate">{member.role}</p>
                    <p className="text-xs text-gray-400 font-medium truncate tracking-wide">{member.domain || 'Club Member'}</p>
                </div>
            </div>
        </div>
    </div>
);


const DomainCard = ({ title, leads, core, general, onEdit, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="relative"
    >
        {/* Section Header with Left Gradient Bar */}
        <div className="flex items-center gap-4 mb-8">
            <div className="h-8 w-1.5 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full"></div>
            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
                {title}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-100 to-transparent"></div>
        </div>

        <div className="relative">
            {/* Glowing Aura */}
            <div className="absolute -inset-2 bg-gradient-to-br from-orange-400/20 via-orange-200/10 to-transparent rounded-[3rem] blur-2xl opacity-70 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-transparent rounded-[2.5rem] blur-xl opacity-50 pointer-events-none"></div>

            <div className="relative bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-2xl shadow-orange-500/10 transition-shadow duration-500 hover:shadow-orange-500/20">
                <div className="space-y-12">
                    {/* Leads */}
                    {leads.length > 0 && (
                        <div className="flex flex-col items-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-orange-400 blur-md opacity-20 rounded-full"></div>
                                <span className="relative px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30">
                                    Leads & Advisors
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6 w-full">
                                {leads.map(member => (
                                    <div key={member._id} className="w-full md:w-96">
                                        <GlowCard member={member} onEdit={() => onEdit(member)} onDelete={() => onDelete(member._id)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Core */}
                    {core.length > 0 && (
                        <div className="flex flex-col items-center pt-8 border-t border-orange-100/50">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 bg-white/50 px-4 py-1 rounded-full border border-gray-100">Core Team</h4>
                            <div className="flex flex-wrap justify-center gap-6 w-full">
                                {core.map(member => (
                                    <div key={member._id} className="w-full md:w-96">
                                        <GlowCard member={member} onEdit={() => onEdit(member)} onDelete={() => onDelete(member._id)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General */}
                    {general.length > 0 && (
                        <div className="flex flex-col items-center pt-8 border-t border-orange-100/50">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 bg-white/50 px-4 py-1 rounded-full border border-gray-100">Members</h4>
                            <div className="flex flex-wrap justify-center gap-6 w-full">
                                {general.map(member => (
                                    <div key={member._id} className="w-full md:w-96">
                                        <GlowCard member={member} onEdit={() => onEdit(member)} onDelete={() => onDelete(member._id)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);


const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border-2 border-orange-100"
                >
                    <div className="p-6 border-b border-orange-50 flex justify-between items-center bg-orange-50/30">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-orange-100 rounded-full text-gray-400 hover:text-orange-600 transition-colors"><X size={20} /></button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

export default ManageMembers;
