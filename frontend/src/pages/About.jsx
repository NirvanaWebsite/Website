import { motion } from 'framer-motion';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Who Are We Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 tracking-tight">
                        WHO ARE <span className="text-orange-600">WE?</span>
                    </h1>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80"></div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Nirvana is a vibrant community at IIIT Sri City, dedicated to empowering students through the fusion of ancient wisdom and modern knowledge. We bring together passionate individuals who are keen to explore the depths of traditional Indian Knowledge Systems while connecting them with contemporary sciences.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our community is open to everyone, from students to professionals, who share an interest in meditation, yoga, and holistic well-being. Starting with a vision to help students lead balanced and successful lives, Nirvana has grown to host a variety of events including workshops, guest lectures, and reading sessions, fostering an environment of personal growth, knowledge sharing, and spiritual exploration.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default About;
