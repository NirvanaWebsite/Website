import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const mentor = {
        name: "Dr. Piyush Joshi",
        role: "Assistant Professor",
        department: "Department of Computer Science and Engineering",
        image: "/Piyush Sir.png",
        address: "302, 2nd Floor, Academic Building, IIIT Sri City, Chittoor, Andhra Pradesh - 517 646, India.",
        email: "piyush.j@iiits.in",
        phone: "+91 89770 08535",
        profileLink: "https://iiits.ac.in/people/regular-faculty/dr-piyush-joshi/"
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Who Are We Section */}
                {/* Who Are We Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.8 }}
                    className="mb-24"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 tracking-tight text-gray-900">
                        WHO ARE <span className="text-orange-600">WE?</span>
                    </h1>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50"></div>
                                <div className="relative z-10">
                                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                        <span className="text-orange-600 font-bold text-xl">Nirvana</span> is a vibrant community at IIIT Sri City, dedicated to empowering students through the fusion of ancient wisdom and modern knowledge. We bring together passionate individuals who are keen to explore the depths of traditional Indian Knowledge Systems while connecting them with contemporary sciences.
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Our community is open to everyone, from students to professionals, who share an interest in meditation, yoga, and holistic well-being. Starting with a vision to help students lead balanced and successful lives, Nirvana has grown to host a variety of events including workshops, guest lectures, and reading sessions.
                                    </p>
                                </div>
                            </div>

                            <div className="order-1 md:order-2 flex justify-center items-center relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-transparent rounded-full opacity-20 blur-3xl transform scale-75"></div>
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    src="/nirvanalogo.png"
                                    alt="Nirvana Club Logo"
                                    className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* What We Do Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-24"
                >
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">Activities</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-gray-900">What We Do</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Workshops & Seminars",
                                desc: "Hands-on sessions on mindfulness, stress management, and integrating ethics in technology.",
                                icon: "🎓"
                            },
                            {
                                title: "Yoga & Meditation",
                                desc: "Daily and weekly sessions dedicated to physical health and mental clarity.",
                                icon: "🧘"
                            },
                            {
                                title: "Guest Lectures",
                                desc: "Talks by eminent speakers from various fields sharing their life experiences and wisdom.",
                                icon: "🗣️"
                            },
                            {
                                title: "Reading Circles",
                                desc: "Group discussions on books related to philosophy, psychology, and personal growth.",
                                icon: "📚"
                            },
                            {
                                title: "Community Service",
                                desc: "Initiatives to give back to society and foster a sense of social responsibility.",
                                icon: "🤝"
                            },
                            {
                                title: "Cultural Events",
                                desc: "Celebrating festivals and traditions to stay connected with our rich heritage.",
                                icon: "🎉"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all"
                            >
                                <div className="text-4xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Impact Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-orange-600 rounded-3xl p-12 mb-24 text-white text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "50+", label: "Events Conducted" },
                            { number: "50+", label: "Active Members" },
                            { number: "20+", label: "Guest Speakers" },
                            { number: "1000+", label: "Lives Impacted" }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-orange-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
                        <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Mentor</h2>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                        <div className="grid md:grid-cols-12 gap-0">
                            {/* Image Section */}
                            <div className="md:col-span-4 lg:col-span-3 bg-gray-100 relative overflow-hidden h-80 md:h-full">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                            </div>

                            {/* Details Section */}
                            <div className="md:col-span-8 lg:col-span-9 p-8 md:p-10 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                                    <p className="text-orange-600 font-medium text-lg">{mentor.role}</p>
                                    <p className="text-gray-500 text-sm">{mentor.department}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                        <p className="text-sm md:text-base">{mentor.address}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-6">
                                        <a href={`mailto:${mentor.email}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group/link">
                                            <Mail className="w-5 h-5 text-orange-500 group-hover/link:scale-110 transition-transform" />
                                            <span className="text-sm md:text-base">{mentor.email}</span>
                                        </a>
                                        <a href={`tel:${mentor.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group/link">
                                            <Phone className="w-5 h-5 text-orange-500 group-hover/link:scale-110 transition-transform" />
                                            <span className="text-sm md:text-base">{mentor.phone}</span>
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <a
                                        href={mentor.profileLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-white bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <span>View Faculty Profile</span>
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
