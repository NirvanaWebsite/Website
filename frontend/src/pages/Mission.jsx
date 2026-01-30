import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Heart, Users, CheckCircle } from 'lucide-react';

const Mission = () => {
    const values = [
        {
            title: "Ancient Wisdom",
            description: "We believe in the timeless relevance of traditional knowledge systems and their power to guide modern life.",
            icon: <BookOpen className="w-8 h-8 text-orange-600" />
        },
        {
            title: "Modern Innovation",
            description: "Embracing technology and contemporary methods to solve today's challenges while staying rooted in values.",
            icon: <Lightbulb className="w-8 h-8 text-orange-600" />
        },
        {
            title: "Holistic Growth",
            description: "Nurturing the physical, mental, and spiritual aspects of every individual for true success.",
            icon: <Heart className="w-8 h-8 text-orange-600" />
        },
        {
            title: "Community First",
            description: "Building a supportive environment where knowledge is shared and every member lifts others up.",
            icon: <Users className="w-8 h-8 text-orange-600" />
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-24 pb-20 font-sans">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Wisdom</span> <br />
                        & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Innovation</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Nirvana Club is a sanctuary for those seeking to balance the fast-paced modern world with the grounding depth of ancient philosophy.
                    </p>
                </motion.div>
            </div>

            {/* Who We Are */}
            <div className="bg-orange-50 py-20 mb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">Our Mission</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Empowering the Next Generation of Thought Leaders</h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                We are on a mission to create a vibrant ecosystem where students can explore their inner potential while mastering external skills. We believe that true success comes from a harmonic balance of professional excellence and personal well-being.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Through workshops, discussions, and collaborative projects, we provide the tools for self-discovery and holistic development.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-2xl transform rotate-3 scale-105 opacity-50 blur-lg"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">Why Nirvana?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Integrate ethics with technology",
                                        "Cultivate mindfulness in daily life",
                                        "Build meaningful connections",
                                        "Lead with purpose and clarity"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                                            <div className="p-1 bg-green-100 rounded-full">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Core Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">Our Values</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2">The Pillars of Nirvana</h2>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all duration-300 group"
                        >
                            <div className="mb-6 check-bg p-3 inline-block rounded-xl bg-orange-50 group-hover:bg-orange-100 transition-colors">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Community CTA */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-3xl p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Find Your Balance?</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Join a community of like-minded individuals who are redefining success. Connect, learn, and grow with us.
                        </p>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-900/50">
                            Join the Community
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Mission;
