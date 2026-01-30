import { Github, Linkedin, Mail, Heart, X, Check, ArrowRight } from 'lucide-react'
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
    { icon: Github, href: 'https://github.com/nirvanaclub-debug', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/nirvana-iiits/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:nirvana.club@iiits.in', label: 'Email' }
  ]

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden font-sans border-t border-white/10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent mb-6 tracking-tight">
              Nirvana Club
            </h3>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
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
                  className="w-12 h-12 bg-white/5 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-white/10 hover:border-transparent group"
                >
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-orange-400 transition-colors duration-200 block text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Community</h4>
            <ul className="space-y-4">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-orange-400 transition-colors duration-200 block text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 md:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Stay Updated</h4>
            <p className="text-gray-400 mb-6 text-sm">
              Get the latest news and updates from Nirvana Club relative to events and more.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 transition-all"
                />
                <button className="absolute right-2 top-2 p-1 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>

              <ul className="space-y-2 mt-4">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    {link.action ? (
                      <button onClick={link.action} className="text-gray-500 hover:text-orange-400 text-sm transition-colors text-left flex items-center gap-2">
                        {link.name}
                      </button>
                    ) : (
                      <a href={link.href} className="text-gray-500 hover:text-orange-400 text-sm transition-colors flex items-center gap-2">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left font-medium">
            © {new Date().getFullYear()} Nirvana Club. All rights reserved.
          </p>

          <div className="flex items-center text-gray-500 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1.5 animate-pulse fill-red-500" />
            <span>in Sri City</span>
          </div>
        </div>
      </div>

      {/* Terms of Service Popup */}
      {showTos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Terms of Service</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Community Guidelines & Agreements</p>
              </div>
              <button
                onClick={() => setShowTos(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3 ring-2 ring-orange-50">I</span>
                  Welcome to the Circle
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  Welcome to Nirvana Club. We are a community dedicated to spiritual growth, mindfulness, and meaningful connection. By joining, you agree to help us maintain a safe, sacred, and respectful space for everyone.
                </p>
              </section>

              <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-sm font-bold mr-3 ring-2 ring-red-100">II</span>
                  Medical & Mental Health Disclaimer
                </h3>
                <p className="text-red-700 leading-relaxed pl-11 font-medium text-sm">
                  Not Medical Advice: The content, events, and discussions within Nirvana Club are for educational and spiritual purposes only. They are not a substitute for professional medical advice, diagnosis, or therapy. If you are experiencing a mental health crisis, please consult a professional healthcare provider.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3 ring-2 ring-orange-50">III</span>
                  Code of Conduct
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Respect & Safety:</strong> We practice non-judgment and compassion. Harassment, hate speech, or predatory behavior of any kind will result in immediate termination of your account. We ask that you respect the diverse spiritual paths of all members.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3 ring-2 ring-orange-50">IV</span>
                  Privacy & Confidentiality
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Shared Trust:</strong> Discussions in our community often involve personal vulnerabilities. You agree not to share, screenshot, or distribute private stories or personal experiences shared by other members without their explicit consent.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mr-3 ring-2 ring-orange-50">V</span>
                  Limitation of Liability
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  <strong>Personal Responsibility:</strong> Your participation in any Nirvana Club activity is voluntary. You agree that Nirvana Club and its organizers are not liable for any personal injury, emotional distress, or other damages that may result from your participation.
                </p>
              </section>
            </div>

            {/* Footer Action Area */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm space-y-6">
              <label className="flex items-start cursor-pointer group p-2 hover:bg-white rounded-xl transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={tosAgreed}
                    onChange={(e) => setTosAgreed(e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 peer-focus:ring-2 peer-focus:ring-orange-500/20 transition-all flex items-center justify-center">
                    <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                  I have read and agree to the <span className="font-semibold text-orange-600">Terms of Service</span> and Community Guidelines.
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowTos(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    if (tosAgreed) {
                      setShowTos(false);
                    }
                  }}
                  disabled={!tosAgreed}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${tosAgreed
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-orange-500/25 hover:-translate-y-0.5'
                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                    }`}
                >
                  Accept & Join Circle
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
