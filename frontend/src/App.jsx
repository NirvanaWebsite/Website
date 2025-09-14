import { SignedIn, SignedOut } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Mission from './components/Mission'
import Alumni from './components/Alumni'
import Features from './components/Features'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <SignedOut>
        <Hero />
        <About />
        <Mission />
        <Alumni />
        <Features />
        <Team />
        <Contact />
        <Footer />
      </SignedOut>
      
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  )
}

export default App
