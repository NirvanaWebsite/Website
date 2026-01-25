import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const updates = [
    { type: 'blog', text: 'New blog will be uploaded every week stay tuned', time: '', icon: FileText, color: 'text-orange-500' },
    { type: 'blog', text: 'New blog will be uploaded every week stay tuned', time: '', icon: FileText, color: 'text-orange-500' },
    { type: 'blog', text: 'New blog will be uploaded every week stay tuned', time: '', icon: FileText, color: 'text-orange-500' },
];

const CommunityPulse = () => {
    return (
        <div className="w-full bg-orange-50/50 border-y border-orange-100 overflow-hidden py-3 relative">
            <div className="flex w-max">
                {/* Infinite Loop: Duplicate the list twice to ensure smooth scrolling */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex space-x-12 px-6"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 20, // Adjust speed here
                        }}
                    >
                        {updates.map((update, idx) => (
                            <Link
                                key={idx}
                                to="/blogs"
                                className="flex items-center space-x-3 whitespace-nowrap group cursor-pointer hover:bg-orange-50 px-4 py-2 rounded-full transition-colors"
                            >
                                <div className={`p-1.5 rounded-full bg-white shadow-sm border border-gray-100 ${update.color}`}>
                                    <update.icon size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                                        {update.text}
                                    </span>
                                    {update.time && (
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            {update.time}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                ))}
            </div>

            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default CommunityPulse;
