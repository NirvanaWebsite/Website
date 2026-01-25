import { motion } from 'framer-motion';

const Mission = () => {
    const goals = [
        "Promote Inner Well-being",
        "Foster Holistic Success",
        "Encourage Self-Discovery",
        "Facilitate Knowledge Sharing"
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Our Goals Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
                        OUR <span className="text-orange-600">GOALS</span>
                    </h1>

                    <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 text-lg">
                        At Nirvana, our primary goal is to empower individuals to lead balanced, successful lives by integrating ancient wisdom with modern knowledge.
                    </p>

                    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                        {goals.map((goal, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:border-orange-200 hover:shadow-lg transition-all duration-300 text-center hover:transform hover:scale-[1.02] cursor-default group"
                            >
                                <h3 className="text-xl font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{goal}</h3>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Mission;
