import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Linkedin } from 'lucide-react';
import TreeNode from './TreeNode';

const YearSection = ({ year, members }) => {

    const { clubLeadership, domains } = useMemo(() => {
        const clubLeadership = [];
        const domainMap = {};

        members.forEach(member => {
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

        const sortedDomains = Object.entries(domainMap).sort((a, b) => a[0].localeCompare(b[0]));

        return { clubLeadership, domains: sortedDomains };
    }, [members]);

    // --- Premium Card Component (Matches ManageMembers.jsx) ---
    const GlowCard = ({ member }) => (
        <div className="relative group perspective-1000 w-full">
            {/* Soft Orange Glow Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-300 via-orange-100 to-transparent rounded-2xl opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50 h-full p-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]">

                {/* Glossy sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

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

                    <div className="flex-1 min-w-0 pr-4 bg-gradient-to-r from-transparent via-transparent to-transparent">
                        <h4 className="font-bold text-gray-900 text-lg truncate leading-tight">{member.name}</h4>
                        <p className="text-sm font-bold text-orange-500 mb-0.5 truncate">{member.role}</p>
                        <p className="text-xs text-gray-400 font-medium truncate tracking-wide">{member.domain || 'Club Member'}</p>
                    </div>

                    {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#0077b5] transition-colors p-2 hover:bg-blue-50/50 rounded-lg relative z-10">
                            <Linkedin size={20} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    const DomainSection = ({ title, members }) => {
        if (!members || members.length === 0) return null;

        // Group by hierarchy within domain
        const { leads, core, general } = members.reduce((acc, member) => {
            const r = member.role.toLowerCase();
            if (r.includes('advisor')) acc.leads.push(member);
            else if (r.includes('lead') || r.includes('head')) acc.leads.push(member);
            else if (r.includes('core')) acc.core.push(member);
            else acc.general.push(member);
            return acc;
        }, { leads: [], core: [], general: [] });

        return (
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
                                                <GlowCard member={member} />
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
                                                <GlowCard member={member} />
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
                                                <GlowCard member={member} />
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
    };

    return (
        <div className="mb-32 relative">

            {/* Year Header */}
            <div className="flex items-center justify-center mb-16 px-4">
                <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-xs opacity-50"></div>
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-orange-400 mx-4 md:mx-8 tracking-tighter drop-shadow-sm text-center">{year}</h2>
                <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-xs opacity-50"></div>
            </div>

            {/* Club Leadership Section */}
            {clubLeadership.length > 0 && (
                <div className="mb-20">
                    <div className="flex justify-center mb-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-orange-400 blur-lg opacity-40 rounded-full group-hover:opacity-60 transition duration-500"></div>
                            <span className="relative flex items-center gap-3 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400 text-white px-10 py-3 rounded-full text-base font-bold uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 border border-white/20">
                                <span className="text-orange-200">★</span> Club Leadership <span className="text-orange-200">★</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
                        {clubLeadership.map((member) => (
                            <div key={member._id} className="w-full md:w-96">
                                <GlowCard member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Domains Grid */}
            <div className="flex flex-col gap-8 px-4 max-w-7xl mx-auto">
                {domains.map(([domainName, members]) => (
                    <DomainSection key={domainName} title={domainName} members={members} />
                ))}
            </div>

        </div>
    );
};

export default YearSection;
