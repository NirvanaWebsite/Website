
import { Users, Target, Heart, Award, Globe, Lightbulb } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Passion",
      description: "We believe in pursuing what you love with unwavering dedication and enthusiasm."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Community",
      description: "Building meaningful connections and fostering a supportive environment for all members."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Excellence",
      description: "Striving for the highest standards in everything we do, from events to member experiences."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Innovation",
      description: "Embracing new ideas and creative approaches to enhance our club's offerings."
    }
  ]

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "50+", label: "Events Hosted" },
    { number: "5", label: "Years of Excellence" },
    { number: "100%", label: "Member Satisfaction" }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Nirvana Club</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A premier community dedicated to fostering personal growth, meaningful connections, 
            and unforgettable experiences. Join us on a journey towards enlightenment and excellence.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded with a vision to create a space where individuals can discover their true potential, 
              Nirvana Club has evolved into a thriving community of like-minded individuals who share a 
              passion for growth, learning, and meaningful connections.
            </p>
            <p className="text-gray-600 leading-relaxed">
              What started as a small gathering of friends has grown into a dynamic organization that 
              hosts diverse events, workshops, and activities designed to inspire, educate, and entertain 
              our members while fostering lasting friendships.
            </p>
            <div className="flex items-center space-x-4">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-gray-700 font-medium">Connecting minds, inspiring hearts</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
              <p className="text-lg leading-relaxed">
                To create an inclusive environment where every member can explore their interests, 
                develop new skills, and build meaningful relationships that last a lifetime.
              </p>
              <div className="mt-6 flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span className="font-medium">Excellence in Community Building</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Impact</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-orange-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Looking Forward</h3>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            As we continue to grow, our commitment remains unchanged: to provide a platform where 
            every member can thrive, contribute, and find their own path to nirvana. Join us as we 
            build the future of community engagement and personal development.
          </p>
          <div className="mt-8">
            <button className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
              Become a Member
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
