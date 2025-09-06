import { GraduationCap, MapPin, Briefcase, Calendar, Star, Award, Users, Trophy } from 'lucide-react'

const Alumni = () => {

  const alumniByYear = [
    { year: "2023", count: 45, description: "Recent graduates making their mark" },
    { year: "2022", count: 38, description: "Established professionals in various fields" },
    { year: "2021", count: 42, description: "Industry leaders and innovators" },
    { year: "2020", count: 35, description: "Pioneers who adapted during challenging times" },
    { year: "2019", count: 40, description: "Founding members who set the standard" }
  ]

  const achievements = [
    "15 alumni have founded successful startups",
    "25+ published research papers and patents",
    "Alumni working in Fortune 500 companies",
    "Global presence across 6 continents",
    "Active mentorship network of 150+ professionals",
    "Annual alumni giving rate of 78%"
  ]

  return (
    <section id="alumni" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Alumni</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Celebrating the achievements of our distinguished alumni who continue to make a positive impact 
            in their communities and industries worldwide.
          </p>
        </div>


        {/* Alumni by Year */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Alumni by Graduation Year</h3>
          <div className="grid md:grid-cols-5 gap-6">
            {alumniByYear.map((yearData, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-indigo-600 mb-2">{yearData.year}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{yearData.count}</div>
                <div className="text-sm text-gray-600">{yearData.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Collective Achievements</h3>
            <p className="text-indigo-100 text-lg max-w-3xl mx-auto">
              Our alumni network continues to grow and achieve remarkable milestones across various industries
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni Network */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Join Our Alumni Network</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Stay connected with fellow alumni, mentor current members, and continue growing your professional network. 
            Your journey with Nirvana Club doesn't end at graduation—it evolves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
              Update Your Profile
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
              Alumni Directory
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Alumni
