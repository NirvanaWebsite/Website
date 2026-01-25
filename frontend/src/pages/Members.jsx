import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Settings } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import YearSection from '../components/MembersTree/YearSection';
import Filters from '../components/MembersTree/Filters';
import SearchBar from '../components/MembersTree/SearchBar';

const Members = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        year: '',
        domain: '',
        role: ''
    });
    const [membersData, setMembersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user, isLoaded } = useUser();
    const { getToken } = useAuth(); // Assuming useAuth is imported or available; added import below if needed
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (user) {
                try {
                    const token = await window.Clerk?.session?.getToken();
                    const userRes = await fetch('http://localhost:5000/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userData = await userRes.json();
                    if (userData.success && userData.user.role === 'admin') {
                        setIsAdmin(true);
                    }
                } catch (e) {
                    console.error("Admin check failed", e);
                }
            }
        };
        checkAdmin();
    }, [user]);

    // Fetch members from API
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/members');
                const data = await response.json();

                // Group flat list back into year structure for the UI
                const groupedData = data.reduce((acc, member) => {
                    const yearGroup = acc.find(g => g.year === member.year);
                    if (yearGroup) {
                        yearGroup.members.push(member);
                    } else {
                        acc.push({ year: member.year, members: [member] });
                    }
                    return acc;
                }, []);

                // Sort Groups by year descending
                groupedData.sort((a, b) => b.year.localeCompare(a.year));

                // Sort members within each group: Lead > Co-Lead > Others
                const getRolePriority = (role) => {
                    const r = role.toLowerCase();
                    if (r.includes('founder')) return 3;
                    if (r.includes('club lead') || (r.includes('lead') && !r.includes('co-lead'))) return 2;
                    if (r.includes('co-lead')) return 1;
                    return 0;
                };

                groupedData.forEach(group => {
                    group.members.sort((a, b) => getRolePriority(b.role) - getRolePriority(a.role));
                });

                setMembersData(groupedData);
            } catch (error) {
                console.error('Error fetching members:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, []);

    // Extract unique values for filters
    const uniqueValues = useMemo(() => {
        const years = [...new Set(membersData.map(item => item.year))].sort().reverse();

        // Flatten all members to get domains and roles
        const allMembers = membersData.flatMap(item => item.members);
        const domains = [...new Set(allMembers.map(m => m.domain || 'Other').filter(Boolean))].sort();
        const roles = [...new Set(allMembers.map(m => m.role).filter(Boolean))].sort();

        return { years, domains, roles };
    }, [membersData]);

    // Filter logic
    const filteredData = useMemo(() => {
        return membersData
            .filter(yearGroup => {
                // Filter by Year
                if (filters.year && yearGroup.year !== filters.year) return false;
                return true;
            })
            .map(yearGroup => {
                // Filter members within each year
                const filteredMembers = yearGroup.members.filter(member => {
                    // Search filter
                    if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

                    // Domain filter
                    if (filters.domain && (member.domain || 'Other') !== filters.domain) return false;

                    // Role filter
                    if (filters.role && member.role !== filters.role) return false;

                    return true;
                });

                return {
                    ...yearGroup,
                    members: filteredMembers
                };
            })
            .filter(yearGroup => yearGroup.members.length > 0); // Remove empty years
    }, [searchTerm, filters, membersData]);

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12 relative">
                    {/* Admin Edit Button */}
                    {isAdmin && (
                        <div className="absolute top-0 right-0 md:bg-white md:p-1 md:rounded-full md:shadow-sm">
                            <button
                                onClick={() => navigate('/manage-members')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-gray-900/20"
                                title="Manage Team"
                            >
                                <Settings size={18} />
                                <span className="text-sm font-medium hidden md:inline">Edit Team</span>
                            </button>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-3 bg-orange-100 rounded-full mb-4 text-orange-600"
                    >
                        <Users size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Our Community
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Meet the diverse team of students behind Nirvana.
                    </motion.p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>

                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    uniqueValues={uniqueValues}
                />

                <div className="mt-8">
                    {filteredData.length > 0 ? (
                        filteredData.map(yearGroup => (
                            <YearSection
                                key={yearGroup.year}
                                year={yearGroup.year}
                                members={yearGroup.members}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No members found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setFilters({ year: '', domain: '', role: '' });
                                    setSearchTerm('');
                                }}
                                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Members;

