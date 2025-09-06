import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const Team = () => {
  const teamMembers = [
    {
      name: 'Himanshu Saraswat',
      role: 'Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Visionary leader with expertise in community building and tech innovation.',
      socials: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Aahnik Daw',
      role: 'Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Tech enthusiast passionate about creating innovative solutions and platforms.',
      socials: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Raghvendra CVS',
      role: 'Co-Founder',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Strategic thinker focused on building scalable and user-centric experiences.',
      socials: {
        github: '#',
        linkedin: '#',
        twitter: '#'
      }
    }
  ]

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'twitter': return Twitter
      case 'linkedin': return Linkedin
      case 'github': return Github
      case 'mail': return Mail
      default: return Mail
    }
  }

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our{' '}
            <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The visionary founders behind Nirvana Club, dedicated to building 
            the future of community engagement and innovation.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-primary/20 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Member Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-3">
                {Object.entries(member.socials).map(([platform, url]) => {
                  const IconComponent = getSocialIcon(platform)
                  return (
                    <a
                      key={platform}
                      href={url}
                      className="p-2 bg-gray-100 hover:bg-primary text-gray-600 hover:text-white rounded-full transition-all duration-200 transform hover:scale-110"
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Join Our Team?</h3>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals who share our passion for building amazing communities.
            </p>
            <button className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
