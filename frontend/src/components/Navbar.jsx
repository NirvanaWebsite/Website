import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/about' },
    { name: 'Mission', href: '/mission' },
    { name: 'Team', href: '/members' },
    { name: 'Features', href: '/#features' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/#contact' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <HashLink smooth to="/#home" className="flex items-center space-x-3">
              <img
                src="/nirvanalogo.png"
                alt="Nirvana Club Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                Nirvana Club
              </h1>
            </HashLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <HashLink
                  key={link.name}
                  smooth
                  to={link.href}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </HashLink>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
                  Login / Sign Up
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Dashboard"
                    labelIcon={<LayoutDashboard size={14} />}
                    onClick={() => navigate('/dashboard')}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <HashLink
                key={link.name}
                smooth
                to={link.href}
                className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </HashLink>
            ))}
            <div className="pt-4 pb-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
                    Login / Sign Up
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/">
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="Dashboard"
                        labelIcon={<LayoutDashboard size={14} />}
                        onClick={() => navigate('/dashboard')}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
