import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import React, { useEffect } from 'react'

const Hero = () => {
  // Mouse position state for parallax
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth spring animation for mouse movement
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 })
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    // Calculate position from center (-1 to 1)
    x.set((clientX / innerWidth) - 0.5)
    y.set((clientY / innerHeight) - 0.5)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Parallax transforms for different layers
  const x1 = useTransform(mouseX, [-0.5, 0.5], [-50, 50])
  const y1 = useTransform(mouseY, [-0.5, 0.5], [-50, 50])

  const x2 = useTransform(mouseX, [-0.5, 0.5], [30, -30])
  const y2 = useTransform(mouseY, [-0.5, 0.5], [30, -30])

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden perspective-1000">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100/50"></div>

      {/* Interactive Floating Elements */}
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"
      ></motion.div>

      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute bottom-40 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl delay-1000"
      ></motion.div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center perspective-1000">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo with 3D Float */}
          <motion.div
            className="flex justify-center perspective-1000"
            style={{
              rotateX: useTransform(mouseY, [-0.5, 0.5], [10, -10]),
              rotateY: useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
            }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-colors duration-500"></div>
              <img
                src="/nirvanalogo.png"
                alt="Nirvana Club Logo"
                className="relative w-56 h-56 md:w-64 md:h-64 object-contain drop-shadow-2xl transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-6 py-2 bg-white/80 backdrop-blur-md rounded-full border border-orange-100 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-all cursor-default"
          >
            <Sparkles className="w-4 h-4 text-orange-500 mr-2 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Welcome to the Future of Community</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Nirvana Club
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Where innovation meets community. Join a vibrant ecosystem of creators,
            thinkers, and dreamers building the future together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <SignedOut>
              <SignInButton mode="modal">
                <button className="group relative bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center">
                    Join Nirvana Club
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </SignInButton>
            </SignedOut>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
