import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, Github, Twitter, User } from 'lucide-react';

const members = [
    {
        id: 1,
        name: 'Himanshu Saraswat',
        role: 'Co-Founder',
        image: '/Himanshu.png',
        bio: 'Visionary leader building the future of community engagement.',
        socials: { linkedin: 'https://www.linkedin.com/in/himanshu-saraswat-763843258/', github: 'https://github.com/Himanshu-Saraswat-01122004' }
    },
    {
        id: 2,
        name: 'Aahnik Daw',
        role: 'Co-Founder',
        image: '/aahnik.png',
        bio: 'Tech enthusiast creating innovative platforms and solutions.',
        socials: { linkedin: 'https://www.linkedin.com/in/aahnik/', twitter: 'https://github.com/aahnik' }
    },
    {
        id: 3,
        name: 'Raghvendra CVS',
        role: 'Co-Founder',
        image: '/raghvendra.png',
        bio: 'Strategic thinker focused on scalable user experiences.',
        socials: { linkedin: 'https://www.linkedin.com/in/raghvendra-cvs-07b53b258/' }
    },

];

const MemberSpotlight = () => {
    const [activeIndex, setActiveIndex] = useState(1); // Start with center founder

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % members.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
    };

    const getCardStyle = (index) => {
        const distance = (index - activeIndex + members.length) % members.length;
        const offset = distance > members.length / 2 ? distance - members.length : distance;

        // Only show 3 cards: center, left, right
        if (Math.abs(offset) > 1) return { opacity: 0, scale: 0, x: 0, zIndex: 0 };

        const xOffset = offset * 280; // Distance between cards
        const scale = offset === 0 ? 1.1 : 0.85;
        const opacity = offset === 0 ? 1 : 0.5;
        const zIndex = offset === 0 ? 10 : 5;
        const rotateY = offset === 0 ? 0 : offset > 0 ? -15 : 15;

        return {
            x: xOffset,
            scale,
            opacity,
            zIndex,
            rotateY,
            display: 'block'
        };
    };

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm bg-orange-50 px-4 py-2 rounded-full border border-orange-100 mb-4 inline-block">
                        Community Legends
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Member <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Spotlight</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Meet the visionaries and top contributors shaping the future of Nirvana Club.
                    </p>
                </motion.div>

                {/* 3D Carousel Container */}
                <div className="relative h-[500px] flex items-center justify-center perspective-1000">
                    {members.map((member, index) => {
                        const style = getCardStyle(index);
                        if (style.display === 'none') return null;

                        return (
                            <motion.div
                                key={member.id}
                                className="absolute top-1/2 left-1/2 w-[320px] md:w-[380px] bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
                                initial={false}
                                animate={{
                                    x: `calc(-50% + ${style.x}px)`,
                                    y: '-50%',
                                    scale: style.scale,
                                    opacity: style.opacity,
                                    zIndex: style.zIndex,
                                    rotateY: style.rotateY
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Premium Card Content (Matches GlowCard) */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-orange-400 to-red-500 mb-6 shadow-lg">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-white">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                    <User size={40} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <span className="px-3 py-1 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                        {member.role}
                                    </span>

                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        "{member.bio}"
                                    </p>

                                    <div className="flex gap-4">
                                        {member.socials.linkedin && (
                                            <a href={member.socials.linkedin} className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors">
                                                <Linkedin size={20} />
                                            </a>
                                        )}
                                        {member.socials.github && (
                                            <a href={member.socials.github} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors">
                                                <Github size={20} />
                                            </a>
                                        )}
                                        {member.socials.twitter && (
                                            <a href={member.socials.twitter} className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-400 rounded-full transition-colors">
                                                <Twitter size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Background Gradient for Active Card */}
                                {style.scale > 1 && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-50 rounded-3xl -z-10"></div>
                                )}
                            </motion.div>
                        );
                    })}

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-20 z-50 p-4 bg-white/80 backdrop-blur rounded-full shadow-lg text-gray-800 hover:text-orange-600 hover:scale-110 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-20 z-50 p-4 bg-white/80 backdrop-blur rounded-full shadow-lg text-gray-800 hover:text-orange-600 hover:scale-110 transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MemberSpotlight;
