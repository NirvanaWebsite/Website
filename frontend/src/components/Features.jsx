import { Users, Calendar, MessageCircle, Trophy, Zap, Shield } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with like-minded individuals and build lasting relationships in our vibrant community.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Exclusive Events',
      description: 'Access premium workshops, networking events, and masterclasses led by industry experts.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Engage in meaningful conversations with instant messaging and discussion forums.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and recognition for your contributions and active participation.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Innovation Hub',
      description: 'Collaborate on cutting-edge projects and bring your innovative ideas to life.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your privacy and data security are our top priorities with enterprise-grade protection.',
      gradient: 'from-red-500 to-pink-500'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Modern Communities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the tools and features that make Nirvana Club the perfect platform 
            for building meaningful connections and achieving your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-orange-100 rounded-full">
            <span className="text-primary font-medium">Ready to explore all features?</span>
            <button className="ml-4 bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
