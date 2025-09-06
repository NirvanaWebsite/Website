import { SignedIn, SignedOut } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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
