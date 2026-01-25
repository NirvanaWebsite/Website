import { Github, Twitter, Linkedin, Mail, Heart, X, Check } from 'lucide-react'
import { useState } from 'react'

const Footer = () => {
  const [showTos, setShowTos] = useState(false);
  const [tosAgreed, setTosAgreed] = useState(false);

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Team', href: '/members' },
    ],
    community: [
      { name: 'Join Now', href: '/' },
      { name: 'Events', href: '#' },
      { name: 'Blogs', href: '/blogs' },
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'Terms of Service', action: () => setShowTos(true) }
    ]
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:nirvana.club@iiits.in', label: 'Email' }
  ]

  return (
    <footer className="bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
              Nirvana Club
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Building the future of community engagement through innovation,
              collaboration, and meaningful connections. Join us on this incredible journey.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="text-gray-400 hover:text-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Get the latest news and updates from Nirvana Club.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-primary hover:bg-orange-600 px-6 py-2 rounded-r-lg font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Nirvana Club. All rights reserved.
          </p>

          <div className="flex items-center text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1 animate-pulse" />
            <span>by the Nirvana Club team</span>
          </div>
        </div>
      </div>

      {/* Terms of Service Popup */}
      {showTos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Terms of Service</h2>
                <p className="text-sm text-gray-500 mt-1">Please review our community guidelines</p>
              </div>
              <button
                onClick={() => setShowTos(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3">I</span>
                  Welcome to the Circle
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  Welcome to Nirvana Club. We are a community dedicated to spiritual growth, mindfulness, and meaningful connection. By joining, you agree to help us maintain a safe, sacred, and respectful space for everyone.
                </p>
              </section>

              <section className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-sm font-bold mr-3">II</span>
                  Medical & Mental Health Disclaimer
                </h3>
                <p className="text-red-700 leading-relaxed pl-11 font-medium">
                  Not Medical Advice: The content, events, and discussions within Nirvana Club are for educational and spiritual purposes only. They are not a substitute for professional medical advice, diagnosis, or therapy. If you are experiencing a mental health crisis, please consult a professional healthcare provider.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3">III</span>
                  Code of Conduct
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Respect & Safety:</strong> We practice non-judgment and compassion. Harassment, hate speech, or predatory behavior of any kind will result in immediate termination of your account. We ask that you respect the diverse spiritual paths of all members.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3">IV</span>
                  Privacy & Confidentiality
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Shared Trust:</strong> Discussions in our community often involve personal vulnerabilities. You agree not to share, screenshot, or distribute private stories or personal experiences shared by other members without their explicit consent.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3">V</span>
                  Limitation of Liability
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Personal Responsibility:</strong> Your participation in any Nirvana Club activity is voluntary. You agree that Nirvana Club and its organizers are not liable for any personal injury, emotional distress, or other damages that may result from your participation.
                </p>
              </section>
            </div>

            {/* Footer Action Area */}
            <div className="p-8 border-t border-gray-100 bg-gray-50 space-y-4">
              <label className="flex items-start cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={tosAgreed}
                    onChange={(e) => setTosAgreed(e.target.checked)}
                  />
                  <div className="w-6 h-6 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/20 transition-all flex items-center justify-center">
                    <Check size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                  I have read and agree to the Terms of Service and Community Guidelines.
                </span>
              </label>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowTos(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    if (tosAgreed) {
                      setShowTos(false);
                      // Additional logic for acceptance could go here
                    }
                  }}
                  disabled={!tosAgreed}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all transform ${tosAgreed
                    ? 'bg-gradient-to-r from-primary to-orange-600 hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                  I Honor These Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
