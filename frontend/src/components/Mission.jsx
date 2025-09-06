import { Compass, Star, Users2, Zap, Shield, Rocket } from 'lucide-react'

const Mission = () => {
  const missionPillars = [
    {
      icon: <Compass className="w-10 h-10 text-blue-600" />,
      title: "Guidance & Direction",
      description: "Providing clear pathways for personal and professional development through mentorship and structured programs.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users2 className="w-10 h-10 text-green-600" />,
      title: "Inclusive Community",
      description: "Creating a welcoming space where diversity is celebrated and every voice is heard and valued.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Star className="w-10 h-10 text-yellow-600" />,
      title: "Excellence in Everything",
      description: "Maintaining the highest standards in all our activities, events, and member interactions.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Zap className="w-10 h-10 text-purple-600" />,
      title: "Innovation & Growth",
      description: "Embracing new technologies and methodologies to continuously evolve and improve our offerings.",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const objectives = [
    {
      title: "Foster Personal Growth",
      description: "Empower members to discover their potential through workshops, seminars, and peer learning opportunities."
    },
    {
      title: "Build Lasting Connections",
      description: "Create meaningful relationships that extend beyond club activities and enrich members' personal and professional lives."
    },
    {
      title: "Promote Knowledge Sharing",
      description: "Facilitate the exchange of ideas, experiences, and expertise among our diverse membership base."
    },
    {
      title: "Drive Social Impact",
      description: "Engage in community service and initiatives that make a positive difference in society."
    },
    {
      title: "Cultivate Leadership",
      description: "Develop the next generation of leaders through mentorship programs and leadership opportunities."
    },
    {
      title: "Celebrate Achievements",
      description: "Recognize and honor the accomplishments of our members and the collective success of our community."
    }
  ]

  return (
    <section id="mission" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-primary to-orange-600 rounded-full">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To empower individuals through meaningful connections, continuous learning, and shared experiences 
            that inspire personal growth and create lasting positive impact in our community and beyond.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl p-8 md:p-12 mb-20 text-white">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h3>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
              "We are dedicated to creating an environment where every individual can flourish, 
              where ideas are nurtured, friendships are forged, and dreams are transformed into reality 
              through collective support and shared wisdom."
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-medium">Established 2019 • Growing Strong</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Pillars */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">Our Foundation</h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Four core pillars that guide everything we do and shape the experience of every member
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionPillars.map((pillar, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100">
                  <div className="text-center space-y-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${pillar.color} shadow-lg`}>
                      {pillar.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{pillar.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">What We Strive For</h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our key objectives that drive our programs, events, and community initiatives
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                <h4 className="text-lg font-bold text-gray-900 mb-3">{objective.title}</h4>
                <p className="text-gray-600 leading-relaxed">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">Our Vision for the Future</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              To become the premier community platform that serves as a catalyst for personal transformation, 
              professional excellence, and social impact, inspiring members to reach their highest potential 
              while contributing meaningfully to society.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">2030</div>
                <div className="text-gray-300">Global Reach Goal</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">10K+</div>
                <div className="text-gray-300">Members Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
                <div className="text-gray-300">Partner Organizations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Join Our Mission</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Be part of something bigger. Help us create a community where everyone can thrive, 
            grow, and make a meaningful impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
              Become a Member
            </button>
            <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mission
